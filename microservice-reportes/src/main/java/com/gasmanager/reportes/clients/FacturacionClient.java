package com.gasmanager.reportes.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@FeignClient(name = "microservice-facturacion")
public interface FacturacionClient {

    @GetMapping("/api/facturas")
    List<Map<String, Object>> listarFacturas();

    @GetMapping("/api/facturas/cliente/{clienteId}")
    List<Map<String, Object>> getFacturasByCliente(@PathVariable("clienteId") Long clienteId);

    @GetMapping("/api/facturas/rfc/{rfc}")
    List<Map<String, Object>> getFacturasByRfc(@PathVariable("rfc") String rfc);
}