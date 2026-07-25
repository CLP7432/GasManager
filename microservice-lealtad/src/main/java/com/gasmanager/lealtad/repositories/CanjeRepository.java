package com.gasmanager.lealtad.repositories;

import com.gasmanager.lealtad.entities.CanjeRecompensa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CanjeRepository extends JpaRepository<CanjeRecompensa, Long> {
    List<CanjeRecompensa> findByVentaId(Long ventaId);
}
