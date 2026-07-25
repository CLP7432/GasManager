package com.gasmanager.iot.dto;

import lombok.Data;

@Data
public class TurnoActivoDTO {
    private boolean tieneTurnoActivo;
    private Long turnoId;
    private String codigoTurno;
    private String nombreTurno;
}