package com.gasmanager.inventarios.dto;

import com.gasmanager.inventarios.enums.TipoCombustible;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class CombustibleRequestDTO {

    @NotNull(message = "El tipo de combustible es obligatorio")
    private TipoCombustible tipo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede exceder los 50 caracteres")
    private String nombre;

    @Size(max = 200, message = "La descripción no puede exceder los 200 caracteres")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    @DecimalMax(value = "999.99", message = "El precio no puede exceder 999.99")
    private BigDecimal precioActual;

    public CombustibleRequestDTO() {
    }

    public CombustibleRequestDTO(TipoCombustible tipo, String nombre,
                                 String descripcion, BigDecimal precioActual) {
        this.tipo = tipo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioActual = precioActual;
    }

    public TipoCombustible getTipo() {
        return tipo;
    }

    public void setTipo(TipoCombustible tipo) {
        this.tipo = tipo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getPrecioActual() {
        return precioActual;
    }

    public void setPrecioActual(BigDecimal precioActual) {
        this.precioActual = precioActual;
    }
}
