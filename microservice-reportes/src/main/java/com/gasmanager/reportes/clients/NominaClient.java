package com.gasmanager.reportes.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@FeignClient(name = "microservice-nomina")
public interface NominaClient {

    @GetMapping("/api/empleados")
    List<Map<String, Object>> listarEmpleados();

    @GetMapping("/api/empleados/activos")
    List<Map<String, Object>> getEmpleadosActivos();

    @GetMapping("/api/nominas")
    List<Map<String, Object>> listarNominas();
}