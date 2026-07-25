package com.gasmanager.facturacion.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "msvc-clientes")
public interface ClienteClient {

    @GetMapping("/api/clientes/{id}")
    Map<String, Object> obtenerCliente(@PathVariable("id") Long id);

    @GetMapping("/api/clientes/rfc/{rfc}")
    Map<String, Object> obtenerClientePorRFC(@PathVariable("rfc") String rfc);
}