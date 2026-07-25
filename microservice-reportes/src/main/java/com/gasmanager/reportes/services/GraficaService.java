package com.gasmanager.reportes.services;

import com.gasmanager.reportes.clients.*;
import com.gasmanager.reportes.dto.GraficaDataDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GraficaService {

    private final VentasClient ventasClient;
    private final InventariosClient inventariosClient;
    private final ClientesClient clientesClient;

    public List<GraficaDataDTO> getVentasPorDia(int dias) {
        List<GraficaDataDTO> resultado = new ArrayList<>();
        LocalDateTime ahora = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");

        try {
            Map<String, Object> ventasPaginadas = ventasClient.listarVentasPaginadas(0, 1000);

            if (ventasPaginadas == null || !ventasPaginadas.containsKey("ventas")) {
                return resultado;
            }

            List<Map<String, Object>> ventas = (List<Map<String, Object>>) ventasPaginadas.get("ventas");
            if (ventas == null) return resultado;

            Map<String, BigDecimal> ventasPorDia = new LinkedHashMap<>();
            for (int i = dias - 1; i >= 0; i--) {
                String label = ahora.minusDays(i).format(formatter);
                ventasPorDia.put(label, BigDecimal.ZERO);
            }

            for (Map<String, Object> venta : ventas) {
                try {
                    Object fechaObj = venta.get("fechaHora");
                    if (fechaObj == null) continue;

                    LocalDateTime fecha = null;
                    if (fechaObj instanceof String) {
                        fecha = LocalDateTime.parse(fechaObj.toString());
                    } else if (fechaObj instanceof LocalDateTime) {
                        fecha = (LocalDateTime) fechaObj;
                    } else {
                        continue;
                    }

                    String label = fecha.format(formatter);
                    if (ventasPorDia.containsKey(label)) {
                        BigDecimal total = new BigDecimal(venta.get("total").toString());
                        ventasPorDia.put(label, ventasPorDia.get(label).add(total));
                    }
                } catch (Exception e) {
                    log.warn("Error procesando venta en grafica diaria: {}", e.getMessage());
                }
            }

            for (Map.Entry<String, BigDecimal> entry : ventasPorDia.entrySet()) {
                resultado.add(GraficaDataDTO.builder()
                        .label(entry.getKey())
                        .value(entry.getValue())
                        .build());
            }
        } catch (Exception e) {
            log.error("Error obteniendo ventas por dia: {}", e.getMessage());
        }
        return resultado;
    }

    public List<GraficaDataDTO> getVentasPorMes(int meses) {
        List<GraficaDataDTO> resultado = new ArrayList<>();
        LocalDateTime ahora = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM-yyyy");

        try {
            Map<String, Object> ventasPaginadas = ventasClient.listarVentasPaginadas(0, 1000);

            if (ventasPaginadas == null || !ventasPaginadas.containsKey("ventas")) {
                return resultado;
            }

            List<Map<String, Object>> ventas = (List<Map<String, Object>>) ventasPaginadas.get("ventas");
            if (ventas == null) return resultado;

            Map<String, BigDecimal> ventasPorMes = new LinkedHashMap<>();
            for (int i = meses - 1; i >= 0; i--) {
                String mesAnio = ahora.minusMonths(i).format(formatter);
                ventasPorMes.put(mesAnio, BigDecimal.ZERO);
            }

            for (Map<String, Object> venta : ventas) {
                try {
                    Object fechaObj = venta.get("fechaHora");
                    if (fechaObj == null) continue;

                    LocalDateTime fecha = null;
                    if (fechaObj instanceof String) {
                        fecha = LocalDateTime.parse(fechaObj.toString());
                    } else if (fechaObj instanceof LocalDateTime) {
                        fecha = (LocalDateTime) fechaObj;
                    } else {
                        continue;
                    }

                    String mesAnio = fecha.format(formatter);
                    if (ventasPorMes.containsKey(mesAnio)) {
                        BigDecimal total = new BigDecimal(venta.get("total").toString());
                        ventasPorMes.put(mesAnio, ventasPorMes.get(mesAnio).add(total));
                    }
                } catch (Exception e) {
                    log.warn("Error procesando venta en grafica mensual: {}", e.getMessage());
                }
            }

            for (Map.Entry<String, BigDecimal> entry : ventasPorMes.entrySet()) {
                resultado.add(GraficaDataDTO.builder()
                        .label(entry.getKey())
                        .value(entry.getValue())
                        .build());
            }
        } catch (Exception e) {
            log.error("Error obteniendo ventas por mes: {}", e.getMessage());
        }
        return resultado;
    }

    public List<GraficaDataDTO> getVentasPorTipoProducto() {
        List<GraficaDataDTO> resultado = new ArrayList<>();
        Map<String, BigDecimal> ventasPorTipo = new HashMap<>();

        try {
            Map<String, Object> ventasPaginadas = ventasClient.listarVentasPaginadas(0, 1000);

            if (ventasPaginadas == null || !ventasPaginadas.containsKey("ventas")) {
                return resultado;
            }

            List<Map<String, Object>> ventas = (List<Map<String, Object>>) ventasPaginadas.get("ventas");

            if (ventas != null) {
                for (Map<String, Object> v : ventas) {
                    Object detallesObj = v.get("detalles");
                    if (detallesObj instanceof List) {
                        List<?> detalles = (List<?>) detallesObj;
                        for (Object detalle : detalles) {
                            if (detalle instanceof Map) {
                                Map<?, ?> detalleMap = (Map<?, ?>) detalle;
                                String tipoProducto = (String) detalleMap.get("tipoProducto");
                                if (tipoProducto != null) {
                                    BigDecimal importe = new BigDecimal(detalleMap.get("importe").toString());
                                    ventasPorTipo.merge(tipoProducto, importe, BigDecimal::add);
                                }
                            }
                        }
                    }
                }
            }

            for (Map.Entry<String, BigDecimal> entry : ventasPorTipo.entrySet()) {
                resultado.add(GraficaDataDTO.builder()
                        .label(entry.getKey())
                        .value(entry.getValue())
                        .build());
            }
        } catch (Exception e) {
            log.error("Error obteniendo ventas por tipo producto: {}", e.getMessage());
        }
        return resultado;
    }

    public List<GraficaDataDTO> getVentasPorMetodoPago() {
        List<GraficaDataDTO> resultado = new ArrayList<>();
        Map<String, BigDecimal> ventasPorMetodo = new HashMap<>();

        try {
            Map<String, Object> ventasPaginadas = ventasClient.listarVentasPaginadas(0, 1000);

            if (ventasPaginadas == null || !ventasPaginadas.containsKey("ventas")) {
                return resultado;
            }

            List<Map<String, Object>> ventas = (List<Map<String, Object>>) ventasPaginadas.get("ventas");

            if (ventas != null) {
                for (Map<String, Object> v : ventas) {
                    String metodoPago = (String) v.get("metodoPago");
                    if (metodoPago != null) {
                        BigDecimal total = new BigDecimal(v.get("total").toString());
                        ventasPorMetodo.merge(metodoPago, total, BigDecimal::add);
                    }
                }
            }

            for (Map.Entry<String, BigDecimal> entry : ventasPorMetodo.entrySet()) {
                resultado.add(GraficaDataDTO.builder()
                        .label(entry.getKey())
                        .value(entry.getValue())
                        .build());
            }
        } catch (Exception e) {
            log.error("Error obteniendo ventas por metodo pago: {}", e.getMessage());
        }
        return resultado;
    }

    public List<GraficaDataDTO> getInventarioCombustible() {
        List<GraficaDataDTO> resultado = new ArrayList<>();

        try {
            List<Map<String, Object>> inventario = inventariosClient.getInventarioCombustible();
            if (inventario != null) {
                for (Map<String, Object> item : inventario) {
                    String nombre = (String) item.get("nombre");
                    Object porcentajeObj = item.get("porcentajeOcupacion");
                    BigDecimal porcentaje = porcentajeObj instanceof BigDecimal ? (BigDecimal) porcentajeObj :
                            (porcentajeObj != null ? new BigDecimal(porcentajeObj.toString()) : BigDecimal.ZERO);

                    resultado.add(GraficaDataDTO.builder()
                            .label(nombre)
                            .value(porcentaje)
                            .build());
                }
            }
        } catch (Exception e) {
            log.error("Error obteniendo inventario combustible: {}", e.getMessage());
        }
        return resultado;
    }

    public List<GraficaDataDTO> getCreditosPorEstado() {
        List<GraficaDataDTO> resultado = new ArrayList<>();
        String[] estados = {"ACTIVO", "PAGADO", "VENCIDO", "CANCELADO", "EN_COBRANZA"};

        try {
            List<Map<String, Object>> creditos = clientesClient.listarCreditos();
            if (creditos != null) {
                Map<String, Long> creditosPorEstado = creditos.stream()
                        .collect(Collectors.groupingBy(
                                c -> (String) c.get("estado"),
                                Collectors.counting()
                        ));

                for (String estado : estados) {
                    long cantidad = creditosPorEstado.getOrDefault(estado, 0L);
                    resultado.add(GraficaDataDTO.builder()
                            .label(estado)
                            .count(cantidad)
                            .value(new BigDecimal(cantidad))
                            .build());
                }
            }
        } catch (Exception e) {
            log.error("Error obteniendo creditos por estado: {}", e.getMessage());
        }
        return resultado;
    }

    public List<GraficaDataDTO> getTopProductos(int limite) {
        List<GraficaDataDTO> resultado = new ArrayList<>();
        Map<String, Long> cantidadPorProducto = new HashMap<>();

        try {
            Map<String, Object> ventasPaginadas = ventasClient.listarVentasPaginadas(0, 1000);

            if (ventasPaginadas == null || !ventasPaginadas.containsKey("ventas")) {
                return resultado;
            }

            List<Map<String, Object>> ventas = (List<Map<String, Object>>) ventasPaginadas.get("ventas");

            if (ventas != null) {
                for (Map<String, Object> v : ventas) {
                    Object detallesObj = v.get("detalles");
                    if (detallesObj instanceof List) {
                        List<?> detalles = (List<?>) detallesObj;
                        for (Object detalle : detalles) {
                            if (detalle instanceof Map) {
                                Map<?, ?> detalleMap = (Map<?, ?>) detalle;
                                String productoNombre = (String) detalleMap.get("productoNombre");
                                if (productoNombre != null) {
                                    BigDecimal cantidadBD = new BigDecimal(detalleMap.get("cantidad").toString());
                                    long cantidad = cantidadBD.longValue();
                                    cantidadPorProducto.merge(productoNombre, cantidad, Long::sum);
                                }
                            }
                        }
                    }
                }
            }

            cantidadPorProducto.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(limite)
                    .forEach(entry -> resultado.add(GraficaDataDTO.builder()
                            .label(entry.getKey())
                            .count(entry.getValue())
                            .value(new BigDecimal(entry.getValue()))
                            .build()));
        } catch (Exception e) {
            log.error("Error obteniendo top productos: {}", e.getMessage());
        }
        return resultado;
    }
}