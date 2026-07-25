package com.gasmanager.reportes.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@FeignClient(name = "microservice-clientes")
public interface ClientesClient {

    @GetMapping("/api/clientes")
    List<Map<String, Object>> listarClientes();

    @GetMapping("/api/clientes/activos")
    List<Map<String, Object>> getClientesActivos();

    @GetMapping("/api/creditos")
    List<Map<String, Object>> listarCreditos();

    @GetMapping("/api/creditos/estado/{estado}")
    List<Map<String, Object>> getCreditosByEstado(@PathVariable("estado") String estado);
}