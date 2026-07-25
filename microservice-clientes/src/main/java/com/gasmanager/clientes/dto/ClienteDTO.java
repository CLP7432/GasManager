package com.gasmanager.clientes.dto;

import com.gasmanager.clientes.enums.TipoPersona;
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
public class ClienteDTO {

    private Long id;

    private String codigoCliente;

    @NotNull(message = "El tipo de persona es obligatorio")
    private TipoPersona tipoPersona;

    @Size(max = 150, message = "La razón social no puede exceder 150 caracteres")
    private String razonSocial;

    @Size(max = 100, message = "El nombre comercial no puede exceder 100 caracteres")
    private String nombreComercial;

    @Pattern(regexp = "^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$", message = "RFC inválido")
    private String rfc;

    @Pattern(regexp = "^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$", message = "CURP inválida")
    private String curp;

    @Email(message = "Email inválido")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Teléfono inválido (10 dígitos)")
    private String telefono;

    @Pattern(regexp = "^[0-9]{10}$", message = "Celular inválido (10 dígitos)")
    private String celular;

    private String calle;
    private String numeroExterior;
    private String numeroInterior;
    private String colonia;
    private String ciudad;
    private String estado;
    private String codigoPostal;

    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}