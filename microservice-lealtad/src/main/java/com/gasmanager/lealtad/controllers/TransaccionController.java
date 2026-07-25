package com.gasmanager.lealtad.controllers;

import com.gasmanager.lealtad.dto.TransaccionDTO;
import com.gasmanager.lealtad.entities.Transaccion;
import com.gasmanager.lealtad.service.TransaccionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {

    private final TransaccionService service;

    public TransaccionController(TransaccionService service) {
        this.service = service;
    }

    @PostMapping("/{ventaId}")
    public ResponseEntity<TransaccionDTO> registrarTransaccion(@PathVariable Long ventaId) {
        Transaccion transaccion = service.registrarTransaccion(ventaId);
        TransaccionDTO dto = TransaccionDTO.builder()
                .ventaId(transaccion.getVentaId())
                .monto(transaccion.getMonto())
                .litros(transaccion.getLitros())
                .fecha(transaccion.getFecha())
                .puntosGenerados(transaccion.getPuntosGenerados())
                .build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{ventaId}")
    public ResponseEntity<List<TransaccionDTO>> obtenerTransaccionesPorVenta(@PathVariable Long ventaId) {
        List<TransaccionDTO> transacciones = service.obtenerTransaccionesPorVenta(ventaId)
                .stream()
                .map(t -> TransaccionDTO.builder()
                        .ventaId(t.getVentaId())
                        .monto(t.getMonto())
                        .litros(t.getLitros())
                        .fecha(t.getFecha())
                        .puntosGenerados(t.getPuntosGenerados())
                        .build())
                .collect(Collectors.toList());
        if (transacciones.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(transacciones);
    }
}
