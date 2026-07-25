package com.gasmanager.clientes.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AbonoCreditoDTO {

    private Long id;

    private String folioAbono;


    private Long creditoId;

    private String creditoFolio;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal monto;

    @NotNull(message = "La fecha del abono es obligatoria")
    private LocalDate fechaAbono;

    @NotBlank(message = "El método de pago es obligatorio")
    private String metodoPago;

    private String referenciaPago;

    private String notas;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}