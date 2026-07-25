package com.gasmanager.iot.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CargaActivaDTO {
    private Long dispensarioId;
    private String dispensarioNombre;
    private Long mangueraId;
    private String mangueraNombre;
    private String tipoCombustible;
    private BigDecimal litros;
    private BigDecimal total;
    private BigDecimal precioUnitario;
    private String estado;
    private Integer progreso;
    private String mensaje;
    private Long despachadorId;
    private String despachadorNombre;
}