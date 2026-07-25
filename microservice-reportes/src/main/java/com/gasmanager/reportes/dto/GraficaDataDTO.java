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
public class GraficaDataDTO {
    private String label;      // Etiqueta (día, producto, método, etc.)
    private BigDecimal value;  // Valor numérico
    private String color;      // Color opcional para la gráfica (hex, ej: "#FF5733")
    private String serie;      // Para gráficas de series múltiples
    private Long count;        // Para conteos
}