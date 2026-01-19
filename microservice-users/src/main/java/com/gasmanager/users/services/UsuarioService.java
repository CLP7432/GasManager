package com.gasmanager.users.services;

import com.gasmanager.users.entities.core.AuditoriaAccion;
import com.gasmanager.users.entities.core.EstadoUsuario;
import com.gasmanager.users.entities.core.Usuario;
import com.gasmanager.users.entities.security.TipoAccion;
import com.gasmanager.users.repositories.AuditoriaAccionRepository;
import com.gasmanager.users.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final AuditoriaAccionRepository auditoriaRepository;
    private final BCryptPasswordEncoder passwordEncoder; // inyectado como bean

    public Usuario crearUsuario(Usuario usuario) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setEstado(EstadoUsuario.ACTIVO);
        usuario.setIntentosFallidos(0);
        usuario.setBloqueado(false);
        usuario.setActivo(true);
        usuario.setFechaCreacion(LocalDateTime.now());

        Usuario nuevo = usuarioRepository.save(usuario);
        registrarAuditoria(nuevo.getIdUsuario(), TipoAccion.CREAR, "Usuario creado");
        return nuevo;
    }


    public Optional<Usuario> autenticar(String correo, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.isBloqueado()) return Optional.empty();

            if (passwordEncoder.matches(password, usuario.getPassword())) {
                usuario.setIntentosFallidos(0);
                usuario.setUltimoAcceso(LocalDateTime.now());
                usuarioRepository.save(usuario);
                registrarAuditoria(usuario.getIdUsuario(), TipoAccion.VALIDAR, "Inicio de sesión exitoso.");
                return Optional.of(usuario);
            } else {
                usuario.setIntentosFallidos(usuario.getIntentosFallidos() + 1);
                if (usuario.getIntentosFallidos() >= 3) {
                    usuario.setBloqueado(true);
                    usuario.setEstado(EstadoUsuario.BLOQUEADO);
                    registrarAuditoria(usuario.getIdUsuario(), TipoAccion.VALIDAR, "Cuenta bloqueada por intentos fallidos");
                }
                usuarioRepository.save(usuario);
            }
        }
        return Optional.empty();
    }

    private void registrarAuditoria(Integer idUsuario, TipoAccion accion, String descripcion) {
        AuditoriaAccion auditoria = new AuditoriaAccion();
        auditoria.setIdUsuarioEjecutor(idUsuario);
        auditoria.setTipoAccion(accion);
        auditoria.setDescripcion(descripcion);
        auditoria.setFechaHora(LocalDateTime.now());
        auditoriaRepository.save(auditoria);
    }

    public List<Usuario> listarActivos() {
        return usuarioRepository.findByActivoTrue();
    }

    public List<Usuario> listarUsuariosBloqueados() {
        return usuarioRepository.findByBloqueadoTrue(); //
    }
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
}
