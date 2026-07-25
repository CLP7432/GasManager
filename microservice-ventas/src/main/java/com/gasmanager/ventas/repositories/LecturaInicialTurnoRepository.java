package com.gasmanager.ventas.repositories;

import com.gasmanager.ventas.entities.core.LecturaInicialTurno;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LecturaInicialTurnoRepository extends JpaRepository<LecturaInicialTurno, Long> {
    List<LecturaInicialTurno> findByTurnoId(Long turnoId);
}