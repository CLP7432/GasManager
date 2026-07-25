package com.gasmanager.inventarios.repositories;

import com.gasmanager.inventarios.entities.AceiteBodega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AceiteBodegaRepository extends JpaRepository<AceiteBodega, Long> {

    Optional<AceiteBodega> findByAceiteId(Long aceiteId);

    Optional<AceiteBodega> findByCodigo(String codigo);

    List<AceiteBodega> findByActivoTrue();

    @Query("SELECT a FROM AceiteBodega a WHERE a.stockActual <= a.stockMinimo AND a.activo = true")
    List<AceiteBodega> findStockBajo();

    @Query("SELECT a FROM AceiteBodega a WHERE a.stockActual <= (a.stockMinimo / 2) AND a.activo = true")
    List<AceiteBodega> findStockCritico();

    boolean existsByAceiteId(Long aceiteId);
}