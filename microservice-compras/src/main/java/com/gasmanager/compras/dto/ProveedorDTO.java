package com.gasmanager.compras.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProveedorDTO {

    private Long id;
    private String codigoProveedor;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre no puede exceder 150 caracteres")
    private String nombre;

    @Pattern(regexp = "^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$", message = "RFC inválido")
    private String rfc;

    @Email(message = "Email inválido")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Teléfono inválido")
    private String telefono;

    private String contacto;
    private String direccion;
    private Boolean activo;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}