package com.gasmanager.ventas.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class IotVentaRequest {
    private Long dispensarioId;
    private String dispensarioNombre;
    private Long mangueraId;
    private String mangueraNombre;
    private String tipoCombustible;
    private BigDecimal litros;
    private BigDecimal total;
    private BigDecimal precioUnitario;
    private Long despachadorId;
    private String despachadorNombre;
}