//package com.gasmanager.ventas.services;
//
//import com.gasmanager.ventas.entities.core.CorteTurno;
//import com.gasmanager.ventas.entities.core.Turno;
//import com.gasmanager.ventas.enums.EstadoCorteEnum;
//import com.gasmanager.ventas.repositories.CorteTurnoRepository;
//import com.gasmanager.ventas.repositories.TurnoRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@Transactional
//@RequiredArgsConstructor
//public class CorteTurnoService {
//
//    private final CorteTurnoRepository corteTurnoRepository;
//    private final TurnoRepository turnoRepository;
//
//    /**
//     * Crear un nuevo corte de turno
//     */
//    public CorteTurno crearCorteTurno(CorteTurno corteTurno) {
//        if (corteTurno.getCodigoCorte() != null &&
//                corteTurnoRepository.findByCodigoCorte(corteTurno.getCodigoCorte()).isPresent()) {
//            throw new IllegalArgumentException("Ya existe un corte con el código: " + corteTurno.getCodigoCorte());
//        }
//
//        if (corteTurno.getCodigoCorte() == null || corteTurno.getCodigoCorte().isEmpty()) {
//            String codigo = generarCodigoCorte();
//            corteTurno.setCodigoCorte(codigo);
//        }
//
//        if (corteTurno.getEstado() == null) {
//            corteTurno.setEstado(EstadoCorteEnum.PENDIENTE);
//        }
//        if (corteTurno.getFechaCorte() == null) {
//            corteTurno.setFechaCorte(LocalDateTime.now());
//        }
//
//        return corteTurnoRepository.save(corteTurno);
//    }
//
//    public Optional<CorteTurno> obtenerCorte(Long id) {
//        return corteTurnoRepository.findById(id);
//    }
//
//    public List<CorteTurno> listarPorTurno(Long turnoId) {
//        return corteTurnoRepository.findByTurnoId(turnoId);
//    }
//
//    public List<CorteTurno> listarPorEstado(EstadoCorteEnum estado) {
//        return corteTurnoRepository.findByEstado(estado);
//    }
//
//    public CorteTurno validarCorte(Long id, Long supervisorId, String supervisorNombre) {
//        CorteTurno corte = corteTurnoRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Corte no encontrado"));
//
//        if (corte.getEstado() != EstadoCorteEnum.PENDIENTE) {
//            throw new IllegalStateException("Solo se pueden validar cortes en estado PENDIENTE");
//        }
//
//        if (corte.getTotalEfectivoReporte() != null && corte.getTotalEfectivoReal() != null) {
//            corte.setDiferenciaEfectivo(corte.getTotalEfectivoReal().subtract(corte.getTotalEfectivoReporte()));
//        }
//
//        if (corte.getInventarioInicialGasolina() != null && corte.getInventarioFinalGasolina() != null) {
//            corte.setVentasGasolina(corte.getInventarioInicialGasolina().subtract(corte.getInventarioFinalGasolina()));
//        }
//
//        corte.setEstado(EstadoCorteEnum.VALIDADO);
//        corte.setValidadoPor(supervisorId);
//        corte.setValidadoNombre(supervisorNombre);
//        corte.setFechaValidacion(LocalDateTime.now());
//
//        return corteTurnoRepository.save(corte);
//    }
//
//    public CorteTurno cerrarCorte(Long id) {
//        CorteTurno corte = corteTurnoRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Corte no encontrado"));
//
//        if (corte.getEstado() != EstadoCorteEnum.VALIDADO) {
//            throw new IllegalStateException("Solo se pueden cerrar cortes validados");
//        }
//
//        corte.setEstado(EstadoCorteEnum.CERRADO);
//        return corteTurnoRepository.save(corte);
//    }
//
//    public CorteTurno generarCorteDesdeTurno(Long turnoId) {
//        // Validar que no exista un corte para este turno
//        if (existeCortePorTurno(turnoId)) {
//            throw new IllegalStateException("Ya existe un corte generado para el turno " + turnoId);
//        }
//
//        Turno turno = turnoRepository.findById(turnoId)
//                .orElseThrow(() -> new IllegalArgumentException("Turno no encontrado"));
//
//        CorteTurno corte = CorteTurno.builder()
//                .nombre("Corte de " + turno.getNombre())
//                .turno(turno)
//                .turnoCodigo(turno.getCodigoTurno())
//                .fechaCorte(LocalDateTime.now())
//                .totalVentas(turno.getTotalVentas())
//                .totalEfectivoReporte(turno.getTotalEfectivo())
//                .totalTarjeta(turno.getTotalTarjeta())
//                .totalTransferencia(turno.getTotalTransferencia())
//                .totalCredito(turno.getTotalCredito())
//                .numeroVentas(turno.getNumeroVentas())
//                .build();
//
//        return crearCorteTurno(corte);
//    }
//
//    private String generarCodigoCorte() {
//        LocalDateTime ahora = LocalDateTime.now();
//        String fecha = String.format("%04d%02d%02d",
//                ahora.getYear(), ahora.getMonthValue(), ahora.getDayOfMonth());
//        long secuencial = corteTurnoRepository.count() + 1;
//        return String.format("CORTE-%s-%04d", fecha, secuencial);
//    }
//
//    public boolean existeCortePorTurno(Long turnoId) {
//        return !corteTurnoRepository.findByTurnoId(turnoId).isEmpty();
//    }
//}