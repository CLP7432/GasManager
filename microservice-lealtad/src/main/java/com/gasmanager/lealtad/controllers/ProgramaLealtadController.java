package com.gasmanager.lealtad.controllers;

import com.gasmanager.lealtad.entities.ProgramaLealtad;
import com.gasmanager.lealtad.service.ProgramaLealtadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/programas")
public class ProgramaLealtadController {

    private final ProgramaLealtadService service;

    public ProgramaLealtadController(ProgramaLealtadService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ProgramaLealtad> crearPrograma(@RequestBody ProgramaLealtad programa) {
        return ResponseEntity.ok(service.crearPrograma(programa));
    }

    @GetMapping
    public ResponseEntity<List<ProgramaLealtad>> listarProgramas() {
        return ResponseEntity.ok(service.listarProgramas());
    }

    @PutMapping("/{id}/activar")
    public ResponseEntity<ProgramaLealtad> activarPrograma(@PathVariable Long id) {
        return ResponseEntity.ok(service.activarPrograma(id));
    }

    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivarPrograma(@PathVariable Long id) {
        service.desactivarPrograma(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/activo")
    public ResponseEntity<ProgramaLealtad> obtenerProgramaActivo() {
        return ResponseEntity.ok(service.obtenerProgramaActivo());
    }
}
