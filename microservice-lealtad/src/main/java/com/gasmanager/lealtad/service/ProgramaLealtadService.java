package com.gasmanager.lealtad.service;

import com.gasmanager.lealtad.entities.ProgramaLealtad;
import com.gasmanager.lealtad.repositories.ProgramaLealtadRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProgramaLealtadService {

    private final ProgramaLealtadRepository repo;

    public ProgramaLealtadService(ProgramaLealtadRepository repo) {
        this.repo = repo;
    }

    public ProgramaLealtad crearPrograma(ProgramaLealtad programa) {
        return repo.save(programa);
    }

    public List<ProgramaLealtad> listarProgramas() {
        return repo.findAll();
    }

    public ProgramaLealtad activarPrograma(Long id) {
        repo.findByActivoTrue().ifPresent(p -> {
            p.setActivo(false);
            repo.save(p);
        });
        ProgramaLealtad programa = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado"));
        programa.setActivo(true);
        return repo.save(programa);
    }

    public void desactivarPrograma(Long id) {
        ProgramaLealtad programa = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Programa no encontrado"));
        programa.setActivo(false);
        repo.save(programa);
    }

    public ProgramaLealtad obtenerProgramaActivo() {
        return repo.findByActivoTrue()
                .orElseThrow(() -> new IllegalStateException("No hay programa activo"));
    }
}
