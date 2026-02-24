package com.gasmanager.users.controllers;

import com.gasmanager.users.services.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("api/password-reset")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    //1. Se solicita el restablecimiento
    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitarReset(
            @RequestBody Map<String, String> request) {

        String correo = request.get("correo");
        String baseUrl = request.get("baseUrl") != null ?
                request.get("baseUrl") : "http://localhost:5173";

        if(correo == null || correo.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Correo es requerido");
        }
        boolean enviado = passwordResetService.solicitarResetPassword(correo, baseUrl);
        
        //Po seguridad, siempre devolver exito aunque el correo no exista
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Si el correo existe, recibiras instrucciones en unos minutos");
        response.put("enviando", true);

        return ResponseEntity.ok(response);
    }
    //2. Validar el token
    @GetMapping("validar/{token}")
    public ResponseEntity<?> validarToken(@PathVariable String token){

        boolean valido = passwordResetService.validarToken(token);

        Map<String, Object> response = new HashMap<>();
        response.put("valido", valido);
        response.put("mensaje", valido ?
                "Token valido": "Token invalido o expirado");
        return ResponseEntity.ok(response);
    }

    //3. Restablecer contraseña
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String nuevaPassword = request.get("nuevaPassword");
        String confirmPassword = request.get("confirmPassword");

        if(token == null || nuevaPassword == null || confirmPassword == null) {
            return ResponseEntity.badRequest().body("Todos los campos son requeridos");
        }
        if(!nuevaPassword.equals(confirmPassword))  {
            return ResponseEntity.badRequest().body("Las contraseñas no coinciden");
        }
       if(nuevaPassword.length() < 6) {
           return ResponseEntity.badRequest()
                   .body("La contraseña debe teener al menos 6 caracteres");
       }
       boolean exitoso = passwordResetService.resetPassword(token, nuevaPassword);

       if(exitoso){
           Map<String, Object> response = new HashMap<>();
           response.put("mensaje", "Contraseña restablecida exitosamente");
           response.put("exitoso", true);
           return ResponseEntity.ok(response);
       }else{
           return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                   .body("Token invalido, expirado o ya usado");
       }
    }

}
