package com.gasmanager.nomina.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcesarNominaRequestDTO {

    @NotNull(message = "La fecha de inicio del periodo es obligatoria")
    private LocalDate periodoInicio;

    @NotNull(message = "La fecha de fin del periodo es obligatoria")
    private LocalDate periodoFin;

    private LocalDate fechaPago;
    private String observaciones;
}