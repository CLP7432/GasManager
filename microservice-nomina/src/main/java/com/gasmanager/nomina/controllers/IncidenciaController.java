package com.gasmanager.nomina.controllers;

import com.gasmanager.nomina.dto.IncidenciaDTO;
import com.gasmanager.nomina.services.IncidenciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
@RequiredArgsConstructor
public class IncidenciaController {

    private final IncidenciaService incidenciaService;

    private Long getCurrentUserId() {
        return 1L;
    }

    private String getCurrentUserNombre() {
        return "SISTEMA";
    }

    @PostMapping
    public ResponseEntity<IncidenciaDTO> registrarIncidencia(@Valid @RequestBody IncidenciaDTO incidenciaDTO) {
        IncidenciaDTO nuevaIncidencia = incidenciaService.registrarIncidencia(
                incidenciaDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaIncidencia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidenciaDTO> actualizarIncidencia(
            @PathVariable Long id,
            @Valid @RequestBody IncidenciaDTO incidenciaDTO) {
        IncidenciaDTO incidenciaActualizada = incidenciaService.actualizarIncidencia(
                id, incidenciaDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(incidenciaActualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarIncidencia(@PathVariable Long id) {
        incidenciaService.eliminarIncidencia(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<IncidenciaDTO>> listarIncidencias() {
        return ResponseEntity.ok(incidenciaService.listarIncidencias());
    }

    @GetMapping("/empleado/{empleadoId}")
    public ResponseEntity<List<IncidenciaDTO>> listarIncidenciasPorEmpleado(@PathVariable Long empleadoId) {
        return ResponseEntity.ok(incidenciaService.listarIncidenciasPorEmpleado(empleadoId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidenciaDTO> obtenerIncidencia(@PathVariable Long id) {
        return ResponseEntity.ok(incidenciaService.obtenerIncidencia(id));
    }
}