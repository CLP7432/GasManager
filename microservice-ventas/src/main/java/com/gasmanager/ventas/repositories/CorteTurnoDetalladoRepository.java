package com.gasmanager.ventas.repositories;

import com.gasmanager.ventas.entities.core.CorteTurnoDetallado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CorteTurnoDetalladoRepository extends JpaRepository<CorteTurnoDetallado, Long> {
    List<CorteTurnoDetallado> findByTurnoId(Long turnoId);
}