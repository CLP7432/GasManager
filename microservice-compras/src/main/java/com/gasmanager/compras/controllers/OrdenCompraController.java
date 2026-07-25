package com.gasmanager.compras.controllers;

import com.gasmanager.compras.dto.OrdenCompraDTO;
import com.gasmanager.compras.dto.RecepcionCompraDTO;
import com.gasmanager.compras.enums.EstadoOrdenCompra;
import com.gasmanager.compras.services.OrdenCompraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes-compra")
@RequiredArgsConstructor
public class OrdenCompraController {

    private final OrdenCompraService ordenCompraService;

    private Long getCurrentUserId() {
        return 1L;
    }

    private String getCurrentUserNombre() {
        return "SISTEMA";
    }

    @PostMapping
    public ResponseEntity<OrdenCompraDTO> crearOrdenCompra(@Valid @RequestBody OrdenCompraDTO ordenCompraDTO) {
        OrdenCompraDTO nuevaOrden = ordenCompraService.crearOrdenCompra(
                ordenCompraDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaOrden);
    }

    @PostMapping("/recibir")
    public ResponseEntity<OrdenCompraDTO> recibirOrdenCompra(@Valid @RequestBody RecepcionCompraDTO recepcionDTO) {
        OrdenCompraDTO ordenRecibida = ordenCompraService.recibirOrdenCompra(
                recepcionDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(ordenRecibida);
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<OrdenCompraDTO> cancelarOrdenCompra(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {
        OrdenCompraDTO ordenCancelada = ordenCompraService.cancelarOrdenCompra(
                id, motivo != null ? motivo : "Cancelación solicitada",
                getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(ordenCancelada);
    }

    @GetMapping
    public ResponseEntity<List<OrdenCompraDTO>> listarOrdenes() {
        return ResponseEntity.ok(ordenCompraService.listarOrdenes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenCompraDTO> obtenerOrdenCompra(@PathVariable Long id) {
        return ResponseEntity.ok(ordenCompraService.obtenerOrdenCompra(id));
    }

    @GetMapping("/proveedor/{proveedorId}")
    public ResponseEntity<List<OrdenCompraDTO>> listarPorProveedor(@PathVariable Long proveedorId) {
        return ResponseEntity.ok(ordenCompraService.listarOrdenesPorProveedor(proveedorId));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<OrdenCompraDTO>> listarPorEstado(@PathVariable EstadoOrdenCompra estado) {
        return ResponseEntity.ok(ordenCompraService.listarOrdenesPorEstado(estado));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<OrdenCompraDTO>> listarOrdenesPendientes() {
        return ResponseEntity.ok(ordenCompraService.listarOrdenesPendientes());
    }
}