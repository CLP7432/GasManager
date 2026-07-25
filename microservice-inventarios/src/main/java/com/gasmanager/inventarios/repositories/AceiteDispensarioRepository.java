package com.gasmanager.inventarios.repositories;

import com.gasmanager.inventarios.entities.AceiteDispensario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AceiteDispensarioRepository extends JpaRepository<AceiteDispensario, Long> {

    Optional<AceiteDispensario> findByDispensarioIdAndAceiteId(Long dispensarioId, Long aceiteId);

    List<AceiteDispensario> findByDispensarioId(Long dispensarioId);

    List<AceiteDispensario> findByDispensarioIdAndActivoTrue(Long dispensarioId);

    @Query("SELECT a FROM AceiteDispensario a WHERE a.stockActual <= a.stockMinimo AND a.activo = true")
    List<AceiteDispensario> findStockBajo();

    @Query("SELECT a FROM AceiteDispensario a WHERE a.stockActual <= (a.stockMinimo / 2) AND a.activo = true")
    List<AceiteDispensario> findStockCritico();

    @Query("SELECT a FROM AceiteDispensario a WHERE a.dispensarioId = :dispensarioId AND a.stockActual <= a.stockMinimo AND a.activo = true")
    List<AceiteDispensario> findStockBajoByDispensario(Long dispensarioId);

    boolean existsByDispensarioIdAndAceiteId(Long dispensarioId, Long aceiteId);

    // ===== NUEVO: OBTENER IDs DE DISPENSARIOS CON STOCK =====
    @Query("SELECT DISTINCT a.dispensarioId FROM AceiteDispensario a")
    List<Long> findDistinctDispensarioIds();
}