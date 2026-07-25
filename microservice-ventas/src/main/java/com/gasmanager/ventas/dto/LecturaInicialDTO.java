package com.gasmanager.ventas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LecturaInicialDTO {
    private Long mangueraId;
    private String mangueraNombre;
    private String tipoCombustible;
    private BigDecimal lecturaInicial;
    private BigDecimal precioPorLitro;
    private Long aceiteId;
    private String aceiteNombre;
    private Integer cantidadInicial;
    private BigDecimal precioUnitario;
    private String tipo;
}