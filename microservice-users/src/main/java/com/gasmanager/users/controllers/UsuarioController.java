package com.gasmanager.users.controllers;

import com.gasmanager.users.dto.LoginRequest;
import com.gasmanager.users.dto.LoginResponse;
import com.gasmanager.users.entities.core.Usuario;
import com.gasmanager.users.security.JwtTokenProvider;
import com.gasmanager.users.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.crearUsuario(usuario));
    }
    /*@PostMapping("/login")
    public ResponseEntity<Usuario> autenticar(
            @RequestBody LoginRequest login) {

        return usuarioService.autenticar(login.getCorreo(), login.getPassword())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }*/

    @PostMapping("/login")
    public ResponseEntity<?> autenticar (@RequestBody LoginRequest login) {
        return usuarioService.autenticar(login.getCorreo(), login.getPassword())
                .map(u -> {
                    String token = jwtTokenProvider.generateToken(
                            u.getIdUsuario(),
                            u.getCorreo(),
                            u.getRol().getNombreRol()
                    );
                    return ResponseEntity.ok(
                            new LoginResponse(
                                    token,
                                    u.getRol().getNombreRol(),
                                    u.getIdUsuario(),
                                    u.getCorreo())
                    );
                }).orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }


    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> listarActivos() {
        return ResponseEntity.ok(usuarioService.listarActivos());
    }

    @GetMapping("/bloqueados")
    public ResponseEntity<List<Usuario>> listarBloqueados() {
        return ResponseEntity.ok(usuarioService.listarUsuariosBloqueados());
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos(){
        return ResponseEntity.ok(usuarioService.listarTodos());
    }





}
