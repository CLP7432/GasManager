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
public class ReporteNominaDTO {
    private Long id;
    private String empleadoNombre;
    private String empleadoCodigo;
    private String puestoNombre;
    private String departamentoNombre;
    private BigDecimal sueldoBase;
    private BigDecimal horasExtrasMonto;
    private BigDecimal bonos;
    private BigDecimal faltasDescuento;
    private BigDecimal isr;
    private BigDecimal totalDeducciones;
    private BigDecimal netoPagar;
    private LocalDate periodoInicio;
    private LocalDate periodoFin;
}