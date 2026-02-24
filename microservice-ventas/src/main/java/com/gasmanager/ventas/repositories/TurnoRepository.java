package com.gasmanager.ventas.repositories;

import com.gasmanager.ventas.entities.core.Turno;
import com.gasmanager.ventas.enums.EstadoTurno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {

    // Buscar por código único del turno
    Optional<Turno> findByCodigoTurno(String codigoTurno);

    // Buscar turnos por estado
    List<Turno> findByEstado(EstadoTurno estado);

    // Buscar turnos por supervisor
    List<Turno> findBySupervisorId(Long supervisorId);

    // Buscar turnos por rango de fechas
    List<Turno> findByFechaTurnoBetween(LocalDateTime inicio, LocalDateTime fin);

    // Buscar turnos que NO están en un estado específico
    List<Turno> findByEstadoNot(EstadoTurno estado);

    // Verificar si ya existe un turno en un estado específico para un supervisor
    Boolean existsBySupervisorIdAndEstado(Long supervisorId, EstadoTurno estado);

    // Buscar el último turno de un supervisor
    @Query("SELECT t FROM Turno t WHERE t.supervisorId = :supervisorId " +
            "ORDER BY t.fechaTurno DESC LIMIT 1")
    Optional<Turno> findUltimoTurnoBySupervisor(@Param("supervisorId") Long supervisorId);

    // Buscar turno actual (abierto) para un supervisor
    @Query("SELECT t FROM Turno t WHERE t.supervisorId = :supervisorId " +
            "AND t.estado = 'ABIERTO' " +
            "ORDER BY t.fechaTurno DESC")
    List<Turno> findTurnosAbiertosBySupervisor(@Param("supervisorId") Long supervisorId);

    // Para React: Obtener turnos con paginación (importante para tablas grandes)
    @Query("SELECT t FROM Turno t WHERE t.fechaTurno BETWEEN :inicio AND :fin " +
            "ORDER BY t.fechaTurno DESC")
    List<Turno> findTurnosConFiltros(@Param("inicio") LocalDateTime inicio,
                                     @Param("fin") LocalDateTime fin);

    // Consulta para dashboard: contar turnos por estado
    @Query("SELECT t.estado, COUNT(t) FROM Turno t " +
            "WHERE t.fechaTurno BETWEEN :inicio AND :fin " +
            "GROUP BY t.estado")
    List<Object[]> countTurnosPorEstado(@Param("inicio") LocalDateTime inicio,
                                        @Param("fin") LocalDateTime fin);

    // Encontrar turnos que necesitan cierre (abiertos por más de 8 horas)
    @Query("SELECT t FROM Turno t WHERE t.estado = 'ABIERTO' " +
            "AND t.horaInicio < :horaLimite")
    List<Turno> findTurnosQueNecesitanCierre(@Param("horaLimite") LocalDateTime horaLimite);
}