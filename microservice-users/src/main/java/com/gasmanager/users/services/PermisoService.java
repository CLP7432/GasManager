package com.gasmanager.users.services;

import com.gasmanager.users.entities.core.AuditoriaAccion;
import com.gasmanager.users.entities.security.Permiso;
import com.gasmanager.users.entities.security.TipoAcccion;
import com.gasmanager.users.repositories.AuditoriaAccionRepository;
import com.gasmanager.users.repositories.PermisoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PermisoService {

    private final PermisoRepository permisoRepository;
    private final AuditoriaAccionRepository auditoriaRepository;

    // Crea un permiso nuevo
    public Permiso crearPermiso(Permiso permiso) {
        if (permisoRepository.existsByCodigoPermiso(permiso.getCodigoPermiso())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El permiso ya existe");
        }
        Permiso nuevo = permisoRepository.save(permiso);

        registrarAuditoria(
                null,
                TipoAcccion.CREAR,
                "Permiso creado: " + permiso.getCodigoPermiso(),
                "Permisos",
                "Sistema",
                null,
                "{\"codigoPermiso\":\"" + permiso.getCodigoPermiso() +
                        "\",\"nombrePermiso\":\"" + (permiso.getNombrePermiso() != null ? permiso.getNombrePermiso() : "") +
                        "\",\"descripcion\":\"" + (permiso.getDescripcion() != null ? permiso.getDescripcion() : "") + "\"}"
        );

        return nuevo;
    }

    // Listar todos los permisos
    public List<Permiso> listarPermisos() {
        return permisoRepository.findAll();
    }

    // Buscar permiso por codigo
    public Permiso buscarPorCodigo(String codigoPermiso) {
        return permisoRepository.findByCodigoPermiso(codigoPermiso)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Permiso no encontrado"));
    }

    // Eliminar permiso
    public boolean eliminarPermiso(Integer idPermiso) {
        if (permisoRepository.existsById(idPermiso)) {
            Optional<Permiso> permisoOpt = permisoRepository.findById(idPermiso);
            if (permisoOpt.isPresent()) {
                Permiso permiso = permisoOpt.get();
                String datos = "{\"codigoPermiso\":\"" + permiso.getCodigoPermiso() +
                        "\",\"nombrePermiso\":\"" + (permiso.getNombrePermiso() != null ? permiso.getNombrePermiso() : "") +
                        "\",\"descripcion\":\"" + (permiso.getDescripcion() != null ? permiso.getDescripcion() : "") + "\"}";

                permisoRepository.deleteById(idPermiso);

                registrarAuditoria(
                        null,
                        TipoAcccion.ELIMINAR,
                        "Permiso eliminado: " + permiso.getCodigoPermiso(),
                        "Permisos",
                        "Sistema",
                        datos,
                        null
                );
            } else {
                permisoRepository.deleteById(idPermiso);
            }
            return true;
        }
        return false;
    }

    public Optional<Permiso> obtenerPorId(Integer id) {
        return permisoRepository.findById(id);
    }

    public Permiso actualizarPermiso(Integer id, Permiso permisoActualizado) {
        Permiso permisoExistente = permisoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Permiso no encontrado"));

        String datosAnteriores = "{\"nombrePermiso\":\"" + (permisoExistente.getNombrePermiso() != null ? permisoExistente.getNombrePermiso() : "") +
                "\",\"descripcion\":\"" + (permisoExistente.getDescripcion() != null ? permisoExistente.getDescripcion() : "") +
                "\",\"activo\":" + permisoExistente.isActivo() + "}";

        if (permisoActualizado.getNombrePermiso() != null) {
            permisoExistente.setNombrePermiso(permisoActualizado.getNombrePermiso());
        }
        if (permisoActualizado.getDescripcion() != null) {
            permisoExistente.setDescripcion(permisoActualizado.getDescripcion());
        }
        permisoExistente.setActivo(permisoActualizado.isActivo());

        Permiso guardado = permisoRepository.save(permisoExistente);

        String datosNuevos = "{\"nombrePermiso\":\"" + (guardado.getNombrePermiso() != null ? guardado.getNombrePermiso() : "") +
                "\",\"descripcion\":\"" + (guardado.getDescripcion() != null ? guardado.getDescripcion() : "") +
                "\",\"activo\":" + guardado.isActivo() + "}";

        registrarAuditoria(
                null,
                TipoAcccion.ACTUALIZAR,
                "Permiso actualizado: " + permisoExistente.getCodigoPermiso(),
                "Permisos",
                "Sistema",
                datosAnteriores,
                datosNuevos
        );

        return guardado;
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