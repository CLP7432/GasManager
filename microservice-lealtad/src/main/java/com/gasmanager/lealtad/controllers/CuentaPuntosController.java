package com.gasmanager.lealtad.controllers;

import com.gasmanager.lealtad.dto.CuentaPuntosDTO;
import com.gasmanager.lealtad.repositories.CuentaPuntosRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cuentas-puntos")
public class CuentaPuntosController {

    private final CuentaPuntosRepository repo;

    public CuentaPuntosController(CuentaPuntosRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{ventaId}")
    public ResponseEntity<CuentaPuntosDTO> obtenerCuentaPorVenta(@PathVariable Long ventaId) {
        return repo.findByVentaId(ventaId)
                .map(cuenta -> CuentaPuntosDTO.builder()
                        .ventaId(cuenta.getVentaId())
                        .saldoPuntos(cuenta.getSaldoPuntos())
                        .build())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
