package com.gasmanager.lealtad.repositories;

import com.gasmanager.lealtad.entities.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
    List<Transaccion> findByVentaId(Long ventaId);
}
