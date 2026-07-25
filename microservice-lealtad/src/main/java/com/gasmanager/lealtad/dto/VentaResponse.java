package com.gasmanager.lealtad.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class VentaResponse {
    private Long id;
    private String folio;
    private BigDecimal total;
    private List<DetalleVentaResponse> detalles;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DetalleVentaResponse {
        private BigDecimal cantidad;
        private String unidadMedida;
    }
}
