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
public class AceiteBodegaDTO {
    private Long id;
    private Long aceiteId;
    private String codigo;
    private String nombre;
    private Integer stockActual;
    private Integer stockMinimo;
    private Integer stockMaximo;
    private BigDecimal precioCompra;
    private BigDecimal precioVenta;
    private String proveedor;
    private String ubicacion;
    private Boolean activo;
    private Boolean stockBajo;
    private Boolean stockCritico;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}