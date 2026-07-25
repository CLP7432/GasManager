package com.gasmanager.users.controllers;

import com.gasmanager.users.dto.LoginRequest;
import com.gasmanager.users.dto.LoginResponse;
import com.gasmanager.users.entities.core.Usuario;
import com.gasmanager.users.security.JwtTokenProvider;
import com.gasmanager.users.services.SesionUsuarioService;
import com.gasmanager.users.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtTokenProvider jwtTokenProvider;
    private final SesionUsuarioService sesionUsuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> autenticar(@RequestBody LoginRequest login) {
        try {
            return usuarioService.autenticar(login.getCorreo(), login.getPassword())
                    .map(u -> {
                        if (u.getRol() == null) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                    .body(Map.of("error", "Usuario no configurado", "mensaje",
                                            "El usuario no tiene un rol asignado"));
                        }
                        String token = jwtTokenProvider.generateToken(
                                u.getIdUsuario(),
                                u.getCorreo(),
                                u.getRol().getNombreRol());

                        sesionUsuarioService.iniciarSesion(u.getIdUsuario(), token);
                        return ResponseEntity.ok(new LoginResponse(
                                token,
                                u.getRol().getNombreRol(),
                                u.getIdUsuario(),
                                u.getCorreo()));

                    }).orElse(
                            ResponseEntity
                                    .status(HttpStatus.UNAUTHORIZED)
                                    .body(Map.of("error", "Credenciales invalidas")));
        } catch (Exception e) {
            log.error("Error en login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error interno"));
        }
    }

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.crearUsuario(usuario));
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Integer id) {
        return usuarioService.obtenerPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioActualizado) {
        try {
            return ResponseEntity.ok(usuarioService.actualizarUsuario(id, usuarioActualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarUsuario(@PathVariable Integer id) {
        return usuarioService.desactivarUsuario(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> listarActivos() {
        return ResponseEntity.ok(usuarioService.listarActivos());
    }

    @GetMapping("/bloqueados")
    public ResponseEntity<List<Usuario>> listarBloqueados() {
        return ResponseEntity.ok(usuarioService.listarUsuariosBloqueados());
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String nuevaPassword = request.get("nuevaPassword");
        if (nuevaPassword == null || nuevaPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña debe tener al menos 6 caracteres"));
        }
        return usuarioService.desbloquearYResetearPassword(id, nuevaPassword)
                ? ResponseEntity.ok(Map.of("mensaje", "Contraseña restablecida exitosamente"))
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/{correo}/requiere-reset")
    public ResponseEntity<Boolean> requiereResetPassword(@PathVariable String correo) {
        return ResponseEntity.ok(usuarioService.requiereResetPassword(correo));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend funcionando");
    }

    @GetMapping("/publico")
    public ResponseEntity<String> publico() {
        return ResponseEntity.ok("Endpoint publico funcionando");
    }

    @GetMapping("/validar-token")
    public ResponseEntity<Boolean> validarToken(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(false);
        }
        String token = authHeader.substring(7);
        try {
            jwtTokenProvider.validate(token);
            return ResponseEntity.ok(true);
        }catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }


}