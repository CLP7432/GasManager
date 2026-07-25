package com.gasmanager.reportes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FiltrosReporteDTO {
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Long clienteId;
    private Long empleadoId;
    private Long productoId;
    private String tipoProducto;
    private String metodoPago;
    private String estado;
    private String formato; // PDF, EXCEL, JSON
}