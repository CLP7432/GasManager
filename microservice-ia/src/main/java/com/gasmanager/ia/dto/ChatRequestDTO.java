package com.gasmanager.ia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequestDTO {
    @NotBlank(message = "El mensaje es obligatorio")
    private String mensaje;

    private String contexto;  // "VENTAS", "INVENTARIO", "ADMIN"
    private String usuarioId;
    private String usuarioNombre;
}