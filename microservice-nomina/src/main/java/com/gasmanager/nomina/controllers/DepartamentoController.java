package com.gasmanager.nomina.controllers;

import com.gasmanager.nomina.dto.DepartamentoDTO;
import com.gasmanager.nomina.services.DepartamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departamentos")
@RequiredArgsConstructor
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    private Long getCurrentUserId() {
        return 1L;
    }

    private String getCurrentUserNombre() {
        return "SISTEMA";
    }

    @PostMapping
    public ResponseEntity<DepartamentoDTO> crearDepartamento(@Valid @RequestBody DepartamentoDTO departamentoDTO) {
        DepartamentoDTO nuevoDepartamento = departamentoService.crearDepartamento(
                departamentoDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDepartamento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartamentoDTO> actualizarDepartamento(
            @PathVariable Long id,
            @Valid @RequestBody DepartamentoDTO departamentoDTO) {
        DepartamentoDTO departamentoActualizado = departamentoService.actualizarDepartamento(
                id, departamentoDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(departamentoActualizado);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<DepartamentoDTO> toggleActivo(@PathVariable Long id) {
        return ResponseEntity.ok(departamentoService.toggleActivo(id));
    }

    @GetMapping
    public ResponseEntity<List<DepartamentoDTO>> listarDepartamentos() {
        return ResponseEntity.ok(departamentoService.listarDepartamentos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<DepartamentoDTO>> listarDepartamentosActivos() {
        return ResponseEntity.ok(departamentoService.listarDepartamentosActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartamentoDTO> obtenerDepartamento(@PathVariable Long id) {
        return ResponseEntity.ok(departamentoService.obtenerDepartamento(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDepartamento(@PathVariable Long id) {
        departamentoService.eliminarDepartamento(id);
        return ResponseEntity.noContent().build();
    }
}