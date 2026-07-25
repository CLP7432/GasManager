package com.gasmanager.ventas.services;

import com.gasmanager.ventas.entities.core.Turno;
import com.gasmanager.ventas.enums.EstadoTurno;
import com.gasmanager.ventas.repositories.TurnoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class TurnoService {

    private final TurnoRepository turnoRepository;

    public Turno crearTurno(Turno turno) {
        // Validar código único
        if (turno.getCodigoTurno() != null && turnoRepository.findByCodigoTurno(turno.getCodigoTurno()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un turno con el código: " + turno.getCodigoTurno());
        }

        // Generar código automático si no viene
        if (turno.getCodigoTurno() == null || turno.getCodigoTurno().isEmpty()) {
            String codigo = generarCodigoTurno();
            turno.setCodigoTurno(codigo);
        }

        // Establecer valores por defecto
        if (turno.getEstado() == null) {
            turno.setEstado(EstadoTurno.ABIERTO);
        }
        if (turno.getFechaTurno() == null) {
            turno.setFechaTurno(LocalDateTime.now());
        }
        if (turno.getHoraInicio() == null) {
            turno.setHoraInicio(LocalTime.now());
        }
        if (turno.getNumeroVentas() == null) {
            turno.setNumeroVentas(0);
        }
        if (turno.getNumeroClientes() == null) {
            turno.setNumeroClientes(0);
        }

        return turnoRepository.save(turno);
    }

    public Optional<Turno> obtenerTurno(Long id) {
        return turnoRepository.findById(id);
    }

    public Optional<Turno> obtenerPorCodigo(String codigoTurno) {
        return turnoRepository.findByCodigoTurno(codigoTurno);
    }

    public List<Turno> listarTodos() {
        return turnoRepository.findAll();
    }

    public List<Turno> listarPorEstado(EstadoTurno estado) {
        return turnoRepository.findByEstado(estado);
    }

    public List<Turno> listarPorSupervisor(Long supervisorId) {
        return turnoRepository.findBySupervisorId(supervisorId);
    }

    public List<Turno> listarPorFechas(LocalDateTime inicio, LocalDateTime fin) {
        return turnoRepository.findByFechaTurnoBetween(inicio, fin);
    }

    public Turno actualizarTurno(Long id, Turno turnoActualizado) {
        Turno turnoExistente = turnoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Turno no encontrado"));

        if (turnoActualizado.getNombre() != null) {
            turnoExistente.setNombre(turnoActualizado.getNombre());
        }
        if (turnoActualizado.getEstado() != null) {
            turnoExistente.setEstado(turnoActualizado.getEstado());
        }
        if (turnoActualizado.getObservaciones() != null) {
            turnoExistente.setObservaciones(turnoActualizado.getObservaciones());
        }
        if (turnoActualizado.getHoraFin() != null) {
            turnoExistente.setHoraFin(turnoActualizado.getHoraFin());
        }

        return turnoRepository.save(turnoExistente);
    }

    public boolean cerrarTurno(Long id) {
        Optional<Turno> turnoOpt = turnoRepository.findById(id);
        if (turnoOpt.isEmpty()) {
            return false;
        }

        Turno turno = turnoOpt.get();
        if (turno.getEstado() == EstadoTurno.ABIERTO) {
            turno.setEstado(EstadoTurno.CERRADO);
            turno.setHoraFin(LocalTime.now());
            turnoRepository.save(turno);
            return true;
        }
        return false;
    }

    public boolean existeTurnoActivoParaSupervisor(Long supervisorId) {
        return turnoRepository.existsBySupervisorIdAndEstado(supervisorId, EstadoTurno.ABIERTO);
    }

    public Optional<Turno> obtenerTurnoActivoDeSupervisor(Long supervisorId) {
        List<Turno> turnos = turnoRepository.findTurnosAbiertosBySupervisor(supervisorId);
        return turnos.isEmpty() ? Optional.empty() : Optional.of(turnos.get(0));
    }

    private String generarCodigoTurno() {
        LocalDateTime ahora = LocalDateTime.now();
        String fecha = String.format("%04d%02d%02d",
                ahora.getYear(), ahora.getMonthValue(), ahora.getDayOfMonth());
        long secuencial = turnoRepository.count() + 1;
        return String.format("TURNO-%s-%04d", fecha, secuencial);
    }
}