package com.gasmanager.reportes.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@FeignClient(name = "microservice-ventas")
public interface VentasClient {

    @GetMapping("/api/ventas")
    Map<String, Object> listarVentasPaginadas(@RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "100") int size);

    @GetMapping("/api/ventas/estadisticas")
    Map<String, Object> getEstadisticasVentas();

    @GetMapping("/api/ventas/filtro/fechas")
    List<Map<String, Object>> getVentasByFecha(
            @RequestParam("inicio") LocalDateTime inicio,
            @RequestParam("fin") LocalDateTime fin);

    @GetMapping("/api/ventas/estado/{estado}")
    List<Map<String, Object>> getVentasByEstado(@PathVariable("estado") String estado);
}