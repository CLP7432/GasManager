package com.gasmanager.users.services;

import com.gasmanager.users.entities.core.AuditoriaAccion;
import com.gasmanager.users.entities.security.TipoAcccion;
import com.gasmanager.users.repositories.AuditoriaAccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditoriaService {

    private final AuditoriaAccionRepository auditoriaRepository;

    public List<AuditoriaAccion> listarTodas() {
        return auditoriaRepository.findAllByOrderByFechaHoraDesc();
    }

    public List<AuditoriaAccion> listarPorUsuario(Integer idUsuario) {
        return auditoriaRepository.findByIdUsuarioEjecutor(idUsuario);
    }

    public List<AuditoriaAccion> listarPorRango(LocalDateTime inicio, LocalDateTime fin) {
        return auditoriaRepository.findByFechaHoraBetween(inicio, fin);
    }

    public void registrarAuditoria(Integer idUsuarioEjecutor, TipoAcccion tipo, String descripcion,
                                   String modulo, String origen, String datosAnteriores, String datosNuevos) {
        AuditoriaAccion auditoria = new AuditoriaAccion();
        auditoria.setIdUsuarioEjecutor(idUsuarioEjecutor);
        auditoria.setTipoAcccion(tipo);
        auditoria.setDescripcion(descripcion);
        auditoria.setModuloAfectado(modulo);
        auditoria.setOrigen(origen);
        auditoria.setDatosAnteriores(datosAnteriores);
        auditoria.setDatosNuevos(datosNuevos);
        auditoria.setFechaHora(LocalDateTime.now());
        auditoriaRepository.save(auditoria);
    }
}