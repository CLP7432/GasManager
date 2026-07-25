package com.gasmanager.facturacion.dto;

import com.gasmanager.facturacion.enums.FormaPago;
import com.gasmanager.facturacion.enums.MetodoPago;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudFacturaDTO {

    // Datos del cliente
    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clienteId;

    @NotBlank(message = "El RFC es obligatorio")
    @Pattern(regexp = "^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$", message = "RFC inválido")
    private String rfc;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El régimen fiscal es obligatorio")
    private String regimenFiscal;

    @Pattern(regexp = "^[0-9]{5}$", message = "Código postal inválido")
    private String codigoPostal;

    @Email(message = "Email inválido")
    private String email;

    // Datos de la factura
    private FormaPago formaPago;
    private MetodoPago metodoPago;

    // Lista de IDs de ventas a facturar (una o múltiples)
    @NotEmpty(message = "Debe incluir al menos una venta")
    private List<Long> ventasIds;

    private String observaciones;
}