package com.gasmanager.lealtad.service;

import com.gasmanager.lealtad.entities.CanjeRecompensa;
import java.util.List;

public interface CanjeService {
    CanjeRecompensa registrarCanje(Long ventaId, Long recompensaId);
    List<CanjeRecompensa> obtenerCanjesPorVenta(Long ventaId);
}
