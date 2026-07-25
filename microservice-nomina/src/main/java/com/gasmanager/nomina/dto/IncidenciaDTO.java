package com.gasmanager.nomina.dto;

import com.gasmanager.nomina.enums.TipoIncidencia;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidenciaDTO {

    private Long id;

    @NotNull(message = "El ID del empleado es obligatorio")
    private Long empleadoId;

    private String empleadoNombre;

    @NotNull(message = "El tipo de incidencia es obligatorio")
    private TipoIncidencia tipo;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @DecimalMin(value = "0", message = "La cantidad no puede ser negativa")
    private BigDecimal cantidad;

    @DecimalMin(value = "0", message = "El monto no puede ser negativo")
    private BigDecimal monto;

    private String observaciones;
    private String autorizadoPor;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}