package com.gasmanager.nomina.dto;

import com.gasmanager.nomina.enums.EstadoNomina;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NominaDTO {

    private Long id;
    private String folioNomina;

    @NotNull(message = "La fecha de inicio del periodo es obligatoria")
    private LocalDate periodoInicio;

    @NotNull(message = "La fecha de fin del periodo es obligatoria")
    private LocalDate periodoFin;

    private LocalDate fechaPago;
    private LocalDateTime fechaProcesamiento;

    private Integer totalEmpleados;
    private BigDecimal totalSueldos;
    private BigDecimal totalHorasExtras;
    private BigDecimal totalBonos;
    private BigDecimal totalDeducciones;
    private BigDecimal totalImpuestos;
    private BigDecimal totalNeto;

    private EstadoNomina estado;
    private String observaciones;

    private List<NominaDetalleDTO> detalles;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}