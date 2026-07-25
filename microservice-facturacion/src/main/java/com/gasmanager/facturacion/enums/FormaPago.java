package com.gasmanager.facturacion.enums;

public enum FormaPago {
    EFECTIVO("01", "Efectivo"),
    CHEQUE("02", "Cheque"),
    TRANSFERENCIA("03", "Transferencia electrónica"),
    TARJETA_CREDITO("04", "Tarjeta de crédito"),
    TARJETA_DEBITO("28", "Tarjeta de débito");

    private final String clave;
    private final String descripcion;

    FormaPago(String clave, String descripcion) {
        this.clave = clave;
        this.descripcion = descripcion;
    }

    public String getClave() { return clave; }
    public String getDescripcion() { return descripcion; }
}