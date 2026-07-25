package com.gasmanager.inventarios.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferenciaAceiteDTO {
    private Long id;
    private String folio;
    private Long aceiteId;
    private String aceiteNombre;
    private Long dispensarioOrigenId;
    private String dispensarioOrigenNombre;
    private Long dispensarioDestinoId;
    private String dispensarioDestinoNombre;
    private Integer cantidad;
    private String tipo;  // TRANSFERENCIA, AJUSTE, DEVOLUCION
    private String motivo;
    private LocalDateTime fechaMovimiento;
    private Long realizadoPorId;
    private String realizadoPorNombre;
    private String observaciones;
    private LocalDateTime createdAt;
}