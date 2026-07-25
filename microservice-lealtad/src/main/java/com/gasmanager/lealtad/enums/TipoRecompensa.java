package com.gasmanager.lealtad.enums;

import lombok.Getter;

@Getter
public enum TipoRecompensa {
    DESCUENTO("Descuento directo en gasolina o productos"),
    PRODUCTO_GRATIS("Producto o servicio gratuito"),
    EFECTIVO("Conversion de puntos a saldo monetario");

    private final String descripcion;

    TipoRecompensa(String descripcion) {
        this.descripcion = descripcion;
    }
}
