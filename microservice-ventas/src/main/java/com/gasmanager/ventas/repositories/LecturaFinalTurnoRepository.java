package com.gasmanager.ventas.repositories;

import com.gasmanager.ventas.entities.core.LecturaFinalTurno;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LecturaFinalTurnoRepository extends JpaRepository<LecturaFinalTurno, Long> {
    List<LecturaFinalTurno> findByTurnoId(Long turnoId);
}