package com.gasmanager.ventas.controllers;

import com.gasmanager.ventas.dto.CorteTurnoResponseDTO;
import com.gasmanager.ventas.services.CorteTurnoDetalladoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cortes")
@RequiredArgsConstructor
public class CorteTurnoController {

    private final CorteTurnoDetalladoService corteService;

    // ===== ENDPOINTS EXISTENTES =====

    @GetMapping
    public ResponseEntity<List<CorteTurnoResponseDTO>> listarCortes() {
        return ResponseEntity.ok(corteService.listarCortes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CorteTurnoResponseDTO> obtenerCorte(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(corteService.obtenerCorte(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<CorteTurnoResponseDTO>> listarPorEstado(@PathVariable String estado) {
        List<CorteTurnoResponseDTO> cortes = corteService.listarCortes().stream()
                .filter(c -> c.getEstado().equalsIgnoreCase(estado))
                .collect(Collectors.toList());
        return ResponseEntity.ok(cortes);
    }

    @PostMapping("/{id}/validar")
    public ResponseEntity<?> validarCorte(
            @PathVariable Long id,
            @RequestParam Long supervisorId,
            @RequestParam String supervisorNombre) {
        System.out.println("=== VALIDANDO CORTE ID: " + id);
        try {
            CorteTurnoResponseDTO corte = corteService.validarCorte(id, supervisorId, supervisorNombre);
            return ResponseEntity.ok(corte);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/cerrar")
    public ResponseEntity<?> cerrarCorte(@PathVariable Long id) {
        System.out.println("=== CERRANDO CORTE ID: " + id);
        try {
            CorteTurnoResponseDTO corte = corteService.cerrarCorte(id);
            return ResponseEntity.ok(corte);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==========================================
    // ===== NUEVOS ENDPOINTS =====
    // ==========================================

    @GetMapping("/dispensarios-disponibles/{turnoId}")
    public ResponseEntity<List<Map<String, Object>>> obtenerDispensariosDisponibles(@PathVariable Long turnoId) {
        System.out.println("=== OBTENIENDO DISPENSARIOS DISPONIBLES PARA TURNO: " + turnoId);
        try {
            List<Map<String, Object>> resultado = corteService.obtenerDispensariosDisponibles(turnoId);
            System.out.println("Dispensarios encontrados: " + resultado.size());
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/diagnostico/{turnoId}")
    public ResponseEntity<Map<String, Object>> diagnosticar(@PathVariable Long turnoId) {
        System.out.println("=== DIAGNÓSTICO PARA TURNO: " + turnoId);
        try {
            Map<String, Object> resultado = corteService.obtenerDiagnostico(turnoId);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            System.err.println("Error en diagnostico: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}