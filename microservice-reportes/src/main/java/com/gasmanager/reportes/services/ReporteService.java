package com.gasmanager.reportes.services;

import com.gasmanager.reportes.clients.*;
import com.gasmanager.reportes.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReporteService {

    private final VentasClient ventasClient;
    private final InventariosClient inventariosClient;
    private final FacturacionClient facturacionClient;
    private final ClientesClient clientesClient;
    private final NominaClient nominaClient;

    public List<ReporteVentasDTO> getReporteVentas(FiltrosReporteDTO filtros) {
        log.info("Generando reporte de ventas con filtros: {}", filtros);
        List<ReporteVentasDTO> resultado = new ArrayList<>();

        try {
            Map<String, Object> ventasPaginadas = ventasClient.listarVentasPaginadas(0, 1000);

            if (ventasPaginadas == null) {
                log.warn("La respuesta de ventas es null");
                return resultado;
            }

            // Verificar si la respuesta contiene la clave "ventas"
            Object ventasObj = ventasPaginadas.get("ventas");
            if (ventasObj == null) {
                log.warn("No se encontraron ventas en la respuesta");
                return resultado;
            }

            List<Map<String, Object>> ventas;
            if (ventasObj instanceof List) {
                ventas = (List<Map<String, Object>>) ventasObj;
            } else {
                log.warn("El objeto 'ventas' no es una lista: {}", ventasObj.getClass());
                return resultado;
            }

            if (ventas == null || ventas.isEmpty()) {
                return resultado;
            }

            for (Map<String, Object> v : ventas) {
                try {
                    // Extraer fecha con seguridad
                    Object fechaObj = v.get("fechaHora");
                    if (fechaObj == null) continue;

                    LocalDateTime fechaHora = null;
                    if (fechaObj instanceof String) {
                        fechaHora = LocalDateTime.parse(fechaObj.toString());
                    } else if (fechaObj instanceof LocalDateTime) {
                        fechaHora = (LocalDateTime) fechaObj;
                    } else {
                        continue;
                    }

                    // Filtrar por fechas
                    if (filtros.getFechaInicio() != null && fechaHora.isBefore(filtros.getFechaInicio())) continue;
                    if (filtros.getFechaFin() != null && fechaHora.isAfter(filtros.getFechaFin())) continue;

                    // Filtrar por estado
                    if (filtros.getEstado() != null && !filtros.getEstado().isEmpty()) {
                        String estadoVenta = (String) v.get("estado");
                        if (estadoVenta == null || !estadoVenta.equals(filtros.getEstado())) continue;
                    }

                    // Filtrar por método de pago
                    if (filtros.getMetodoPago() != null && !filtros.getMetodoPago().isEmpty()) {
                        String metodoPago = (String) v.get("metodoPago");
                        if (metodoPago == null || !metodoPago.equals(filtros.getMetodoPago())) continue;
                    }

                    String turnoNombre = null;
                    Object turnoObj = v.get("turno");
                    if (turnoObj instanceof Map) {
                        Map<?, ?> turno = (Map<?, ?>) turnoObj;
                        turnoNombre = (String) turno.get("nombre");
                    }

                    ReporteVentasDTO dto = ReporteVentasDTO.builder()
                            .id(((Number) v.get("id")).longValue())
                            .folio((String) v.get("folio"))
                            .fechaHora(fechaHora)
                            .estado((String) v.get("estado"))
                            .metodoPago((String) v.get("metodoPago"))
                            .subtotal(new BigDecimal(v.get("subtotal").toString()))
                            .iva(new BigDecimal(v.get("iva").toString()))
                            .total(new BigDecimal(v.get("total").toString()))
                            .despachadorNombre((String) v.get("despachadorNombre"))
                            .clienteNombre((String) v.get("clienteNombre"))
                            .turnoNombre(turnoNombre)
                            .surtidorNumero((String) v.get("surtidorNumero"))
                            .facturada(v.get("facturada") != null && (Boolean) v.get("facturada"))
                            .build();

                    resultado.add(dto);
                } catch (Exception e) {
                    log.warn("Error procesando venta individual: {}", e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error generando reporte de ventas: {}", e.getMessage(), e);
        }

        return resultado;
    }

    public List<ReporteInventarioDTO> getReporteInventario() {
        log.info("Generando reporte de inventario");
        List<ReporteInventarioDTO> resultado = new ArrayList<>();

        try {
            List<Map<String, Object>> inventarioCombustible = inventariosClient.getInventarioCombustible();
            if (inventarioCombustible != null) {
                for (Map<String, Object> item : inventarioCombustible) {
                    ReporteInventarioDTO dto = ReporteInventarioDTO.builder()
                            .id(((Number) item.get("id")).longValue())
                            .tipoCombustible((String) item.get("tipoCombustible"))
                            .nombre((String) item.get("nombre"))
                            .capacidadTanque(item.get("capacidadTanque") != null ? new BigDecimal(item.get("capacidadTanque").toString()) : null)
                            .stockActual(new BigDecimal(item.get("stockActual").toString()))
                            .stockMinimo(item.get("stockMinimo") != null ? new BigDecimal(item.get("stockMinimo").toString()) : null)
                            .porcentajeOcupacion(item.get("porcentajeOcupacion") != null ? new BigDecimal(item.get("porcentajeOcupacion").toString()) : BigDecimal.ZERO)
                            .ultimaLectura(item.get("ultimaLectura") != null ? LocalDateTime.parse(item.get("ultimaLectura").toString()) : null)
                            .activo((Boolean) item.get("activo"))
                            .build();
                    resultado.add(dto);
                }
            }
        } catch (Exception e) {
            log.error("Error generando reporte de inventario: {}", e.getMessage());
        }

        return resultado;
    }

    public List<ReporteFacturacionDTO> getReporteFacturacion(FiltrosReporteDTO filtros) {
        log.info("Generando reporte de facturacion");
        List<ReporteFacturacionDTO> resultado = new ArrayList<>();

        try {
            List<Map<String, Object>> facturas = facturacionClient.listarFacturas();
            if (facturas == null) return resultado;

            for (Map<String, Object> f : facturas) {
                LocalDateTime fechaEmision = LocalDateTime.parse(f.get("fechaEmision").toString());

                if (filtros.getFechaInicio() != null && fechaEmision.isBefore(filtros.getFechaInicio())) continue;
                if (filtros.getFechaFin() != null && fechaEmision.isAfter(filtros.getFechaFin())) continue;

                ReporteFacturacionDTO dto = ReporteFacturacionDTO.builder()
                        .id(((Number) f.get("id")).longValue())
                        .folioFactura((String) f.get("folioFactura"))
                        .uuidCfdi((String) f.get("uuidCfdi"))
                        .clienteNombre((String) f.get("clienteNombre"))
                        .clienteRfc((String) f.get("clienteRfc"))
                        .fechaEmision(fechaEmision)
                        .subtotal(new BigDecimal(f.get("subtotal").toString()))
                        .iva(new BigDecimal(f.get("iva").toString()))
                        .total(new BigDecimal(f.get("total").toString()))
                        .estado((String) f.get("estado"))
                        .build();

                resultado.add(dto);
            }
        } catch (Exception e) {
            log.error("Error generando reporte de facturacion: {}", e.getMessage());
        }

        return resultado;
    }

    public List<ReporteCreditosDTO> getReporteCreditos(String estado) {
        log.info("Generando reporte de creditos para estado: {}", estado);
        List<ReporteCreditosDTO> resultado = new ArrayList<>();

        try {
            List<Map<String, Object>> creditos;
            if (estado != null && !estado.isEmpty()) {
                creditos = clientesClient.getCreditosByEstado(estado);
            } else {
                creditos = clientesClient.listarCreditos();
            }

            if (creditos == null) return resultado;

            for (Map<String, Object> c : creditos) {
                ReporteCreditosDTO dto = ReporteCreditosDTO.builder()
                        .id(((Number) c.get("id")).longValue())
                        .folioCredito((String) c.get("folioCredito"))
                        .clienteNombre((String) c.get("clienteNombre"))
                        .clienteRfc((String) c.get("clienteRfc"))
                        .montoTotal(new BigDecimal(c.get("montoTotal").toString()))
                        .montoPagado(c.get("montoPagado") != null ? new BigDecimal(c.get("montoPagado").toString()) : BigDecimal.ZERO)
                        .saldoPendiente(new BigDecimal(c.get("saldoPendiente").toString()))
                        .fechaInicio(LocalDate.parse(c.get("fechaInicio").toString()))
                        .fechaVencimiento(c.get("fechaVencimiento") != null ? LocalDate.parse(c.get("fechaVencimiento").toString()) : null)
                        .estado((String) c.get("estado"))
                        .build();

                resultado.add(dto);
            }
        } catch (Exception e) {
            log.error("Error generando reporte de creditos: {}", e.getMessage());
        }

        return resultado;
    }

    public List<ReporteNominaDTO> getReporteNomina(FiltrosReporteDTO filtros) {
        log.info("Generando reporte de nomina");
        List<ReporteNominaDTO> resultado = new ArrayList<>();

        try {
            List<Map<String, Object>> nominas = nominaClient.listarNominas();
            if (nominas == null) return resultado;

            for (Map<String, Object> n : nominas) {
                if (filtros.getFechaInicio() != null || filtros.getFechaFin() != null) {
                    LocalDate periodoInicio = LocalDate.parse(n.get("periodoInicio").toString());
                    if (filtros.getFechaInicio() != null && periodoInicio.isBefore(filtros.getFechaInicio().toLocalDate())) continue;
                    if (filtros.getFechaFin() != null && periodoInicio.isAfter(filtros.getFechaFin().toLocalDate())) continue;
                }

                Object detallesObj = n.get("detalles");
                if (detallesObj instanceof List) {
                    List<?> detalles = (List<?>) detallesObj;
                    for (Object detalle : detalles) {
                        if (detalle instanceof Map) {
                            Map<?, ?> d = (Map<?, ?>) detalle;
                            ReporteNominaDTO dto = ReporteNominaDTO.builder()
                                    .id(((Number) d.get("id")).longValue())
                                    .empleadoNombre((String) d.get("empleadoNombre"))
                                    .empleadoCodigo((String) d.get("empleadoCodigo"))
                                    .puestoNombre((String) d.get("puestoNombre"))
                                    .departamentoNombre((String) d.get("departamentoNombre"))
                                    .sueldoBase(new BigDecimal(d.get("sueldoBase").toString()))
                                    .horasExtrasMonto(d.get("horasExtrasMonto") != null ? new BigDecimal(d.get("horasExtrasMonto").toString()) : BigDecimal.ZERO)
                                    .bonos(d.get("bonos") != null ? new BigDecimal(d.get("bonos").toString()) : BigDecimal.ZERO)
                                    .faltasDescuento(d.get("faltasDescuento") != null ? new BigDecimal(d.get("faltasDescuento").toString()) : BigDecimal.ZERO)
                                    .isr(d.get("isr") != null ? new BigDecimal(d.get("isr").toString()) : BigDecimal.ZERO)
                                    .totalDeducciones(new BigDecimal(d.get("totalDeducciones").toString()))
                                    .netoPagar(new BigDecimal(d.get("netoPagar").toString()))
                                    .periodoInicio(LocalDate.parse(n.get("periodoInicio").toString()))
                                    .periodoFin(LocalDate.parse(n.get("periodoFin").toString()))
                                    .build();
                            resultado.add(dto);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error generando reporte de nomina: {}", e.getMessage());
        }

        return resultado;
    }

    public List<ReporteLealtadDTO> getReporteLealtad() {
        log.info("Generando reporte de lealtad");
        List<ReporteLealtadDTO> resultado = new ArrayList<>();

        try {
            List<Map<String, Object>> clientes = clientesClient.getClientesActivos();
            if (clientes == null) return resultado;

            Map<String, Object> ventasPaginadas = ventasClient.listarVentasPaginadas(0, 1000);
            List<Map<String, Object>> ventas = null;

            if (ventasPaginadas != null && ventasPaginadas.containsKey("ventas")) {
                ventas = (List<Map<String, Object>>) ventasPaginadas.get("ventas");
            }

            Map<Long, ReporteLealtadDTO> acumulador = new HashMap<>();

            for (Map<String, Object> cliente : clientes) {
                Long clienteId = ((Number) cliente.get("id")).longValue();
                String nombre = (String) cliente.get("razonSocial");
                if (nombre == null) nombre = (String) cliente.get("nombreComercial");

                ReporteLealtadDTO dto = ReporteLealtadDTO.builder()
                        .clienteId(clienteId)
                        .clienteNombre(nombre)
                        .clienteRfc((String) cliente.get("rfc"))
                        .puntosAcumulados(0)
                        .puntosCanjeados(0)
                        .puntosDisponibles(0)
                        .totalCompras(BigDecimal.ZERO)
                        .numeroCompras(0)
                        .build();
                acumulador.put(clienteId, dto);
            }

            if (ventas != null) {
                for (Map<String, Object> venta : ventas) {
                    Object clienteIdObj = venta.get("clienteId");
                    if (clienteIdObj != null) {
                        Long clienteId = ((Number) clienteIdObj).longValue();
                        ReporteLealtadDTO dto = acumulador.get(clienteId);
                        if (dto != null) {
                            BigDecimal total = new BigDecimal(venta.get("total").toString());
                            dto.setTotalCompras(dto.getTotalCompras().add(total));
                            dto.setNumeroCompras(dto.getNumeroCompras() + 1);

                            Integer puntos = (Integer) venta.get("puntosObtenidos");
                            if (puntos != null) {
                                dto.setPuntosAcumulados(dto.getPuntosAcumulados() + puntos);
                            }

                            Integer puntosCanjeados = (Integer) venta.get("puntosCanjeados");
                            if (puntosCanjeados != null) {
                                dto.setPuntosCanjeados(dto.getPuntosCanjeados() + puntosCanjeados);
                            }

                            dto.setPuntosDisponibles(dto.getPuntosAcumulados() - dto.getPuntosCanjeados());
                        }
                    }
                }
            }

            resultado = new ArrayList<>(acumulador.values());
            resultado.sort((a, b) -> b.getPuntosAcumulados().compareTo(a.getPuntosAcumulados()));

        } catch (Exception e) {
            log.error("Error generando reporte de lealtad: {}", e.getMessage());
        }

        return resultado;
    }
}