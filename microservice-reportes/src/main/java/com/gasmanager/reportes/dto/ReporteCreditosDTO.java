package com.gasmanager.reportes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteCreditosDTO {
    private Long id;
    private String folioCredito;
    private String clienteNombre;
    private String clienteRfc;
    private BigDecimal montoTotal;
    private BigDecimal montoPagado;
    private BigDecimal saldoPendiente;
    private LocalDate fechaInicio;
    private LocalDate fechaVencimiento;
    private String estado;
}