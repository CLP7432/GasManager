package com.gasmanager.reportes.services;

import com.gasmanager.reportes.clients.*;
import com.gasmanager.reportes.dto.DashboardDTO;
import com.gasmanager.reportes.dto.GraficaDataDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final VentasClient ventasClient;
    private final InventariosClient inventariosClient;
    private final ClientesClient clientesClient;
    private final FacturacionClient facturacionClient;
    private final NominaClient nominaClient;

    public DashboardDTO obtenerDashboard() {
        log.info("Generando dashboard");
        DashboardDTO dashboard = new DashboardDTO();

        try {
            // ========== VENTAS ==========
            Map<String, Object> ventasPaginadas = ventasClient.listarVentasPaginadas(0, 1000);

            if (ventasPaginadas != null && ventasPaginadas.containsKey("ventas")) {
                List<Map<String, Object>> ventas = (List<Map<String, Object>>) ventasPaginadas.get("ventas");

                if (ventas != null && !ventas.isEmpty()) {
                    LocalDateTime inicioHoy = LocalDateTime.now().with(LocalTime.MIN);
                    LocalDateTime finHoy = LocalDateTime.now().with(LocalTime.MAX);
                    LocalDateTime inicioSemana = LocalDateTime.now().minusDays(7).with(LocalTime.MIN);
                    LocalDateTime inicioMes = LocalDateTime.now().minusDays(30).with(LocalTime.MIN);

                    BigDecimal totalHoy = BigDecimal.ZERO;
                    BigDecimal totalSemana = BigDecimal.ZERO;
                    BigDecimal totalMes = BigDecimal.ZERO;
                    long countHoy = 0;
                    long countSemana = 0;
                    long countMes = 0;

                    for (Map<String, Object> v : ventas) {
                        try {
                            Object fechaObj = v.get("fechaHora");
                            if (fechaObj == null) continue;

                            LocalDateTime fecha = null;
                            if (fechaObj instanceof String) {
                                fecha = LocalDateTime.parse(fechaObj.toString());
                            } else if (fechaObj instanceof LocalDateTime) {
                                fecha = (LocalDateTime) fechaObj;
                            } else {
                                continue;
                            }

                            BigDecimal total = new BigDecimal(v.get("total").toString());

                            if (fecha.isAfter(inicioHoy) && fecha.isBefore(finHoy)) {
                                totalHoy = totalHoy.add(total);
                                countHoy++;
                            }
                            if (fecha.isAfter(inicioSemana)) {
                                totalSemana = totalSemana.add(total);
                                countSemana++;
                            }
                            if (fecha.isAfter(inicioMes)) {
                                totalMes = totalMes.add(total);
                                countMes++;
                            }
                        } catch (Exception e) {
                            log.warn("Error procesando venta en dashboard: {}", e.getMessage());
                        }
                    }

                    dashboard.setVentasHoy(totalHoy);
                    dashboard.setVentasSemana(totalSemana);
                    dashboard.setVentasMes(totalMes);
                    dashboard.setTotalVentasHoy(countHoy);
                    dashboard.setTotalVentasSemana(countSemana);
                    dashboard.setTotalVentasMes(countMes);
                }
            }

            // ========== INVENTARIO COMBUSTIBLE ==========
            try {
                List<Map<String, Object>> inventario = inventariosClient.getInventarioCombustible();
                if (inventario != null && !inventario.isEmpty()) {
                    BigDecimal promedioStock = BigDecimal.ZERO;
                    List<GraficaDataDTO> inventarioGrafica = new ArrayList<>();

                    for (Map<String, Object> item : inventario) {
                        String nombre = (String) item.get("nombre");
                        BigDecimal stock = new BigDecimal(item.get("stockActual").toString());
                        promedioStock = promedioStock.add(stock);

                        inventarioGrafica.add(GraficaDataDTO.builder()
                                .label(nombre)
                                .value(stock)
                                .build());
                    }
                    promedioStock = promedioStock.divide(new BigDecimal(inventario.size()), 2, RoundingMode.HALF_UP);
                    dashboard.setStockCombustiblePromedio(promedioStock.intValue());
                    dashboard.setInventarioCombustible(inventarioGrafica);
                }
            } catch (Exception e) {
                log.error("Error obteniendo inventario: {}", e.getMessage());
            }

            // ========== CLIENTES ACTIVOS ==========
            try {
                List<Map<String, Object>> clientesActivos = clientesClient.getClientesActivos();
                dashboard.setClientesActivos(clientesActivos != null ? (long) clientesActivos.size() : 0L);
            } catch (Exception e) {
                log.error("Error obteniendo clientes: {}", e.getMessage());
            }

            // ========== FACTURACION ==========
            try {
                List<Map<String, Object>> facturas = facturacionClient.listarFacturas();
                if (facturas != null) {
                    LocalDateTime inicioMes = LocalDateTime.now().minusDays(30).with(LocalTime.MIN);
                    long facturasMes = facturas.stream()
                            .filter(f -> {
                                try {
                                    Object fechaObj = f.get("fechaEmision");
                                    if (fechaObj != null) {
                                        LocalDateTime fecha = LocalDateTime.parse(fechaObj.toString());
                                        return fecha.isAfter(inicioMes);
                                    }
                                } catch (Exception e) {
                                    log.warn("Error parseando fecha de factura: {}", e.getMessage());
                                }
                                return false;
                            })
                            .count();
                    dashboard.setFacturasEmitidasMes(facturasMes);
                }
            } catch (Exception e) {
                log.error("Error obteniendo facturas: {}", e.getMessage());
            }

            // ========== CREDITOS VENCIDOS ==========
            try {
                List<Map<String, Object>> creditosVencidos = clientesClient.getCreditosByEstado("VENCIDO");
                BigDecimal totalVencido = BigDecimal.ZERO;
                if (creditosVencidos != null) {
                    for (Map<String, Object> credito : creditosVencidos) {
                        totalVencido = totalVencido.add(new BigDecimal(credito.get("saldoPendiente").toString()));
                    }
                }
                dashboard.setCreditosVencidos(totalVencido);
            } catch (Exception e) {
                log.error("Error obteniendo creditos vencidos: {}", e.getMessage());
            }

            // ========== EMPLEADOS ACTIVOS ==========
            try {
                List<Map<String, Object>> empleadosActivos = nominaClient.getEmpleadosActivos();
                dashboard.setEmpleadosActivos(empleadosActivos != null ? (long) empleadosActivos.size() : 0L);
            } catch (Exception e) {
                log.error("Error obteniendo empleados: {}", e.getMessage());
            }

            // ========== GRAFICAS ==========
            dashboard.setVentasUltimos7Dias(obtenerVentasUltimos7Dias());
            dashboard.setVentasPorProducto(obtenerVentasPorProducto());
            dashboard.setVentasPorMetodoPago(obtenerVentasPorMetodoPago());
            dashboard.setTopProductos(obtenerTopProductos());
            dashboard.setCreditosPorEstado(obtenerCreditosPorEstado());
            dashboard.setFacturasPorMes(obtenerFacturasPorMes());

        } catch (Exception e) {
            log.error("Error generando dashboard: {}", e.getMessage());
        }

        return dashboard;
    }

    private List<GraficaDataDTO> obtenerVentasUltimos7Dias() {
        List<GraficaDataDTO> resultado = new ArrayList<>();
        LocalDateTime hoy = LocalDateTime.now().with(LocalTime.MAX);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");

        try {
            Map<String, Object> ventasPaginadas = ventasClient.listarVentasPaginadas(0, 1000);

            if (ventasPaginadas == null || !ventasPaginadas.containsKey("ventas")) {
                return resultado;
            }

            List<Map<String, Object>> ventas = (List<Map<String, Object>>) ventasPaginadas.get("ventas");
            if (ventas == null) return resultado;

            Map<String, BigDecimal> ventasPorDia = new LinkedHashMap<>();
            for (int i = 6; i >= 0; i--) {
                String label = hoy.minusDays(i).format(formatter);
                ventasPorDia.put(label, BigDecimal.ZERO);
            }

            for (Map<String, Object> v : ventas) {
                try {
                    Object fechaObj = v.get("fechaHora");
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
                        ventasPorDia.put(label, ventasPorDia.get(label).add(new BigDecimal(v.get("total").toString())));
                    }
                } catch (Exception e) {
                    log.warn("Error procesando venta en grafica: {}", e.getMessage());
                }
            }

            for (Map.Entry<String, BigDecimal> entry : ventasPorDia.entrySet()) {
                resultado.add(GraficaDataDTO.builder()
                        .label(entry.getKey())
                        .value(entry.getValue())
                        .build());
            }
        } catch (Exception e) {
            log.error("Error obteniendo ventas ultimos 7 dias: {}", e.getMessage());
        }
        return resultado;
    }

    private List<GraficaDataDTO> obtenerVentasPorProducto() {
        List<GraficaDataDTO> resultado = new ArrayList<>();
        Map<String, BigDecimal> ventasPorProducto = new HashMap<>();

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
                                    BigDecimal importe = new BigDecimal(detalleMap.get("importe").toString());
                                    ventasPorProducto.merge(productoNombre, importe, BigDecimal::add);
                                }
                            }
                        }
                    }
                }
            }

            for (Map.Entry<String, BigDecimal> entry : ventasPorProducto.entrySet()) {
                resultado.add(GraficaDataDTO.builder()
                        .label(entry.getKey())
                        .value(entry.getValue())
                        .build());
            }
        } catch (Exception e) {
            log.error("Error obteniendo ventas por producto: {}", e.getMessage());
        }
        return resultado;
    }

    private List<GraficaDataDTO> obtenerVentasPorMetodoPago() {
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

    private List<GraficaDataDTO> obtenerTopProductos() {
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
                    .limit(5)
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

    private List<GraficaDataDTO> obtenerCreditosPorEstado() {
        List<GraficaDataDTO> resultado = new ArrayList<>();
        String[] estados = {"ACTIVO", "PAGADO", "VENCIDO", "CANCELADO", "EN_COBRANZA"};

        try {
            List<Map<String, Object>> todosCreditos = clientesClient.listarCreditos();
            if (todosCreditos != null) {
                Map<String, Long> creditosPorEstado = todosCreditos.stream()
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

    private List<GraficaDataDTO> obtenerFacturasPorMes() {
        List<GraficaDataDTO> resultado = new ArrayList<>();
        LocalDateTime ahora = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM-yyyy");

        try {
            List<Map<String, Object>> facturas = facturacionClient.listarFacturas();
            if (facturas == null) return resultado;

            Map<String, Long> facturasPorMes = new LinkedHashMap<>();
            for (int i = 5; i >= 0; i--) {
                String mesAnio = ahora.minusMonths(i).format(formatter);
                facturasPorMes.put(mesAnio, 0L);
            }

            for (Map<String, Object> factura : facturas) {
                try {
                    Object fechaObj = factura.get("fechaEmision");
                    if (fechaObj != null) {
                        LocalDateTime fecha = LocalDateTime.parse(fechaObj.toString());
                        String mesAnio = fecha.format(formatter);
                        facturasPorMes.merge(mesAnio, 1L, Long::sum);
                    }
                } catch (Exception e) {
                    log.warn("Error parseando fecha de factura: {}", e.getMessage());
                }
            }

            for (Map.Entry<String, Long> entry : facturasPorMes.entrySet()) {
                resultado.add(GraficaDataDTO.builder()
                        .label(entry.getKey())
                        .count(entry.getValue())
                        .value(new BigDecimal(entry.getValue()))
                        .build());
            }
        } catch (Exception e) {
            log.error("Error obteniendo facturas por mes: {}", e.getMessage());
        }
        return resultado;
    }
}