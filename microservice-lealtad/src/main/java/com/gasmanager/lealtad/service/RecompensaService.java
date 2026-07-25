package com.gasmanager.lealtad.service;

import com.gasmanager.lealtad.dto.RecompensaDTO;
import com.gasmanager.lealtad.entities.Recompensas;
import java.util.List;

public interface RecompensaService {
    List<Recompensas> listarRecompensasDisponibles();
    Recompensas validarRecompensa(Long recompensaId);
    RecompensaDTO crearRecompensa(RecompensaDTO dto);
    RecompensaDTO actualizarRecompensa(Long id, RecompensaDTO dto);
    void eliminarRecompensa(Long id);
}
