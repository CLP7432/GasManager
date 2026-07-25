package com.gasmanager.inventarios.repositories;

import com.gasmanager.inventarios.entities.InventarioCombustible;
import com.gasmanager.inventarios.enums.TipoCombustible;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioCombustibleRepository extends JpaRepository<InventarioCombustible, Long> {

    Optional<InventarioCombustible> findByTipoCombustible(TipoCombustible tipoCombustible);

    List<InventarioCombustible> findByActivoTrue();

    @Query("SELECT i FROM InventarioCombustible i WHERE i.stockActual <= i.stockMinimo AND i.stockMinimo IS NOT NULL")
    List<InventarioCombustible> findByStockActualLessThanStockMinimo();

    List<InventarioCombustible> findByStockActualLessThan(BigDecimal cantidad);
}