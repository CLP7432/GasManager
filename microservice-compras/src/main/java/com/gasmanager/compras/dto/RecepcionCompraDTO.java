package com.gasmanager.compras.dto;

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
public class RecepcionCompraDTO {

    @NotNull(message = "El ID de la orden es obligatorio")
    private Long ordenId;

    private LocalDate fechaRecepcion;
    private String factura;
    private String observaciones;
}