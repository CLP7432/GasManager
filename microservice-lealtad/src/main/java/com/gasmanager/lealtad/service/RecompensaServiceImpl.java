package com.gasmanager.lealtad.service;

import com.gasmanager.lealtad.dto.RecompensaDTO;
import com.gasmanager.lealtad.entities.Recompensas;
import com.gasmanager.lealtad.exceptions.RecompensaNoDisponibleException;
import com.gasmanager.lealtad.repositories.RecompensaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class RecompensaServiceImpl implements RecompensaService {

    private final RecompensaRepository repo;

    public RecompensaServiceImpl(RecompensaRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Recompensas> listarRecompensasDisponibles() {
        return repo.findByActivoTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public Recompensas validarRecompensa(Long recompensaId) {
        Recompensas recompensa = repo.findById(recompensaId)
                .orElseThrow(() -> new RecompensaNoDisponibleException("Recompensa no encontrada"));
        if (!recompensa.isActivo()) {
            throw new RecompensaNoDisponibleException("Recompensa inactiva");
        }
        return recompensa;
    }

    @Override
    public RecompensaDTO crearRecompensa(RecompensaDTO dto) {
        Recompensas recompensa = new Recompensas();
        recompensa.setNombre(dto.getNombre());
        recompensa.setDescripcion(dto.getDescripcion());
        recompensa.setCostoPuntos(dto.getCostoPuntos());
        recompensa.setActivo(true);
        return mapToDTO(repo.save(recompensa));
    }

    @Override
    public RecompensaDTO actualizarRecompensa(Long id, RecompensaDTO dto) {
        Recompensas recompensa = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Recompensa no encontrada"));
        recompensa.setNombre(dto.getNombre());
        recompensa.setDescripcion(dto.getDescripcion());
        recompensa.setCostoPuntos(dto.getCostoPuntos());
        recompensa.setActivo(dto.isActivo());
        return mapToDTO(repo.save(recompensa));
    }

    @Override
    public void eliminarRecompensa(Long id) {
        repo.deleteById(id);
    }

    private RecompensaDTO mapToDTO(Recompensas r) {
        RecompensaDTO dto = new RecompensaDTO();
        dto.setId(r.getId());
        dto.setNombre(r.getNombre());
        dto.setDescripcion(r.getDescripcion());
        dto.setCostoPuntos(r.getCostoPuntos());
        dto.setActivo(r.isActivo());
        return dto;
    }
}
