package com.gasmanager.facturacion.enums;

public enum MetodoPago {
    PAGO_EN_UNA_EXHIBICION("PUE", "Pago en una sola exhibición"),
    PAGO_EN_PARCIALIDADES("PPD", "Pago en parcialidades o diferido");

    private final String clave;
    private final String descripcion;

    MetodoPago(String clave, String descripcion) {
        this.clave = clave;
        this.descripcion = descripcion;
    }

    public String getClave() { return clave; }
    public String getDescripcion() { return descripcion; }
}