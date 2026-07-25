package com.gasmanager.users.services;

import com.gasmanager.users.entities.core.AuditoriaAccion;
import com.gasmanager.users.entities.security.Permiso;
import com.gasmanager.users.entities.security.Rol;
import com.gasmanager.users.entities.security.TipoAcccion;
import com.gasmanager.users.repositories.AuditoriaAccionRepository;
import com.gasmanager.users.repositories.PermisoRepository;
import com.gasmanager.users.repositories.RolRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RolService {

    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;
    private final AuditoriaAccionRepository auditoriaRepository;

    // Crea un Rol
    public Rol crearRol(Rol rol) {
        Optional<Rol> existe = rolRepository.findByNombreRol(rol.getNombreRol());
        if (existe.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Rol Ya existe");
        }
        Rol nuevo = rolRepository.save(rol);

        registrarAuditoria(
                null,
                TipoAcccion.CREAR,
                "Rol creado: " + rol.getNombreRol(),
                "Roles",
                "Sistema",
                null,
                "{\"nombreRol\":\"" + rol.getNombreRol() + "\",\"descripcion\":\"" + (rol.getDescripcion() != null ? rol.getDescripcion() : "") + "\"}"
        );

        return nuevo;
    }

    // Listar todos los roles
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    // Listar roles activos
    public List<Rol> listarRolesActivos() {
        return rolRepository.findAll().stream()
                .filter(Rol::isActivo)
                .toList();
    }

    // Asignar Permiso a un Rol
    public Rol asignarPermiso(Integer idRol, @NonNull Permiso permiso) {
        Rol rol = rolRepository.findById(idRol)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));

        Permiso permisoDB = permisoRepository.findById(permiso.getIdPermiso())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permiso no encontrado"));

        if (rol.getPermisos().contains(permisoDB)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El permiso ya esta asignado a este rol");
        }
        rol.getPermisos().add(permisoDB);
        Rol guardado = rolRepository.save(rol);

        registrarAuditoria(
                null,
                TipoAcccion.ACTUALIZAR,
                "Permiso asignado a rol: " + rol.getNombreRol(),
                "Roles",
                "Sistema",
                null,
                "{\"permiso\":\"" + permisoDB.getCodigoPermiso() + "\"}"
        );

        return guardado;
    }

    // Remover permiso de un rol
    public Rol removerPermiso(Integer idRol, Permiso permiso) {
        Rol rol = rolRepository.findById(idRol)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));

        Permiso permisoDB = permisoRepository.findById(permiso.getIdPermiso())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permiso no encontrado"));

        if (!rol.getPermisos().contains(permisoDB)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El permiso no esta asignado a este rol");
        }
        rol.getPermisos().remove(permisoDB);
        Rol guardado = rolRepository.save(rol);

        registrarAuditoria(
                null,
                TipoAcccion.ACTUALIZAR,
                "Permiso removido de rol: " + rol.getNombreRol(),
                "Roles",
                "Sistema",
                "{\"permiso\":\"" + permisoDB.getCodigoPermiso() + "\"}",
                null
        );

        return guardado;
    }

    public Optional<Rol> obtenerPorId(Integer id) {
        return rolRepository.findById(id);
    }

    public Rol actualizarRol(Integer id, Rol rolActualizado) {
        Rol rolExistente = rolRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado"));

        String datosAnteriores = "{\"nombreRol\":\"" + rolExistente.getNombreRol() +
                "\",\"descripcion\":\"" + (rolExistente.getDescripcion() != null ? rolExistente.getDescripcion() : "") + "\"}";

        if (rolActualizado.getNombreRol() != null) {
            rolExistente.setNombreRol(rolActualizado.getNombreRol());
        }
        if (rolActualizado.getDescripcion() != null) {
            rolExistente.setDescripcion(rolActualizado.getDescripcion());
        }
        if (rolActualizado.getPermisos() != null) {
            rolExistente.setPermisos(rolActualizado.getPermisos());
        }

        Rol guardado = rolRepository.save(rolExistente);

        String datosNuevos = "{\"nombreRol\":\"" + guardado.getNombreRol() +
                "\",\"descripcion\":\"" + (guardado.getDescripcion() != null ? guardado.getDescripcion() : "") + "\"}";

        registrarAuditoria(
                null,
                TipoAcccion.ACTUALIZAR,
                "Rol actualizado: " + rolExistente.getNombreRol(),
                "Roles",
                "Sistema",
                datosAnteriores,
                datosNuevos
        );

        return guardado;
    }

    public boolean eliminarRol(Integer id) {
        if (rolRepository.existsById(id)) {
            Optional<Rol> rolOpt = rolRepository.findById(id);
            if (rolOpt.isPresent()) {
                Rol rol = rolOpt.get();
                String datos = "{\"nombreRol\":\"" + rol.getNombreRol() +
                        "\",\"descripcion\":\"" + (rol.getDescripcion() != null ? rol.getDescripcion() : "") + "\"}";

                rolRepository.deleteById(id);

                registrarAuditoria(
                        null,
                        TipoAcccion.ELIMINAR,
                        "Rol eliminado: " + rol.getNombreRol(),
                        "Roles",
                        "Sistema",
                        datos,
                        null
                );
            } else {
                rolRepository.deleteById(id);
            }
            return true;
        }
        return false;
    }

    private void registrarAuditoria(
            Integer idUsuarioEjecutor,
            TipoAcccion accion,
            String descripcion,
            String modulo,
            String origen,
            String datosAnteriores,
            String datosNuevos) {

        AuditoriaAccion auditoria = new AuditoriaAccion();
        auditoria.setIdUsuarioEjecutor(idUsuarioEjecutor);
        auditoria.setTipoAcccion(accion);
        auditoria.setDescripcion(descripcion);
        auditoria.setModuloAfectado(modulo);
        auditoria.setOrigen(origen);
        auditoria.setDatosAnteriores(datosAnteriores);
        auditoria.setDatosNuevos(datosNuevos);
        auditoria.setFechaHora(LocalDateTime.now());

        auditoriaRepository.save(auditoria);
    }
}