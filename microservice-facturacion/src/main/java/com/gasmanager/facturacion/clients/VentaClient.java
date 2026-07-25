package com.gasmanager.facturacion.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "msvc-ventas")
public interface VentaClient {

    @GetMapping("/api/ventas/{id}")
    Map<String, Object> obtenerVenta(@PathVariable("id") Long id);

    @GetMapping("/api/ventas/turno/{turnoId}")
    List<Map<String, Object>> listarVentasPorTurno(@PathVariable("turnoId") Long turnoId);

    @GetMapping("/api/ventas/{id}/puede-facturar")
    Boolean puedeFacturar(@PathVariable("id") Long id);

    @PatchMapping("/api/ventas/{id}/marcar-facturada")
    void marcarComoFacturada(@PathVariable("id") Long id, @RequestParam("folioFactura") String folioFactura);
}