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
public class ReporteVentasDTO {
    private Long id;
    private String folio;
    private LocalDateTime fechaHora;
    private String estado;
    private String metodoPago;
    private BigDecimal subtotal;
    private BigDecimal iva;
    private BigDecimal total;
    private String despachadorNombre;
    private String clienteNombre;
    private String turnoNombre;
    private String surtidorNumero;
    private Boolean facturada;
}