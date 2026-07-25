package com.gasmanager.reportes.dto;

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
public class DashboardDTO {
    // Tarjetas resumen
    private BigDecimal ventasHoy;
    private BigDecimal ventasSemana;
    private BigDecimal ventasMes;
    private Long totalVentasHoy;
    private Long totalVentasSemana;
    private Long totalVentasMes;
    private Integer stockCombustiblePromedio;
    private Long clientesActivos;
    private Long facturasEmitidasMes;
    private BigDecimal creditosVencidos;
    private Long empleadosActivos;

    // Gráficas
    private List<GraficaDataDTO> ventasUltimos7Dias;
    private List<GraficaDataDTO> ventasPorProducto;
    private List<GraficaDataDTO> ventasPorMetodoPago;
    private List<GraficaDataDTO> inventarioCombustible;
    private List<GraficaDataDTO> topProductos;
    private List<GraficaDataDTO> creditosPorEstado;
    private List<GraficaDataDTO> facturasPorMes;
}