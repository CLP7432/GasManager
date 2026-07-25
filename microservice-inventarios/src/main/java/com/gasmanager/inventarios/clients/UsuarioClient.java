package com.gasmanager.inventarios.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "msvc-users", url = "http://localhost:8081")
public interface UsuarioClient {

    @GetMapping("/api/usuarios/validar-token")
    Boolean validarToken(@RequestParam("Authorization") String token);
}
