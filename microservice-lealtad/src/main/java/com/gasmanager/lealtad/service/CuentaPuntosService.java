package com.gasmanager.lealtad.service;

public interface CuentaPuntosService {
    int consultarSaldo(Long ventaId);
    void actualizarSaldo(Long ventaId, int puntos);
}
