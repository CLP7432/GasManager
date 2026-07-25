package com.gasmanager.ventas.dto;

import lombok.Data;

@Data
public class DispensarioDTO {
    private Long id;
    private String numero;
    private String nombre;
    private String ubicacion;
    private boolean activo;
}