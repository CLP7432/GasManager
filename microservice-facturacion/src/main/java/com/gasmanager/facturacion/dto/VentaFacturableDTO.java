package com.gasmanager.facturacion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VentaFacturableDTO {
    private Long id;
    private String folio;
    private LocalDateTime fechaHora;
    private BigDecimal total;
    private String clienteNombre;
    private String clienteRfc;
    private Boolean facturable;
    private String mensaje;
}