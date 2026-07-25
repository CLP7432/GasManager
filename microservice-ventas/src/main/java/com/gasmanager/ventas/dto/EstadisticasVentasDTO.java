package com.gasmanager.ventas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasVentasDTO {
    private long totalVentas;
    private long ventasHoy;
    private double totalHoy;
    private long ventasCompletas;
    private long ventasPendientes;
    private long ventasCanceladas;
    private long ventasFacturadas;
    private long ventasCredito;
}