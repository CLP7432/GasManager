package com.gasmanager.users.controllers;

import com.gasmanager.users.entities.core.SesionUsuario;
import com.gasmanager.users.services.SesionUsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/sesiones")
@RequiredArgsConstructor
public class SesionController {

    private final SesionUsuarioService sesionService;

    @PostMapping("/iniciar")
    public ResponseEntity<SesionUsuario> iniciarSesion (
            @RequestParam Integer idUsuario,
            @RequestParam String token) {

        return ResponseEntity.ok(sesionService.iniciarSesion(idUsuario,token));
    }
    @PostMapping("/cerrar")
    public ResponseEntity<Void> cerrarSesion (
            @RequestParam String token) {

        sesionService.cerrarSesion(token);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/validar")
    public ResponseEntity<Boolean> validarToken(
            @RequestParam String token){
        return ResponseEntity.ok(sesionService.validarToken(token));
    }

}
