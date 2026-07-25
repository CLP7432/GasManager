package com.gasmanager.users.controllers;

import com.gasmanager.users.entities.core.AuditoriaAccion;
import com.gasmanager.users.repositories.AuditoriaAccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auditorias")
@RequiredArgsConstructor
public class AuditoriaController {

    private final AuditoriaAccionRepository auditoriaRepository;

    // Listar todas las auditorías
    @GetMapping
    public ResponseEntity<List<AuditoriaAccion>> listarTodas() {
        return ResponseEntity.ok(auditoriaRepository.findAllByOrderByFechaHoraDesc());
    }

    // Auditorías por usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<AuditoriaAccion>> auditoriasPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(auditoriaRepository.findByIdUsuarioEjecutor(idUsuario));
    }

    // Auditorías por rango de fechas
    @GetMapping("/rango")
    public ResponseEntity<List<AuditoriaAccion>> auditoriasPorRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(auditoriaRepository.findByFechaHoraBetween(inicio, fin));
    }
}