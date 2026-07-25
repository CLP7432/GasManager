// dto/PrecioUpdateDTO.java
package com.gasmanager.ventas.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrecioUpdateDTO {
    @NotNull(message = "El nuevo precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private BigDecimal nuevoPrecio;

    @Size(max = 200, message = "El motivo no puede exceder 200 caracteres")
    private String motivoCambio;
}