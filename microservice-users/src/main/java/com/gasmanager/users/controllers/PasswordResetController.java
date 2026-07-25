package com.gasmanager.users.controllers;

import com.gasmanager.users.services.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("api/password-reset")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitarReset(@RequestBody Map<String, String> request){
        String correo = request.get("correo");
        String baseUrl = request.get("baseUrl") != null ? request.get("baseUrl") : "http://localhost:5173";

        if(correo == null || correo.trim().isEmpty()){
            return ResponseEntity.badRequest().body("Correo es requerido");
        }

        passwordResetService.solicitarResetPassword(correo, baseUrl);
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Si el correo existe, recibiras instrucciones en unos minutos");
        response.put("enviando", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validar/{token}")
    public ResponseEntity<?> validarToken(@PathVariable String token){
        boolean valido = passwordResetService.validarToken(token);
        Map<String, Object> response = new HashMap<>();
        response.put("valido", valido);
        response.put("mensaje", valido ? "Token válido" : "Token inválido o expirado");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request){
        String token = request.get("token");
        String nuevaPassword = request.get("nuevaPassword");
        String confimPassword = request.get("confimPassword");

        if(token == null || nuevaPassword == null || confimPassword == null){
            return ResponseEntity.badRequest().body("Todos los campos son requeridos");
        }
        if(!nuevaPassword.equals(confimPassword)){
            return ResponseEntity.badRequest().body("Las contraseñas no coinciden");
        }
        if(nuevaPassword.length() < 6){
            return ResponseEntity.badRequest().body("La contraseña debe tener al menos 6  caracteres");
        }
        boolean exitoso = passwordResetService.resetPassword(token, nuevaPassword);

        if(exitoso){
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Contraseña restablecida exitosamente");
            response.put("exitoso", true);
            return ResponseEntity.ok(response);
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token invalido, expirado o ya usado");
        }
    }

}
















