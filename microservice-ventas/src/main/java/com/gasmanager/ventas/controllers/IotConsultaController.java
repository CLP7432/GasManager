package com.gasmanager.ventas.controllers;

import com.gasmanager.ventas.dto.DispensarioDTO;
import com.gasmanager.ventas.dto.TurnoActivoDTO;
import com.gasmanager.ventas.entities.core.Dispensario;
import com.gasmanager.ventas.entities.core.Turno;
import com.gasmanager.ventas.enums.EstadoTurno;
import com.gasmanager.ventas.repositories.DispensarioRepository;
import com.gasmanager.ventas.repositories.TurnoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ventas/iot")
@RequiredArgsConstructor
@Slf4j
public class IotConsultaController {

    private final TurnoRepository turnoRepository;
    private final DispensarioRepository dispensarioRepository;

    // ===== 1. CONSULTAR TURNO ACTIVO =====
    @GetMapping("/turno-activo")
    public ResponseEntity<TurnoActivoDTO> obtenerTurnoActivo() {
        log.info("Consultando turno activo para IoT...");

        List<Turno> turnosActivos = turnoRepository.findByEstado(EstadoTurno.ABIERTO);

        TurnoActivoDTO response = new TurnoActivoDTO();

        if (turnosActivos.isEmpty()) {
            log.warn("No hay turnos activos");
            response.setTieneTurnoActivo(false);
            return ResponseEntity.ok(response);
        }

        Turno turno = turnosActivos.get(0);
        response.setTieneTurnoActivo(true);
        response.setTurnoId(turno.getId());
        response.setCodigoTurno(turno.getCodigoTurno());
        response.setNombreTurno(turno.getNombre());

        log.info("Turno activo encontrado: {} - {}", turno.getCodigoTurno(), turno.getNombre());
        return ResponseEntity.ok(response);
    }

    // ===== 2. CONSULTAR DISPENSARIOS =====
    @GetMapping("/dispensarios")
    public ResponseEntity<List<DispensarioDTO>> obtenerDispensarios() {
        log.info("Consultando dispensarios para IoT...");

        List<Dispensario> dispensarios = dispensarioRepository.findAll();

        List<DispensarioDTO> response = dispensarios.stream()
                .filter(Dispensario::isActivo)
                .map(d -> {
                    DispensarioDTO dto = new DispensarioDTO();
                    dto.setId(d.getId());
                    dto.setNumero(d.getNumero());
                    dto.setNombre(d.getNombre());
                    dto.setUbicacion(d.getUbicacion());
                    dto.setActivo(d.isActivo());
                    return dto;
                })
                .collect(Collectors.toList());

        log.info("Dispensarios encontrados: {}", response.size());
        return ResponseEntity.ok(response);
    }
}