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
public class NotaCreditoDTO {
    private String folioNota;
    private String clienteNombre;
    private String tipoCombustible;
    private BigDecimal litros;
    private BigDecimal monto;
    private String autorizadoPor;
}