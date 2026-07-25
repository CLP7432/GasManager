package com.gasmanager.reportes.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@FeignClient(name = "microservice-inventarios")
public interface InventariosClient {

    @GetMapping("/api/inventario-combustible")
    List<Map<String, Object>> getInventarioCombustible();

    @GetMapping("/api/aceites")
    List<Map<String, Object>> getAceites();

    @GetMapping("/api/combustibles")
    List<Map<String, Object>> getCombustibles();
}