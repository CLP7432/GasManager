package com.gasmanager.reportes.dto;

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
public class ReporteInventarioDTO {
    private Long id;
    private String tipoCombustible;
    private String nombre;
    private BigDecimal capacidadTanque;
    private BigDecimal stockActual;
    private BigDecimal stockMinimo;
    private BigDecimal porcentajeOcupacion;
    private LocalDateTime ultimaLectura;
    private Boolean activo;
}