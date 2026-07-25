package com.gasmanager.ventas.repositories;

import com.gasmanager.ventas.entities.core.CaraDispensario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CaraDispensarioRepository extends JpaRepository<CaraDispensario, Long> {
    List<CaraDispensario> findByDispensarioId(Long dispensarioId);
}