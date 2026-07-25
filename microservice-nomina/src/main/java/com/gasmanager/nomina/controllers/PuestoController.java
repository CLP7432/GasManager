package com.gasmanager.nomina.controllers;

import com.gasmanager.nomina.dto.PuestoDTO;
import com.gasmanager.nomina.services.PuestoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puestos")
@RequiredArgsConstructor
public class PuestoController {

    private final PuestoService puestoService;

    private Long getCurrentUserId() {
        return 1L;
    }

    private String getCurrentUserNombre() {
        return "SISTEMA";
    }

    @PostMapping
    public ResponseEntity<PuestoDTO> crearPuesto(@Valid @RequestBody PuestoDTO puestoDTO) {
        PuestoDTO nuevoPuesto = puestoService.crearPuesto(
                puestoDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPuesto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PuestoDTO> actualizarPuesto(
            @PathVariable Long id,
            @Valid @RequestBody PuestoDTO puestoDTO) {
        PuestoDTO puestoActualizado = puestoService.actualizarPuesto(
                id, puestoDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(puestoActualizado);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<PuestoDTO> toggleActivo(@PathVariable Long id) {
        return ResponseEntity.ok(puestoService.toggleActivo(id));
    }

    @GetMapping
    public ResponseEntity<List<PuestoDTO>> listarPuestos() {
        return ResponseEntity.ok(puestoService.listarPuestos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<PuestoDTO>> listarPuestosActivos() {
        return ResponseEntity.ok(puestoService.listarPuestosActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PuestoDTO> obtenerPuesto(@PathVariable Long id) {
        return ResponseEntity.ok(puestoService.obtenerPuesto(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPuesto(@PathVariable Long id) {
        puestoService.eliminarPuesto(id);
        return ResponseEntity.noContent().build();
    }
}