package com.gasmanager.ventas.controllers;

import com.gasmanager.ventas.dto.CorteTurnoRequestDTO;
import com.gasmanager.ventas.dto.CorteTurnoResponseDTO;
import com.gasmanager.ventas.dto.LecturaInicialDTO;
import com.gasmanager.ventas.services.CorteTurnoDetalladoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cortes-detallado")
@RequiredArgsConstructor
public class CorteTurnoDetalladoController {

    private final CorteTurnoDetalladoService corteService;

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        return ResponseEntity.ok(Map.of("status", "OK", "message", "CorteTurnoDetalladoController funcionando"));
    }

    @GetMapping("/lecturas-iniciales/{turnoId}")
    public ResponseEntity<List<LecturaInicialDTO>> obtenerLecturasIniciales(@PathVariable Long turnoId) {
        return ResponseEntity.ok(corteService.obtenerLecturasIniciales(turnoId));
    }

    @PostMapping("/procesar")
    public ResponseEntity<CorteTurnoResponseDTO> procesarCorte(@RequestBody CorteTurnoRequestDTO request) {
        return ResponseEntity.ok(corteService.procesarCorte(request));
    }

    @GetMapping
    public ResponseEntity<List<CorteTurnoResponseDTO>> listarCortes() {
        return ResponseEntity.ok(corteService.listarCortes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CorteTurnoResponseDTO> obtenerCorte(@PathVariable Long id) {
        return ResponseEntity.ok(corteService.obtenerCorte(id));
    }

    @PostMapping("/configuracion-inicial")
    public ResponseEntity<Void> guardarConfiguracionInicial(@RequestBody List<LecturaInicialDTO> lecturas) {
        corteService.guardarLecturasBase(lecturas);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/verificar-configuracion")
    public ResponseEntity<Boolean> verificarConfiguracion() {
        return ResponseEntity.ok(corteService.yaSeRealizoConfiguracionInicial());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CorteTurnoResponseDTO> actualizarCorte(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            CorteTurnoResponseDTO corte = corteService.actualizarCorte(id, updates);
            return ResponseEntity.ok(corte);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}