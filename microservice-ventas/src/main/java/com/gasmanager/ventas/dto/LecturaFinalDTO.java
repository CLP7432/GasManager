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
public class LecturaFinalDTO {
    private Long mangueraId;
    private String mangueraNombre;
    private String tipoCombustible;
    private BigDecimal lecturaFinal;
    private Long aceiteId;
    private String aceiteNombre;
    private Integer cantidadFinal;
    private String tipo;
}