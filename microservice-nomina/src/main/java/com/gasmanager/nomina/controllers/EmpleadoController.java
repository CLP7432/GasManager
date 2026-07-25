package com.gasmanager.nomina.controllers;

import com.gasmanager.nomina.dto.EmpleadoDTO;
import com.gasmanager.nomina.services.EmpleadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    private Long getCurrentUserId() {
        return 1L;
    }

    private String getCurrentUserNombre() {
        return "SISTEMA";
    }

    @PostMapping
    public ResponseEntity<EmpleadoDTO> crearEmpleado(@Valid @RequestBody EmpleadoDTO empleadoDTO) {
        EmpleadoDTO nuevoEmpleado = empleadoService.crearEmpleado(
                empleadoDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEmpleado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpleadoDTO> actualizarEmpleado(
            @PathVariable Long id,
            @Valid @RequestBody EmpleadoDTO empleadoDTO) {
        EmpleadoDTO empleadoActualizado = empleadoService.actualizarEmpleado(
                id, empleadoDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(empleadoActualizado);
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<EmpleadoDTO> desactivarEmpleado(
            @PathVariable Long id,
            @RequestParam(required = false) LocalDate fechaBaja,
            @RequestParam(required = false) String motivo) {
        EmpleadoDTO empleado = empleadoService.desactivarEmpleado(
                id, fechaBaja, motivo, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(empleado);
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<EmpleadoDTO> reactivarEmpleado(@PathVariable Long id) {
        EmpleadoDTO empleado = empleadoService.reactivarEmpleado(
                id, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(empleado);
    }

    @GetMapping
    public ResponseEntity<List<EmpleadoDTO>> listarEmpleados() {
        return ResponseEntity.ok(empleadoService.listarEmpleados());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<EmpleadoDTO>> listarEmpleadosActivos() {
        return ResponseEntity.ok(empleadoService.listarEmpleadosActivos());
    }

    // ===== 🆕 OBTENER SOLO DESPACHADORES =====
    @GetMapping("/despachadores")
    public ResponseEntity<List<EmpleadoDTO>> listarDespachadores() {
        return ResponseEntity.ok(empleadoService.listarDespachadores());
    }

    // ===== 🆕 OBTENER SOLO SUPERVISORES =====
    @GetMapping("/supervisores")
    public ResponseEntity<List<EmpleadoDTO>> listarSupervisores() {
        return ResponseEntity.ok(empleadoService.listarSupervisores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoDTO> obtenerEmpleado(@PathVariable Long id) {
        return ResponseEntity.ok(empleadoService.obtenerEmpleado(id));
    }

    @GetMapping("/rfc/{rfc}")
    public ResponseEntity<EmpleadoDTO> obtenerEmpleadoPorRFC(@PathVariable String rfc) {
        return ResponseEntity.ok(empleadoService.obtenerEmpleadoPorRFC(rfc));
    }

    @GetMapping("/departamento/{departamentoId}")
    public ResponseEntity<List<EmpleadoDTO>> listarPorDepartamento(@PathVariable Long departamentoId) {
        return ResponseEntity.ok(empleadoService.listarEmpleadosPorDepartamento(departamentoId));
    }

    @GetMapping("/puesto/{puestoId}")
    public ResponseEntity<List<EmpleadoDTO>> listarPorPuesto(@PathVariable Long puestoId) {
        return ResponseEntity.ok(empleadoService.listarEmpleadosPorPuesto(puestoId));
    }
}