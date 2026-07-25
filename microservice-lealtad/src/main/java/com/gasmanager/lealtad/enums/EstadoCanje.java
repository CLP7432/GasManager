package com.gasmanager.lealtad.enums;

import lombok.Getter;

@Getter
public enum EstadoCanje {
    PENDIENTE("Pendiente de aprobacion"),
    APROBADO("Canje aprobado y entregado"),
    CANCELADO("Canje cancelado");

    private final String descripcion;

    EstadoCanje(String descripcion) {
        this.descripcion = descripcion;
    }
}
