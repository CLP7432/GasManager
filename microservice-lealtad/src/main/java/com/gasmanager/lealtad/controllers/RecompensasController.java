package com.gasmanager.lealtad.controllers;

import com.gasmanager.lealtad.dto.RecompensaDTO;
import com.gasmanager.lealtad.entities.Recompensas;
import com.gasmanager.lealtad.repositories.RecompensaRepository;
import com.gasmanager.lealtad.service.RecompensaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recompensas")
public class RecompensasController {

    private final RecompensaRepository repo;
    private final RecompensaService service;

    public RecompensasController(RecompensaRepository repo, RecompensaService service) {
        this.repo = repo;
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<RecompensaDTO>> listarRecompensasActivas() {
        List<RecompensaDTO> recompensas = repo.findByActivoTrue().stream()
                .map(r -> RecompensaDTO.builder()
                        .id(r.getId())
                        .nombre(r.getNombre())
                        .descripcion(r.getDescripcion())
                        .costoPuntos(r.getCostoPuntos())
                        .activo(r.isActivo())
                        .build())
                .toList();
        return ResponseEntity.ok(recompensas);
    }

    @PostMapping
    public ResponseEntity<RecompensaDTO> crear(@RequestBody RecompensaDTO dto) {
        return ResponseEntity.ok(service.crearRecompensa(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecompensaDTO> actualizar(@PathVariable Long id, @RequestBody RecompensaDTO dto) {
        return ResponseEntity.ok(service.actualizarRecompensa(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminarRecompensa(id);
        return ResponseEntity.noContent().build();
    }
}
