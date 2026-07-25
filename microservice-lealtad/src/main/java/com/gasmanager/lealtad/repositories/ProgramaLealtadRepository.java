package com.gasmanager.lealtad.repositories;

import com.gasmanager.lealtad.entities.ProgramaLealtad;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProgramaLealtadRepository extends JpaRepository<ProgramaLealtad, Long> {
    Optional<ProgramaLealtad> findByActivoTrue();
}
