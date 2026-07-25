package com.gasmanager.compras.controllers;

import com.gasmanager.compras.dto.ProveedorDTO;
import com.gasmanager.compras.services.ProveedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@RequiredArgsConstructor
public class ProveedorController {

    private final ProveedorService proveedorService;

    private Long getCurrentUserId() {
        return 1L;
    }

    private String getCurrentUserNombre() {
        return "SISTEMA";
    }

    @PostMapping
    public ResponseEntity<ProveedorDTO> crearProveedor(@Valid @RequestBody ProveedorDTO proveedorDTO) {
        ProveedorDTO nuevoProveedor = proveedorService.crearProveedor(
                proveedorDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProveedor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProveedorDTO> actualizarProveedor(
            @PathVariable Long id,
            @Valid @RequestBody ProveedorDTO proveedorDTO) {
        ProveedorDTO proveedorActualizado = proveedorService.actualizarProveedor(
                id, proveedorDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(proveedorActualizado);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ProveedorDTO> toggleActivo(@PathVariable Long id) {
        return ResponseEntity.ok(proveedorService.toggleActivo(id));
    }

    @GetMapping
    public ResponseEntity<List<ProveedorDTO>> listarProveedores() {
        return ResponseEntity.ok(proveedorService.listarProveedores());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<ProveedorDTO>> listarProveedoresActivos() {
        return ResponseEntity.ok(proveedorService.listarProveedoresActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProveedorDTO> obtenerProveedor(@PathVariable Long id) {
        return ResponseEntity.ok(proveedorService.obtenerProveedor(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProveedorDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(proveedorService.buscarPorNombre(nombre));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProveedor(@PathVariable Long id) {
        proveedorService.eliminarProveedor(id);
        return ResponseEntity.noContent().build();
    }
}