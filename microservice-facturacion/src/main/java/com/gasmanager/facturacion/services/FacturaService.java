package com.gasmanager.facturacion.services;

import com.gasmanager.facturacion.clients.ClienteClient;
import com.gasmanager.facturacion.clients.VentaClient;
import com.gasmanager.facturacion.dto.FacturaResponseDTO;
import com.gasmanager.facturacion.dto.SolicitudFacturaDTO;
import com.gasmanager.facturacion.dto.VentaFacturableDTO;
import com.gasmanager.facturacion.entities.Factura;
import com.gasmanager.facturacion.entities.FacturaDetalle;
import com.gasmanager.facturacion.enums.EstadoFactura;
import com.gasmanager.facturacion.enums.FormaPago;
import com.gasmanager.facturacion.enums.MetodoPago;
import com.gasmanager.facturacion.exceptions.ResourceNotFoundException;
import com.gasmanager.facturacion.exceptions.ValidationException;
import com.gasmanager.facturacion.repositories.FacturaDetalleRepository;
import com.gasmanager.facturacion.repositories.FacturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FacturaService {

    private final FacturaRepository facturaRepository;
    private final FacturaDetalleRepository facturaDetalleRepository;
    private final VentaClient ventaClient;
    private final ClienteClient clienteClient;

    private static final BigDecimal IVA_RATE = new BigDecimal("0.16");

    /**
     * Verifica si una venta es facturable
     */
    @Transactional(readOnly = true)
    public VentaFacturableDTO verificarVentaFacturable(Long ventaId) {
        try {
            // Verificar si la venta ya fue facturada en nuestro sistema
            boolean yaFacturada = facturaDetalleRepository.existsByVentaId(ventaId);
            if (yaFacturada) {
                return VentaFacturableDTO.builder()
                        .id(ventaId)
                        .facturable(false)
                        .mensaje("La venta ya ha sido facturada anteriormente")
                        .build();
            }

            // Consultar al microservicio de ventas si puede facturar
            Boolean puedeFacturar = ventaClient.puedeFacturar(ventaId);

            if (puedeFacturar != null && puedeFacturar) {
                // Obtener datos completos de la venta
                Map<String, Object> venta = (Map<String, Object>) ventaClient.obtenerVenta(ventaId);

                return VentaFacturableDTO.builder()
                        .id(ventaId)
                        .folio((String) venta.get("folio"))
                        .fechaHora(LocalDateTime.parse((String) venta.get("fechaHora")))
                        .total(new BigDecimal(venta.get("total").toString()))
                        .facturable(true)
                        .mensaje("Venta facturable")
                        .build();
            } else {
                return VentaFacturableDTO.builder()
                        .id(ventaId)
                        .facturable(false)
                        .mensaje("La venta no está en estado COMPLETADA")
                        .build();
            }
        } catch (Exception e) {
            return VentaFacturableDTO.builder()
                    .id(ventaId)
                    .facturable(false)
                    .mensaje("Error al verificar: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Verifica múltiples ventas para facturación consolidada
     */
    @Transactional(readOnly = true)
    public List<VentaFacturableDTO> verificarVentasFacturables(List<Long> ventasIds) {
        return ventasIds.stream()
                .map(this::verificarVentaFacturable)
                .collect(Collectors.toList());
    }

    /**
     * Solicitar factura (una o múltiples ventas)
     */
    public FacturaResponseDTO solicitarFactura(SolicitudFacturaDTO solicitud, Long usuarioId, String usuarioNombre) {

        // 1. Validar que todas las ventas sean facturables
        List<VentaFacturableDTO> ventasValidadas = new ArrayList<>();
        BigDecimal totalFactura = BigDecimal.ZERO;
        BigDecimal subtotalFactura = BigDecimal.ZERO;
        BigDecimal ivaFactura = BigDecimal.ZERO;

        for (Long ventaId : solicitud.getVentasIds()) {
            VentaFacturableDTO ventaInfo = verificarVentaFacturable(ventaId);
            if (!ventaInfo.getFacturable()) {
                throw new ValidationException("La venta " + ventaId + " no es facturable: " + ventaInfo.getMensaje());
            }

            // Verificar que no esté ya facturada (doble validación)
            if (facturaDetalleRepository.existsByVentaId(ventaId)) {
                throw new ValidationException("La venta " + ventaId + " ya ha sido facturada");
            }

            ventasValidadas.add(ventaInfo);
            totalFactura = totalFactura.add(ventaInfo.getTotal());
        }

        // 2. Calcular subtotal e IVA
        subtotalFactura = totalFactura.divide(new BigDecimal("1.16"), 2, RoundingMode.HALF_UP);
        ivaFactura = totalFactura.subtract(subtotalFactura);

        // 3. Crear la factura
        Factura factura = Factura.builder()
                .folioFactura(generarFolioFactura())
                .clienteId(solicitud.getClienteId())
                .clienteNombre(solicitud.getNombre())
                .clienteRfc(solicitud.getRfc())
                .clienteRegimenFiscal(solicitud.getRegimenFiscal())
                .clienteCodigoPostal(solicitud.getCodigoPostal())
                .clienteEmail(solicitud.getEmail())
                .fechaEmision(LocalDateTime.now())
                .subtotal(subtotalFactura)
                .iva(ivaFactura)
                .total(totalFactura)
                .estado(EstadoFactura.PENDIENTE_TIMBRADO)
                .formaPago(solicitud.getFormaPago() != null ? solicitud.getFormaPago() : FormaPago.EFECTIVO)
                .metodoPago(solicitud.getMetodoPago() != null ? solicitud.getMetodoPago() : MetodoPago.PAGO_EN_UNA_EXHIBICION)
                .observaciones(solicitud.getObservaciones())
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        factura = facturaRepository.save(factura);

        // 4. Crear los detalles de la factura
        for (VentaFacturableDTO ventaInfo : ventasValidadas) {
            FacturaDetalle detalle = FacturaDetalle.builder()
                    .factura(factura)
                    .ventaId(ventaInfo.getId())
                    .ventaFolio(ventaInfo.getFolio())
                    .ventaFecha(ventaInfo.getFechaHora())
                    .monto(ventaInfo.getTotal())
                    .subtotal(ventaInfo.getTotal().divide(new BigDecimal("1.16"), 2, RoundingMode.HALF_UP))
                    .iva(ventaInfo.getTotal().subtract(ventaInfo.getTotal().divide(new BigDecimal("1.16"), 2, RoundingMode.HALF_UP)))
                    .productoDescripcion("Combustible y lubricantes")
                    .build();

            factura.addDetalle(detalle);
            facturaDetalleRepository.save(detalle);
        }

        // 5. Marcar las ventas como facturadas en el microservicio de ventas
        for (Long ventaId : solicitud.getVentasIds()) {
            try {
                ventaClient.marcarComoFacturada(ventaId, factura.getFolioFactura());
            } catch (Exception e) {
                // Log del error pero continuamos
                System.err.println("Error al marcar venta " + ventaId + " como facturada: " + e.getMessage());
            }
        }

        // 6. Actualizar estado de la factura
        factura.setEstado(EstadoFactura.EMITIDA);
        factura = facturaRepository.save(factura);

        // 7. Generar PDF y XML (simulado por ahora)
        generarArchivosFactura(factura);

        return mapToResponseDTO(factura);
    }

    /**
     * Obtener factura por ID
     */
    @Transactional(readOnly = true)
    public FacturaResponseDTO obtenerFactura(Long id) {
        Factura factura = facturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrada con ID: " + id));
        return mapToResponseDTO(factura);
    }

    /**
     * Obtener factura por folio
     */
    @Transactional(readOnly = true)
    public FacturaResponseDTO obtenerFacturaPorFolio(String folio) {
        Factura factura = facturaRepository.findByFolioFactura(folio)
                .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrada con folio: " + folio));
        return mapToResponseDTO(factura);
    }

    /**
     * Listar facturas por cliente
     */
    @Transactional(readOnly = true)
    public List<FacturaResponseDTO> listarFacturasPorCliente(Long clienteId) {
        return facturaRepository.findByClienteId(clienteId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Listar facturas por RFC
     */
    @Transactional(readOnly = true)
    public List<FacturaResponseDTO> listarFacturasPorRFC(String rfc) {
        return facturaRepository.findByClienteRfc(rfc).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Listar todas las facturas
     */
    @Transactional(readOnly = true)
    public List<FacturaResponseDTO> listarFacturas() {
        return facturaRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Cancelar factura
     */
    public FacturaResponseDTO cancelarFactura(Long id, String motivo, Long usuarioId, String usuarioNombre) {
        Factura factura = facturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factura no encontrada con ID: " + id));

        if (factura.getEstado() == EstadoFactura.CANCELADA) {
            throw new ValidationException("La factura ya está cancelada");
        }

        factura.setEstado(EstadoFactura.CANCELADA);
        factura.setObservaciones((factura.getObservaciones() != null ? factura.getObservaciones() + "\n" : "")
                + "[CANCELADA] Motivo: " + motivo + " - Fecha: " + LocalDateTime.now());
        factura.setUpdatedBy(usuarioNombre);

        factura = facturaRepository.save(factura);
        return mapToResponseDTO(factura);
    }

    // ========== MÉTODOS PRIVADOS ==========

    private String generarFolioFactura() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long secuencial = facturaRepository.count() + 1;
        return String.format("FAC-%s-%04d", fecha, secuencial);
    }

    private void generarArchivosFactura(Factura factura) {
        // TODO: Implementar generación real de XML y PDF
        // Por ahora solo simulamos las rutas
        String basePath = "/facturas/";
        factura.setXmlPath(basePath + factura.getFolioFactura() + ".xml");
        factura.setPdfPath(basePath + factura.getFolioFactura() + ".pdf");
        facturaRepository.save(factura);

        System.out.println("=== FACTURA GENERADA ===");
        System.out.println("Folio: " + factura.getFolioFactura());
        System.out.println("Total: $" + factura.getTotal());
        System.out.println("Cliente: " + factura.getClienteNombre());
        System.out.println("Ventas incluidas: " + factura.getDetalles().size());
    }

    private FacturaResponseDTO mapToResponseDTO(Factura factura) {
        return FacturaResponseDTO.builder()
                .id(factura.getId())
                .folioFactura(factura.getFolioFactura())
                .uuidCfdi(factura.getUuidCfdi())
                .clienteId(factura.getClienteId())
                .clienteNombre(factura.getClienteNombre())
                .clienteRfc(factura.getClienteRfc())
                .fechaEmision(factura.getFechaEmision())
                .subtotal(factura.getSubtotal())
                .iva(factura.getIva())
                .total(factura.getTotal())
                .estado(factura.getEstado())
                .formaPago(factura.getFormaPago())
                .metodoPago(factura.getMetodoPago())
                .xmlPath(factura.getXmlPath())
                .pdfPath(factura.getPdfPath())
                .urlPdf("/api/facturas/" + factura.getFolioFactura() + "/pdf")
                .detalles(factura.getDetalles().stream()
                        .map(d -> FacturaResponseDTO.FacturaDetalleInfo.builder()
                                .id(d.getId())
                                .ventaId(d.getVentaId())
                                .ventaFolio(d.getVentaFolio())
                                .ventaFecha(d.getVentaFecha())
                                .monto(d.getMonto())
                                .iva(d.getIva())
                                .subtotal(d.getSubtotal())
                                .productoDescripcion(d.getProductoDescripcion())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(factura.getCreatedAt())
                .build();
    }
}