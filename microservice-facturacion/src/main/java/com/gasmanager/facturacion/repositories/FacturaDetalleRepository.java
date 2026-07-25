package com.gasmanager.facturacion.repositories;

import com.gasmanager.facturacion.entities.FacturaDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaDetalleRepository extends JpaRepository<FacturaDetalle, Long> {

    List<FacturaDetalle> findByFacturaId(Long facturaId);

    Optional<FacturaDetalle> findByVentaId(Long ventaId);

    List<FacturaDetalle> findByVentaIdIn(List<Long> ventasIds);

    boolean existsByVentaId(Long ventaId);
}