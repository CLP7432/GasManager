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
public class CorteTurnoResponseDTO {
    private Long id;
    private String codigoCorte;
    private Long turnoId;
    private String turnoNombre;
    private Long dispensarioId;
    private String dispensarioNombre;
    private Long despachadorId;
    private String despachadorNombre;

    // Magna
    private BigDecimal magnaLitrosVendidos;
    private BigDecimal magnaImporte;

    // Premium
    private BigDecimal premiumLitrosVendidos;
    private BigDecimal premiumImporte;

    // Diesel
    private BigDecimal dieselLitrosVendidos;
    private BigDecimal dieselImporte;

    private BigDecimal totalCombustiblesImporte;
    private List<DetalleAceiteDTO> detallesAceites;
    private BigDecimal totalAceitesImporte;
    private List<NotaCreditoDTO> notasCredito;
    private BigDecimal totalNotasCredito;
    private BigDecimal totalVentaCombustiblesYAceites;
    private BigDecimal totalEfectivo;
    private BigDecimal totalTarjeta;
    private BigDecimal totalTransferencia;
    private BigDecimal totalCredito;
    private BigDecimal efectivoQueDebeEntregar;
    private BigDecimal diferencia;
    private String estado;
    private String observaciones;
    private String createdAt;
    private String validadoPor;
    private String validadoNombre;
    private String fechaValidacion;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetalleAceiteDTO {
        private String aceiteNombre;
        private Integer cantidadInicial;
        private Integer cantidadFinal;
        private Integer cantidadVendida;
        private BigDecimal precioUnitario;
        private BigDecimal importe;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotaCreditoDTO {
        private String folioNota;
        private String clienteNombre;
        private String tipoCombustible;
        private BigDecimal litros;
        private BigDecimal monto;
        private String autorizadoPor;
    }
}