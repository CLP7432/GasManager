package com.gasmanager.ventas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorteTurnoRequestDTO {
    private Long turnoId;
    private Long dispensarioId;
    private String dispensarioNombre;
    private Long despachadorId;
    private String despachadorNombre;
    private List<LecturaFinalDTO> lecturasFinales;
    private List<NotaCreditoDTO> notasCredito;
    private List<LecturaFinalDTO> aceitesFinales;
    private List<LecturaInicialDTO> lecturasInicialesAceites;
    private BigDecimal efectivoRecibido;
    private BigDecimal tarjetaRecibido;
    private BigDecimal transferenciaRecibido;
    private String observaciones;
}