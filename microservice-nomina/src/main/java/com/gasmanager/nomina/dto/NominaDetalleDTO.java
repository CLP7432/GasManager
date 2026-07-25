package com.gasmanager.nomina.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NominaDetalleDTO {

    private Long id;
    private Long empleadoId;
    private String empleadoNombre;
    private String empleadoCodigo;

    private BigDecimal diasTrabajados;
    private BigDecimal sueldoBase;
    private BigDecimal horasExtras;
    private BigDecimal horasExtrasMonto;
    private BigDecimal faltas;
    private BigDecimal faltasDescuento;
    private BigDecimal bonos;
    private BigDecimal totalGravado;
    private BigDecimal isr;
    private BigDecimal cuotaSindical;
    private BigDecimal seguroSocial;
    private BigDecimal infonavit;
    private BigDecimal otrasDeducciones;
    private BigDecimal totalDeducciones;
    private BigDecimal netoPagar;
}