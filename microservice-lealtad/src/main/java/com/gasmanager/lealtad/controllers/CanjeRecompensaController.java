package com.gasmanager.lealtad.controllers;

import com.gasmanager.lealtad.dto.CanjeDTO;
import com.gasmanager.lealtad.entities.CanjeRecompensa;
import com.gasmanager.lealtad.service.CanjeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/canjes")
public class CanjeRecompensaController {

    private final CanjeService service;

    public CanjeRecompensaController(CanjeService service) {
        this.service = service;
    }

    @PostMapping("/{ventaId}/{recompensaId}")
    public ResponseEntity<CanjeDTO> registrarCanje(
            @PathVariable Long ventaId,
            @PathVariable Long recompensaId) {
        CanjeRecompensa canje = service.registrarCanje(ventaId, recompensaId);
        CanjeDTO dto = CanjeDTO.builder()
                .ventaId(canje.getVentaId())
                .recompensaId(canje.getRecompensa().getId())
                .fechaCanje(canje.getFechaCanje())
                .puntosUsados(canje.getPuntosUsados())
                .estado(canje.getEstado().name())
                .build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{ventaId}")
    public ResponseEntity<List<CanjeDTO>> obtenerCanjesPorVenta(@PathVariable Long ventaId) {
        List<CanjeDTO> canjes = service.obtenerCanjesPorVenta(ventaId).stream()
                .map(c -> CanjeDTO.builder()
                        .ventaId(c.getVentaId())
                        .recompensaId(c.getRecompensa().getId())
                        .fechaCanje(c.getFechaCanje())
                        .puntosUsados(c.getPuntosUsados())
                        .estado(c.getEstado().name())
                        .build())
                .toList();
        if (canjes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(canjes);
    }
}
