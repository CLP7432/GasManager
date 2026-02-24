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
    private final BCryptPasswordEncoder passwordEncoder;

    // ========== MÉTODOS CRUD ==========

    // 1. Crear
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
        registrarAuditoriaCompleta(
                nuevo.getIdUsuario(),
                TipoAccion.CREAR,
                "Usuario creado exitosamente",
                "Usuarios",
                "Sistema",
                null,
                "{\"nombre\":\"" + usuario.getNombre() +
                        "\",\"correo\":\"" + usuario.getCorreo() +
                        "\",\"rol\":\"" + (usuario.getRol() != null ? usuario.getRol().getNombreRol() : "Sin asignar") + "\"}"
        );
        return nuevo;
    }

    // 2. Leer por ID
    public Optional<Usuario> obtenerPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    // 3. Leer todos
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // 4. Leer activos
    public List<Usuario> listarActivos() {
        return usuarioRepository.findByActivoTrue();
    }

    // 5. Leer bloqueados
    public List<Usuario> listarUsuariosBloqueados() {
        return usuarioRepository.findByBloqueadoTrue();
    }

    // 6. Actualizar
    public Usuario actualizarUsuario(Integer id, Usuario usuarioActualizado) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        String datosAnteriores = String.format(
                "{\"nombre\":\"%s\",\"rol\":\"%s\",\"estado\":\"%s\",\"activo\":%s}",
                usuarioExistente.getNombre(),
                usuarioExistente.getRol() != null ? usuarioExistente.getRol().getNombreRol() : "null",
                usuarioExistente.getEstado(),
                usuarioExistente.isActivo()
        );

        if (usuarioActualizado.getNombre() != null) {
            usuarioExistente.setNombre(usuarioActualizado.getNombre());
        }
        if (usuarioActualizado.getRol() != null) {
            usuarioExistente.setRol(usuarioActualizado.getRol());
        }
        if (usuarioActualizado.getEstado() != null) {
            usuarioExistente.setEstado(usuarioActualizado.getEstado());

            // ⭐⭐ NUEVO: Si estado es ACTIVO, también activar usuario ⭐⭐
            if (usuarioActualizado.getEstado() == EstadoUsuario.ACTIVO) {
                usuarioExistente.setActivo(true);
            }
            // Opcional: Si estado es INACTIVO o BLOQUEADO, desactivar
            if (usuarioActualizado.getEstado() == EstadoUsuario.INACTIVO ||
                    usuarioActualizado.getEstado() == EstadoUsuario.BLOQUEADO) {
                usuarioExistente.setActivo(false);
            }
        }

        Usuario guardado = usuarioRepository.save(usuarioExistente);

        registrarAuditoriaCompleta(
                usuarioExistente.getIdUsuario(),
                TipoAccion.ACTUALIZAR,
                "Usuario actualizado",
                "Usuarios",
                "Sistema",
                datosAnteriores,
                String.format(
                        "{\"nombre\":\"%s\",\"rol\":\"%s\",\"estado\":\"%s\",\"activo\":%s}",
                        guardado.getNombre(),
                        guardado.getRol() != null ? guardado.getRol().getNombreRol() : "null",
                        guardado.getEstado(),
                        guardado.isActivo()
                )
        );

        return guardado;
    }

    // 7. Eliminar (lógico)
    public boolean desactivarUsuario(Integer id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            return false;
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setActivo(false);
        usuario.setEstado(EstadoUsuario.INACTIVO);
        usuarioRepository.save(usuario);

        registrarAuditoriaCompleta(
                usuario.getIdUsuario(),
                TipoAccion.ELIMINAR,
                "Usuario desactivado",
                "Usuarios",
                "Sistema",
                "{\"activo\":true}",
                "{\"activo\":false,\"estado\":\"INACTIVO\"}"
        );

        return true;
    }

    // ========== MÉTODOS DE AUTENTICACIÓN ==========

    public Optional<Usuario> autenticar(String correo, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            registrarAuditoriaCompleta(
                    usuario.getIdUsuario(),
                    TipoAccion.VALIDAR,
                    "Intento de acceso al sistema",
                    "Login",
                    "Web",
                    null,
                    "{\"correo\":\"" + correo + "\",\"hora\":\"" + LocalDateTime.now() + "\"}"
            );

            if (usuario.isBloqueado()) {
                registrarAuditoriaCompleta(
                        usuario.getIdUsuario(),
                        TipoAccion.VALIDAR,
                        "Intento de login con usuario bloqueado",
                        "Login",
                        "Web",
                        null,
                        "{\"estado\":\"BLOQUEADO\",\"motivo\":\"Intentos fallidos excedidos\"}"
                );
                return Optional.empty();
            }

            if (passwordEncoder.matches(password, usuario.getPassword())) {
                // LOGIN EXITOSO
                usuario.setIntentosFallidos(0);
                usuario.setUltimoAcceso(LocalDateTime.now());
                usuarioRepository.save(usuario);

                registrarAuditoriaCompleta(
                        usuario.getIdUsuario(),
                        TipoAccion.VALIDAR,
                        "Login exitoso - Acceso concedido",
                        "Login",
                        "WEB",
                        "{\"intentosFallidos\":" + usuario.getIntentosFallidos() + "}",
                        "{\"ultimoAcceso\":\"" + LocalDateTime.now() +
                                "\",\"rol\":\"" + (usuario.getRol() != null ? usuario.getRol().getNombreRol() : "Sin rol") +
                                "\",\"intentosReseteados\":true}"
                );
                return Optional.of(usuario);
            } else {
                // LOGIN FALLIDO
                usuario.setIntentosFallidos(usuario.getIntentosFallidos() + 1);
                String descripcion = "Login fallido _ Intento #" + usuario.getIntentosFallidos();

                if (usuario.getIntentosFallidos() >= 3) {
                    usuario.setBloqueado(true);
                    usuario.setEstado(EstadoUsuario.BLOQUEADO);
                    descripcion = "USUARIO BLOQUEADO - 3 intentos fallidos - Requiere restablecimiento de contraseña";
                    registrarAuditoriaCompleta(
                            usuario.getIdUsuario(),
                            TipoAccion.VALIDAR,
                            descripcion,
                            "Login",
                            "WEB",
                            "{\"intentosFallidos\":2,\"bloqueado\":false}",
                            "{\"intentosFallidos\":3,\"bloqueado\":true,\"estado\":\"BLOQUEADO\",\"requiereResetPassword\":true}"
                    );
                } else {
                    registrarAuditoriaCompleta(
                            usuario.getIdUsuario(),
                            TipoAccion.VALIDAR,
                            descripcion,
                            "Login",
                            "WEB",
                            "{\"intentosFallidos\":" + (usuario.getIntentosFallidos() - 1) + "}",
                            "{\"intentosFallidos\":" + usuario.getIntentosFallidos() + "}"
                    );
                }
                usuarioRepository.save(usuario);
            }
        } else {
            registrarAuditoriaCompleta(
                    null,
                    TipoAccion.VALIDAR,
                    "Intento de login con usuario inexistente: " + correo,
                    "Login",
                    "WEB",
                    null,
                    "{\"correoIntentado\":\"" + correo + "\",\"resultado\":\"NO_ENCONTRADO\"}"
            );
        }
        return Optional.empty();
    }

    // ========== MÉTODOS DE SEGURIDAD ==========

    public boolean desbloquearYResetearPassword(Integer idUsuario, String nuevaPassword) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);

        if (usuarioOpt.isEmpty()) {
            return false;
        }

        Usuario usuario = usuarioOpt.get();

        String datosAnteriores = String.format(
                "{\"bloqueado\":%s,\"intentosFallidos\":%d,\"passwordHash\":\"%s\"}",
                usuario.isBloqueado(),
                usuario.getIntentosFallidos(),
                usuario.getPassword().substring(0, Math.min(20, usuario.getPassword().length())) + "..."
        );

        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuario.setBloqueado(false);
        usuario.setIntentosFallidos(0);
        usuario.setEstado(EstadoUsuario.ACTIVO);
        usuarioRepository.save(usuario);

        registrarAuditoriaCompleta(
                usuario.getIdUsuario(),
                TipoAccion.ACTUALIZAR,
                "Usuario desbloqueado y contraseña restablecida",
                "Seguridad",
                "SISTEMA",
                datosAnteriores,
                "{\"bloqueado\":false,\"intentosFallidos\":0,\"estado\":\"ACTIVO\"}"
        );

        return true;
    }

    public boolean requiereResetPassword(String correo) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
        return usuarioOpt.map(usuario -> usuario.isBloqueado() && usuario.getIntentosFallidos() >= 3)
                .orElse(false);
    }

    // ========== MÉTODOS DE AUDITORÍA ==========

    private void registrarAuditoriaCompleta(
            Integer idUsuarioEjecutor,
            TipoAccion accion,
            String descripcion,
            String moduloAfectado,
            String origen,
            String datosAnteriores,
            String datosNuevos) {

        AuditoriaAccion auditoria = new AuditoriaAccion();
        auditoria.setIdUsuarioEjecutor(idUsuarioEjecutor);
        auditoria.setTipoAccion(accion);
        auditoria.setDescripcion(descripcion);
        auditoria.setModuloAfectado(moduloAfectado);
        auditoria.setOrigen(origen);
        auditoria.setDatosAnteriores(datosAnteriores);
        auditoria.setDatosNuevos(datosNuevos);
        auditoria.setFechaHora(LocalDateTime.now());

        auditoriaRepository.save(auditoria);
    }

    private void registrarAuditoria(Integer idUsuario, TipoAccion accion, String descripcion) {
        registrarAuditoriaCompleta(idUsuario, accion, descripcion, null, null, null, null);
    }
}