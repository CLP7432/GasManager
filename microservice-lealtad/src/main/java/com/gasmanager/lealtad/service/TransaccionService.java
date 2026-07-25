package com.gasmanager.lealtad.service;

import com.gasmanager.lealtad.entities.Transaccion;
import java.util.List;

public interface TransaccionService {
    Transaccion registrarTransaccion(Long ventaId);
    List<Transaccion> obtenerTransaccionesPorVenta(Long ventaId);
}
