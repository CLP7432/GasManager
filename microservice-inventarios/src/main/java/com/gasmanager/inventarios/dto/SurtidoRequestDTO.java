package com.gasmanager.inventarios.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurtidoRequestDTO {
    private Long dispensarioId;
    private String dispensarioNombre;
    private List<ItemSurtidoDTO> items;
    private String observaciones;
    private Long realizadoPorId;
    private String realizadoPorNombre;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemSurtidoDTO {
        private Long aceiteId;
        private String codigo;
        private String nombre;
        private Integer cantidad;
        private BigDecimal precioVenta;
    }
}