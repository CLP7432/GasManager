package com.gasmanager.iot.services;

import com.gasmanager.iot.clients.VentasClient;
import com.gasmanager.iot.config.IotConfig;
import com.gasmanager.iot.dto.IotVentaRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class IotService {

    private final VentasClient ventasClient;
    private final IotConfig iotConfig;

    public Map<String, Object> procesarCarga(String apiKey, IotVentaRequest request) {
        // Validar API Key
        if (!iotConfig.getApiKey().equals(apiKey)) {
            log.warn("API Key inválida: {}", apiKey);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "API Key inválida");
            return error;
        }

        log.info("Procesando carga IoT: {}", request);

        try {
            Map<String, Object> resultado = ventasClient.realizarCarga(request);
            log.info("Carga procesada exitosamente: {}", resultado);
            return resultado;
        } catch (Exception e) {
            log.error("Error procesando carga: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return error;
        }
    }
}