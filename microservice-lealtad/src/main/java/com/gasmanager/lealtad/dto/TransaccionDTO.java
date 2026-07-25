package com.gasmanager.lealtad.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransaccionDTO {
    private Long ventaId;
    private LocalDateTime fecha;
    private double monto;
    private double litros;
    private int puntosGenerados;
}
