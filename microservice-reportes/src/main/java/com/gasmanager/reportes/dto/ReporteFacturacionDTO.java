package com.gasmanager.reportes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteFacturacionDTO {
    private Long id;
    private String folioFactura;
    private String uuidCfdi;
    private String clienteNombre;
    private String clienteRfc;
    private LocalDateTime fechaEmision;
    private BigDecimal subtotal;
    private BigDecimal iva;
    private BigDecimal total;
    private String estado;
}