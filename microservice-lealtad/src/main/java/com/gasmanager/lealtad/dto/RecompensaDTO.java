package com.gasmanager.lealtad.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecompensaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private int costoPuntos;
    private boolean activo;
}
