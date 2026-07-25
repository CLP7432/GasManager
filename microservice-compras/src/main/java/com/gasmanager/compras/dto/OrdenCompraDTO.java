package com.gasmanager.compras.dto;

import com.gasmanager.compras.enums.EstadoOrdenCompra;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdenCompraDTO {

    private Long id;
    private String folioOrden;

    @NotNull(message = "El ID del proveedor es obligatorio")
    private Long proveedorId;

    private String proveedorNombre;

    @NotNull(message = "La fecha de orden es obligatoria")
    private LocalDate fechaOrden;

    private LocalDate fechaEntrega;

    private BigDecimal subtotal;
    private BigDecimal iva;
    private BigDecimal total;

    private EstadoOrdenCompra estado;
    private String factura;
    private String observaciones;

    @NotEmpty(message = "Debe incluir al menos un detalle")
    private List<DetalleOrdenCompraDTO> detalles;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}