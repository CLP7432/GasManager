package com.gasmanager.facturacion.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/facturas/test")
public class TestFacturacionController {

    /**
     * Endpoint de prueba para verificar que el microservicio está funcionando
     * GET /api/facturas/test/ping
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Microservicio de Facturación funcionando correctamente");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint de prueba para simular CFDI
     * GET /api/facturas/test/cfdi/{folio}
     */
    @GetMapping("/cfdi/{folio}")
    public ResponseEntity<Map<String, String>> simularCfdi(@PathVariable String folio) {
        Map<String, String> response = new HashMap<>();
        response.put("folio", folio);
        response.put("uuid", java.util.UUID.randomUUID().toString());
        response.put("url_xml", "/facturas/xml/" + folio + ".xml");
        response.put("url_pdf", "/facturas/pdf/" + folio + ".pdf");
        response.put("mensaje", "CFDI generado exitosamente (simulación)");
        return ResponseEntity.ok(response);
    }
}