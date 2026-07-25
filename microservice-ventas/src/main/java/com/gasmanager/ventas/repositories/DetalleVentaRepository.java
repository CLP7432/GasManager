package com.gasmanager.ventas.repositories;

import com.gasmanager.ventas.entities.core.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
}