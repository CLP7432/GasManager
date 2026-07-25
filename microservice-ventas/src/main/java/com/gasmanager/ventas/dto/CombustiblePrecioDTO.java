// dto/CombustiblePrecioDTO.java
package com.gasmanager.ventas.dto;

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
public class CombustiblePrecioDTO {
    private Long id;
    private String tipo;
    private String nombre;
    private BigDecimal precioActual;
    private Boolean activo;
    private LocalDateTime ultimaActualizacion;
}