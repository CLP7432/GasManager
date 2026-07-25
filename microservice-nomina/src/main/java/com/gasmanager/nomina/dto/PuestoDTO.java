package com.gasmanager.nomina.dto;

import jakarta.validation.constraints.*;
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
public class PuestoDTO {

    private Long id;

    @NotBlank(message = "El nombre del puesto es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    @Size(max = 200, message = "La descripción no puede exceder 200 caracteres")
    private String descripcion;

    @NotNull(message = "El salario base es obligatorio")
    @DecimalMin(value = "0.01", message = "El salario base debe ser mayor a 0")
    private BigDecimal salarioBase;

    private BigDecimal salarioDiario;

    private String riesgoPuesto;
    private Boolean activo;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}