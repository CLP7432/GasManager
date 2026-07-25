package com.gasmanager.reportes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteLealtadDTO {
    private Long clienteId;
    private String clienteNombre;
    private String clienteRfc;
    private Integer puntosAcumulados;
    private Integer puntosCanjeados;
    private Integer puntosDisponibles;
    private BigDecimal totalCompras;
    private Integer numeroCompras;
}