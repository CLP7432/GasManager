package com.gasmanager.inventarios.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class PrecioUpdateDTO {

    @NotNull(message = "El nuevo precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    @DecimalMax(value = "999.99", message = "El precio no puede exceder 999.99")
    private BigDecimal nuevoPrecio;

    @Size(max = 200, message = "El motivo no puede exceder los 200 caracteres")
    private String motivoCambio;

    public PrecioUpdateDTO() {
    }

    public PrecioUpdateDTO(BigDecimal nuevoPrecio, String motivoCambio) {
        this.nuevoPrecio = nuevoPrecio;
        this.motivoCambio = motivoCambio;
    }

    public BigDecimal getNuevoPrecio() {
        return nuevoPrecio;
    }

    public void setNuevoPrecio(BigDecimal nuevoPrecio) {
        this.nuevoPrecio = nuevoPrecio;
    }

    public String getMotivoCambio() {
        return motivoCambio;
    }

    public void setMotivoCambio(String motivoCambio) {
        this.motivoCambio = motivoCambio;
    }
}
