package com.gasmanager.lealtad.repositories;

import com.gasmanager.lealtad.entities.Recompensas;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecompensaRepository extends JpaRepository<Recompensas, Long> {
    List<Recompensas> findByActivoTrue();
}
