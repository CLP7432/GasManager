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
public class CompraAceiteDTO {
    private Long id;
    private String folio;
    private Long aceiteId;
    private String aceiteNombre;
    private String proveedor;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private BigDecimal iva;
    private BigDecimal total;
    private String factura;
    private LocalDateTime fechaCompra;
    private Long realizadoPorId;
    private String realizadoPorNombre;
    private String observaciones;
    private LocalDateTime createdAt;
}