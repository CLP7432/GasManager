package com.gasmanager.inventarios.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AceiteDispensarioDTO {
    private Long id;
    private Long dispensarioId;
    private String dispensarioNombre;
    private Long aceiteId;
    private String codigo;
    private String nombre;
    private Integer stockActual;
    private Integer stockMinimo;
    private Integer stockMaximo;
    private BigDecimal precioVenta;
    private Boolean activo;
    private Boolean stockBajo;
    private Boolean stockCritico;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}