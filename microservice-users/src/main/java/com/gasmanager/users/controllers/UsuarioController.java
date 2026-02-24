package com.gasmanager.users.controllers;

import com.gasmanager.users.dto.LoginRequest;
import com.gasmanager.users.dto.LoginResponse;
import com.gasmanager.users.entities.core.Usuario;
import com.gasmanager.users.security.JwtTokenProvider;
import com.gasmanager.users.services.SesionUsuarioService;
import com.gasmanager.users.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtTokenProvider jwtTokenProvider;
    private final SesionUsuarioService sesionUsuarioService;

    // ========== ENDPOINTS DE AUTENTICACIÓN ==========

    @PostMapping("/login")
    public ResponseEntity<?> autenticar(@RequestBody LoginRequest login) {
        try {
            return usuarioService.autenticar(login.getCorreo(), login.getPassword())
                    .map(u -> {
                        if (u.getRol() == null) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                    .body(Map.of(
                                            "error", "Usuario no configurado",
                                            "mensaje", "El usuario no tiene rol asignado. Contacte al administrador",
                                            "correo", u.getCorreo(),
                                            "idUsuario", u.getIdUsuario()
                                    ));
                        }

                        String token = jwtTokenProvider.generateToken(
                                u.getIdUsuario(),
                                u.getCorreo(),
                                u.getRol().getNombreRol()
                        );

                        sesionUsuarioService.iniciarSesion(u.getIdUsuario(), token);

                        return ResponseEntity.ok(
                                new LoginResponse(
                                        token,
                                        u.getRol().getNombreRol(),
                                        u.getIdUsuario(),
                                        u.getCorreo())
                        );
                    }).orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of(
                                    "error", "Credenciales inválidas",
                                    "mensaje", "Correo o contraseña incorrectos"
                            )));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Error interno",
                            "mensaje", "Ocurrió un error inesperado: " + e.getMessage()
                    ));
        }
    }

    // ========== ENDPOINTS CRUD ==========

    // 1. Crear usuario
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.crearUsuario(usuario));
    }

    // 2. Listar todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    // 3. Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Integer id) {
        return usuarioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(
            @PathVariable Integer id,
            @RequestBody Usuario usuarioActualizado) {
        try {
            return ResponseEntity.ok(usuarioService.actualizarUsuario(id, usuarioActualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Desactivar usuario (eliminación lógica)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarUsuario(@PathVariable Integer id) {
        if (usuarioService.desactivarUsuario(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // 6. Listar usuarios activos
    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> listarActivos() {
        return ResponseEntity.ok(usuarioService.listarActivos());
    }

    // 7. Listar usuarios bloqueados
    @GetMapping("/bloqueados")
    public ResponseEntity<List<Usuario>> listarBloqueados() {
        return ResponseEntity.ok(usuarioService.listarUsuariosBloqueados());
    }

    // ========== ENDPOINTS DE SEGURIDAD ==========

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String nuevaPassword = request.get("nuevaPassword");

        if (nuevaPassword == null || nuevaPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "La contraseña debe tener al menos 6 caracteres"));
        }

        if (usuarioService.desbloquearYResetearPassword(id, nuevaPassword)) {
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña restablecida exitosamente"));
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{correo}/requiere-reset")
    public ResponseEntity<Boolean> requiereResetPassword(@PathVariable String correo) {
        return ResponseEntity.ok(usuarioService.requiereResetPassword(correo));
    }
}