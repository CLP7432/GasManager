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

    Optional<Turno> findByCodigoTurno(String codigoTurno);

    List<Turno> findByEstado(EstadoTurno estado);

    List<Turno> findBySupervisorId(Long supervisorId);

    List<Turno> findByFechaTurnoBetween(LocalDateTime inicio, LocalDateTime fin);

    boolean existsBySupervisorIdAndEstado(Long supervisorId, EstadoTurno estado);

    @Query(value = "SELECT * FROM turnos t WHERE t.supervisor_id = :supervisorId AND t.estado = 'CERRADO' ORDER BY t.fecha_turno DESC LIMIT 1", nativeQuery = true)
    Optional<Turno> findUltimoTurnoBySupervisor(@Param("supervisorId") Long supervisorId);

    @Query("SELECT t FROM Turno t WHERE t.supervisorId = :supervisorId AND t.estado = 'ABIERTO' ORDER BY t.fechaTurno DESC")
    List<Turno> findTurnosAbiertosBySupervisor(@Param("supervisorId") Long supervisorId);
}