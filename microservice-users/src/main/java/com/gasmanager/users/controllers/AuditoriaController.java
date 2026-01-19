package com.gasmanager.users.controllers;

import com.gasmanager.users.entities.core.AuditoriaAccion;
import com.gasmanager.users.repositories.AuditoriaAccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auditorias")
@RequiredArgsConstructor
public class AuditoriaController {

    private final AuditoriaAccionRepository auditoriaRepository;

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<AuditoriaAccion>> auditoriasPorUsuario(
            @PathVariable Integer idUsuario){

        return ResponseEntity.ok(auditoriaRepository
                .findByIdUsuarioEjecutor(idUsuario));
    }

    public ResponseEntity<List<AuditoriaAccion>> auditoriasPorRango(
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fin){

        return ResponseEntity.ok(auditoriaRepository.findByFechaHoraBetween(inicio, fin));
    }
}
