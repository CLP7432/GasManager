package com.gasmanager.facturacion.dto;

import com.gasmanager.facturacion.enums.EstadoFactura;
import com.gasmanager.facturacion.enums.FormaPago;
import com.gasmanager.facturacion.enums.MetodoPago;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacturaResponseDTO {

    private Long id;
    private String folioFactura;
    private String uuidCfdi;

    // Datos del cliente
    private Long clienteId;
    private String clienteNombre;
    private String clienteRfc;

    // Datos de la factura
    private LocalDateTime fechaEmision;
    private BigDecimal subtotal;
    private BigDecimal iva;
    private BigDecimal total;
    private EstadoFactura estado;
    private FormaPago formaPago;
    private MetodoPago metodoPago;

    // Archivos
    private String xmlPath;
    private String pdfPath;
    private String urlPdf;

    // Detalle de ventas facturadas
    private List<FacturaDetalleInfo> detalles;

    private LocalDateTime createdAt;

    // ========== CLASE INTERNA PARA DETALLES ==========
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FacturaDetalleInfo {
        private Long id;
        private Long ventaId;
        private String ventaFolio;
        private LocalDateTime ventaFecha;
        private BigDecimal monto;
        private BigDecimal iva;
        private BigDecimal subtotal;
        private String productoDescripcion;
    }
}