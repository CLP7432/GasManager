package com.gasmanager.lealtad.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CanjeDTO {
    private Long ventaId;
    private Long recompensaId;
    private LocalDateTime fechaCanje;
    private int puntosUsados;
    private String estado;
}
