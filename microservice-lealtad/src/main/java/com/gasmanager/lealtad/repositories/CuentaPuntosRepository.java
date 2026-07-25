package com.gasmanager.lealtad.repositories;

import com.gasmanager.lealtad.entities.CuentaPuntos;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CuentaPuntosRepository extends JpaRepository<CuentaPuntos, Long> {
    Optional<CuentaPuntos> findByVentaId(Long ventaId);
}
