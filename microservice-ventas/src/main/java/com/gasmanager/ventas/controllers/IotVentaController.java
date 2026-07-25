package com.gasmanager.ventas.controllers;

import com.gasmanager.ventas.dto.IotVentaRequest;
import com.gasmanager.ventas.services.IotVentaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ventas/iot")
@RequiredArgsConstructor
@Slf4j
public class IotVentaController {

    private final IotVentaService iotVentaService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> realizarCarga(@RequestBody IotVentaRequest request) {
        log.info("=== CARGA IoT RECIBIDA EN VENTAS ===");
        log.info("Dispensario: {} ({})", request.getDispensarioId(), request.getDispensarioNombre());
        log.info("Manguera: {} ({})", request.getMangueraId(), request.getMangueraNombre());
        log.info("Despachador: {} ({})", request.getDespachadorId(), request.getDespachadorNombre());
        log.info("Litros: {}, Total: {}", request.getLitros(), request.getTotal());
        return ResponseEntity.ok(iotVentaService.procesarCarga(request));
    }
}