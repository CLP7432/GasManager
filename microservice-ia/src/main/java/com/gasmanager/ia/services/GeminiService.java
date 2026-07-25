package com.gasmanager.ia.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gasmanager.ia.dto.ChatRequestDTO;
import com.gasmanager.ia.dto.ChatResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${microservicio.ventas.url:http://localhost:8082}")
    private String ventasUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public ChatResponseDTO consultarIA(ChatRequestDTO request) {
        try {
            String datosContexto = obtenerDatosRelevantes(request.getMensaje());
            log.debug("Datos contexto obtenidos: {}", datosContexto.isEmpty() ? "(vacío)" : "(con datos)");
            String prompt = construirPromptConContexto(request, datosContexto);
            String respuesta = llamarGeminiAPI(prompt);

            return ChatResponseDTO.builder()
                    .respuesta(respuesta)
                    .modelo("Gemini 3 Flash")
                    .timestamp(LocalDateTime.now())
                    .exito(true)
                    .build();
        } catch (Exception e) {
            log.error("Error en consultarIA: {}", e.getMessage(), e);
            return ChatResponseDTO.builder()
                    .respuesta("Lo siento, en este momento no puedo procesar tu consulta. Por favor intenta más tarde.")
                    .timestamp(LocalDateTime.now())
                    .exito(false)
                    .error(e.getMessage())
                    .build();
        }
    }

    private String obtenerDatosRelevantes(String mensaje) {
        StringBuilder datos = new StringBuilder();
        String mensajeLower = mensaje.toLowerCase();

        try {
            if (mensajeLower.contains("última venta") || mensajeLower.contains("ultima venta")) {
                datos.append(obtenerUltimaVenta());
            }

            if (mensajeLower.contains("ventas hoy") || mensajeLower.contains("ventas de hoy")) {
                datos.append(obtenerVentasHoy());
            }

            if (mensajeLower.contains("magna") || mensajeLower.contains("premium") || mensajeLower.contains("diesel")) {
                datos.append(obtenerVentasPorTipo());
            }

            if (mensajeLower.contains("turno activo")) {
                datos.append(obtenerTurnoActivo());
            }

        } catch (Exception e) {
            log.warn("Error obteniendo datos relevantes: {}", e.getMessage());
            datos.append("No se pudieron obtener datos en tiempo real. ");
        }

        return datos.toString();
    }

    private String obtenerUltimaVenta() {
        try {
            String url = ventasUrl + "/api/ventas/consultas/ultima-venta";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());

                if (root.has("mensaje")) {
                    return "\n\nDATOS REALES - ÚLTIMA VENTA:\n" + root.path("mensaje").asText() + "\n";
                }

                StringBuilder sb = new StringBuilder();
                sb.append("\n\nDATOS REALES - ÚLTIMA VENTA:\n");
                sb.append("Folio: ").append(root.path("folio").asText()).append("\n");
                sb.append("Total: $").append(root.path("total").asDouble()).append("\n");
                sb.append("Fecha: ").append(root.path("fecha").asText()).append("\n");
                sb.append("Método de pago: ").append(root.path("metodoPago").asText()).append("\n");
                sb.append("Despachador: ").append(root.path("despachador").asText()).append("\n");

                JsonNode detalles = root.path("detalles");
                if (detalles.isArray() && detalles.size() > 0) {
                    sb.append("Productos:\n");
                    for (JsonNode detalle : detalles) {
                        sb.append("  - ").append(detalle.path("producto").asText())
                                .append(": ").append(detalle.path("cantidad").asDouble())
                                .append(" L → $").append(detalle.path("importe").asDouble()).append("\n");
                    }
                }
                return sb.toString();
            }
        } catch (Exception e) {
            log.warn("Error obteniendo última venta de {}: {}", ventasUrl, e.getMessage());
        }
        return "";
    }

    private String obtenerVentasHoy() {
        try {
            String url = ventasUrl + "/api/ventas/consultas/ventas-hoy";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());

                StringBuilder sb = new StringBuilder();
                sb.append("\n\nDATOS REALES - VENTAS DE HOY:\n");
                sb.append("Cantidad de ventas: ").append(root.path("cantidad").asInt()).append("\n");
                sb.append("Total recaudado: $").append(root.path("total").asDouble()).append("\n");
                return sb.toString();
            }
        } catch (Exception e) {
            log.warn("Error obteniendo ventas hoy de {}: {}", ventasUrl, e.getMessage());
        }
        return "";
    }

    private String obtenerVentasPorTipo() {
        try {
            String url = ventasUrl + "/api/ventas/consultas/ventas-por-tipo";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());

                StringBuilder sb = new StringBuilder();
                sb.append("\n\nDATOS REALES - VENTAS POR TIPO DE COMBUSTIBLE:\n");
                sb.append("Magna: $").append(root.path("MAGNA").asDouble()).append("\n");
                sb.append("Premium: $").append(root.path("PREMIUM").asDouble()).append("\n");
                sb.append("Diesel: $").append(root.path("DIESEL").asDouble()).append("\n");
                return sb.toString();
            }
        } catch (Exception e) {
            log.warn("Error obteniendo ventas por tipo de {}: {}", ventasUrl, e.getMessage());
        }
        return "";
    }

    private String obtenerTurnoActivo() {
        try {
            String url = ventasUrl + "/api/turnos?estado=ABIERTO";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.isArray() && root.size() > 0) {
                    JsonNode turno = root.get(0);
                    return "\n\nDATOS REALES - TURNO ACTIVO:\n" +
                            "Código: " + turno.path("codigoTurno").asText() + "\n" +
                            "Nombre: " + turno.path("nombre").asText() + "\n" +
                            "Hora inicio: " + turno.path("horaInicio").asText() + "\n";
                } else {
                    return "\n\nDATOS REALES - TURNO ACTIVO:\nNo hay ningún turno activo actualmente.\n";
                }
            }
        } catch (Exception e) {
            log.warn("Error obteniendo turno activo de {}: {}", ventasUrl, e.getMessage());
        }
        return "";
    }

    private String construirPromptConContexto(ChatRequestDTO request, String datosReales) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Eres GasManager Assistant, un asistente virtual para una gasolinera. ");
        prompt.append("Ayudas a despachadores, supervisores y administradores con información ");
        prompt.append("sobre ventas, inventario, turnos y cortes. Responde de manera clara, ");
        prompt.append("concisa y amigable. ");

        if (request.getContexto() != null) {
            prompt.append("El usuario está en el módulo de ").append(request.getContexto()).append(". ");
        }

        prompt.append("Usuario: ").append(request.getUsuarioNombre() != null ? request.getUsuarioNombre() : "Usuario");

        if (!datosReales.isEmpty()) {
            prompt.append(datosReales);
        }

        prompt.append("\n\nCONSULTA DEL USUARIO: ").append(request.getMensaje());
        prompt.append("\n\nResponde usando los DATOS REALES proporcionados. Si los datos reales no contienen la información solicitada, indica que no hay datos disponibles y ofrece ayuda para acceder a esa información.");

        return prompt.toString();
    }

    private String llamarGeminiAPI(String prompt) throws Exception {
        String url = apiUrl + "?key=" + apiKey;

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        int maxRetries = 3;
        for (int intento = 1; intento <= maxRetries; intento++) {
            try {
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && candidates.size() > 0) {
                        JsonNode text = candidates.get(0).path("content").path("parts").get(0).path("text");
                        return text.asText();
                    }
                }
            } catch (org.springframework.web.client.HttpServerErrorException e) {
                if (e.getStatusCode().value() == 503 && intento < maxRetries) {
                    log.warn("Gemini API 503 (alta demanda), reintento {}/{} en {}ms", intento, maxRetries, intento * 3000L);
                    Thread.sleep(intento * 3000L);
                    continue;
                }
                throw e;
            }
        }

        return "No pude procesar tu solicitud. Por favor intenta de nuevo.";
    }
}