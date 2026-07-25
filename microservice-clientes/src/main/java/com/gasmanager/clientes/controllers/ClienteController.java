package com.gasmanager.clientes.controllers;

import com.gasmanager.clientes.dto.ClienteDTO;
import com.gasmanager.clientes.services.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    // Obtener usuario actual (temporal, después vendrá del token)
    private Long getCurrentUserId() {
        return 1L;
    }

    private String getCurrentUserNombre() {
        return "SISTEMA";
    }

    @PostMapping
    public ResponseEntity<ClienteDTO> crearCliente(@Valid @RequestBody ClienteDTO clienteDTO) {
        ClienteDTO nuevoCliente = clienteService.crearCliente(
                clienteDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> actualizarCliente(
            @PathVariable Long id,
            @Valid @RequestBody ClienteDTO clienteDTO) {
        ClienteDTO clienteActualizado = clienteService.actualizarCliente(
                id, clienteDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(clienteActualizado);
    }

    @GetMapping
    public ResponseEntity<List<ClienteDTO>> listarClientes() {
        return ResponseEntity.ok(clienteService.listarClientes());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<ClienteDTO>> listarClientesActivos() {
        return ResponseEntity.ok(clienteService.listarClientesActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> obtenerCliente(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.obtenerCliente(id));
    }

    @GetMapping("/rfc/{rfc}")
    public ResponseEntity<ClienteDTO> obtenerClientePorRFC(@PathVariable String rfc) {
        return ResponseEntity.ok(clienteService.obtenerClientePorRFC(rfc));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ClienteDTO>> buscarPorRazonSocial(@RequestParam String razonSocial) {
        return ResponseEntity.ok(clienteService.buscarPorRazonSocial(razonSocial));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ClienteDTO> toggleActivo(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.toggleActivo(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {
        clienteService.eliminarCliente(id);
        return ResponseEntity.noContent().build();
    }
}