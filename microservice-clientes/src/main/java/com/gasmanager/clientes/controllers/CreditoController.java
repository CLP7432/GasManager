package com.gasmanager.clientes.controllers;

import com.gasmanager.clientes.dto.AbonoCreditoDTO;
import com.gasmanager.clientes.dto.CreditoDTO;
import com.gasmanager.clientes.enums.EstadoCredito;
import com.gasmanager.clientes.services.CreditoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/creditos")
@RequiredArgsConstructor
public class CreditoController {

    private final CreditoService creditoService;

    private Long getCurrentUserId() {
        return 1L;
    }

    private String getCurrentUserNombre() {
        return "SISTEMA";
    }

    @PostMapping
    public ResponseEntity<CreditoDTO> crearCredito(@Valid @RequestBody CreditoDTO creditoDTO) {
        CreditoDTO nuevoCredito = creditoService.crearCredito(
                creditoDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCredito);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CreditoDTO> actualizarCredito(
            @PathVariable Long id,
            @Valid @RequestBody CreditoDTO creditoDTO) {
        CreditoDTO creditoActualizado = creditoService.actualizarCredito(
                id, creditoDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(creditoActualizado);
    }

    @GetMapping
    public ResponseEntity<List<CreditoDTO>> listarCreditos() {
        return ResponseEntity.ok(creditoService.listarCreditos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CreditoDTO> obtenerCredito(@PathVariable Long id) {
        return ResponseEntity.ok(creditoService.obtenerCredito(id));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<CreditoDTO>> listarCreditosPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(creditoService.listarCreditosPorCliente(clienteId));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<CreditoDTO>> listarCreditosPorEstado(@PathVariable EstadoCredito estado) {
        return ResponseEntity.ok(creditoService.listarCreditosPorEstado(estado));
    }

    @GetMapping("/activos-con-saldo")
    public ResponseEntity<List<CreditoDTO>> listarCreditosActivosConSaldo() {
        return ResponseEntity.ok(creditoService.listarCreditosActivosConSaldo());
    }

    @GetMapping("/vencidos")
    public ResponseEntity<List<CreditoDTO>> listarCreditosVencidos() {
        // Primero actualizar los créditos vencidos
        int actualizados = creditoService.actualizarCreditosVencidos();
        System.out.println("Créditos actualizados a VENCIDO: " + actualizados);

        // Luego retornar la lista
        return ResponseEntity.ok(creditoService.listarCreditosVencidos());
    }

    @PostMapping("/{creditoId}/abonos")
    public ResponseEntity<CreditoDTO> registrarAbono(
            @PathVariable Long creditoId,
            @Valid @RequestBody AbonoCreditoDTO abonoDTO) {
        CreditoDTO creditoActualizado = creditoService.registrarAbono(
                creditoId, abonoDTO, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(creditoActualizado);
    }

    @GetMapping("/{creditoId}/abonos")
    public ResponseEntity<List<AbonoCreditoDTO>> listarAbonosPorCredito(@PathVariable Long creditoId) {
        return ResponseEntity.ok(creditoService.listarAbonosPorCredito(creditoId));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<CreditoDTO> cancelarCredito(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {
        CreditoDTO creditoCancelado = creditoService.cancelarCredito(
                id, motivo, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(creditoCancelado);
    }

    @GetMapping("/con-saldo-pendiente")
    public ResponseEntity<List<CreditoDTO>> listarCreditosConSaldoPendiente() {
        return ResponseEntity.ok(creditoService.listarCreditosConSaldoPendiente());
    }
}