package com.gasmanager.nomina.controllers;

import com.gasmanager.nomina.dto.NominaDTO;
import com.gasmanager.nomina.dto.ProcesarNominaRequestDTO;
import com.gasmanager.nomina.enums.EstadoNomina;
import com.gasmanager.nomina.services.NominaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nominas")
@RequiredArgsConstructor
public class NominaController {

    private final NominaService nominaService;

    private Long getCurrentUserId() {
        return 1L;
    }

    private String getCurrentUserNombre() {
        return "SISTEMA";
    }

    @PostMapping("/procesar")
    public ResponseEntity<NominaDTO> procesarNomina(@Valid @RequestBody ProcesarNominaRequestDTO request) {
        NominaDTO nomina = nominaService.procesarNomina(
                request, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(nomina);
    }

    @GetMapping
    public ResponseEntity<List<NominaDTO>> listarNominas() {
        return ResponseEntity.ok(nominaService.listarNominas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NominaDTO> obtenerNomina(@PathVariable Long id) {
        return ResponseEntity.ok(nominaService.obtenerNomina(id));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<NominaDTO>> listarNominasPorEstado(@PathVariable EstadoNomina estado) {
        return ResponseEntity.ok(nominaService.listarNominasPorEstado(estado));
    }

    @PostMapping("/{id}/marcar-pagada")
    public ResponseEntity<NominaDTO> marcarComoPagada(@PathVariable Long id) {
        NominaDTO nomina = nominaService.marcarComoPagada(
                id, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(nomina);
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<NominaDTO> cancelarNomina(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {
        NominaDTO nomina = nominaService.cancelarNomina(
                id, motivo != null ? motivo : "Cancelación solicitada",
                getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(nomina);
    }
}