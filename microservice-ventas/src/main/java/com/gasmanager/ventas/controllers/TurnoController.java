package com.gasmanager.ventas.controllers;

import com.gasmanager.ventas.entities.core.Turno;
import com.gasmanager.ventas.enums.EstadoTurno;
import com.gasmanager.ventas.services.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turnos")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;

    // Crear turno
    @PostMapping
    public ResponseEntity<Turno> crearTurno(@RequestBody Turno turno) {
        try {
            Turno nuevoTurno = turnoService.crearTurno(turno);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTurno);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Listar todos los turnos (con filtro opcional por estado)
    @GetMapping
    public ResponseEntity<List<Turno>> listarTurnos(
            @RequestParam(required = false) String estado) {
        if (estado != null && !estado.isEmpty()) {
            try {
                EstadoTurno estadoEnum = EstadoTurno.valueOf(estado.toUpperCase());
                return ResponseEntity.ok(turnoService.listarPorEstado(estadoEnum));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.ok(turnoService.listarTodos());
    }

    // Obtener turno por ID
    @GetMapping("/{id}")
    public ResponseEntity<Turno> obtenerTurno(@PathVariable Long id) {
        return turnoService.obtenerTurno(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Obtener turno por código
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Turno> obtenerPorCodigo(@PathVariable String codigo) {
        return turnoService.obtenerPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Listar turnos por estado (endpoint específico)
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Turno>> listarPorEstado(@PathVariable EstadoTurno estado) {
        return ResponseEntity.ok(turnoService.listarPorEstado(estado));
    }

    // Listar turnos por supervisor
    @GetMapping("/supervisor/{supervisorId}")
    public ResponseEntity<List<Turno>> listarPorSupervisor(@PathVariable Long supervisorId) {
        return ResponseEntity.ok(turnoService.listarPorSupervisor(supervisorId));
    }

    // Listar turnos por rango de fechas
    @GetMapping("/filtro/fechas")
    public ResponseEntity<List<Turno>> listarPorFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(turnoService.listarPorFechas(inicio, fin));
    }

    // Actualizar turno
    @PutMapping("/{id}")
    public ResponseEntity<Turno> actualizarTurno(@PathVariable Long id, @RequestBody Turno turno) {
        try {
            return ResponseEntity.ok(turnoService.actualizarTurno(id, turno));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Cerrar turno
    @PostMapping("/{id}/cerrar")
    public ResponseEntity<Map<String, Object>> cerrarTurno(@PathVariable Long id) {
        if (turnoService.cerrarTurno(id)) {
            return ResponseEntity.ok(Map.of("mensaje", "Turno cerrado exitosamente"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "No se pudo cerrar el turno"));
    }

    // Obtener turno activo de un supervisor
    @GetMapping("/supervisor/{supervisorId}/activo")
    public ResponseEntity<Turno> obtenerTurnoActivo(@PathVariable Long supervisorId) {
        return turnoService.obtenerTurnoActivoDeSupervisor(supervisorId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Verificar si supervisor tiene turno activo
    @GetMapping("/supervisor/{supervisorId}/tiene-activo")
    public ResponseEntity<Map<String, Boolean>> tieneTurnoActivo(@PathVariable Long supervisorId) {
        boolean tieneActivo = turnoService.existeTurnoActivoParaSupervisor(supervisorId);
        return ResponseEntity.ok(Map.of("tieneTurnoActivo", tieneActivo));
    }
}