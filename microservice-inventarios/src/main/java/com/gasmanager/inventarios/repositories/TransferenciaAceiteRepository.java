package com.gasmanager.inventarios.repositories;

import com.gasmanager.inventarios.entities.TransferenciaAceite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransferenciaAceiteRepository extends JpaRepository<TransferenciaAceite, Long> {

    Optional<TransferenciaAceite> findByFolio(String folio);

    List<TransferenciaAceite> findByAceiteId(Long aceiteId);

    List<TransferenciaAceite> findByDispensarioDestinoId(Long dispensarioId);

    List<TransferenciaAceite> findByDispensarioOrigenId(Long dispensarioId);

    List<TransferenciaAceite> findByFechaMovimientoBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT t FROM TransferenciaAceite t WHERE t.dispensarioDestinoId = :dispensarioId ORDER BY t.fechaMovimiento DESC")
    List<TransferenciaAceite> findUltimasTransferenciasByDispensario(Long dispensarioId);

    @Query("SELECT t FROM TransferenciaAceite t WHERE t.tipo = 'TRANSFERENCIA' AND t.dispensarioDestinoId = :dispensarioId ORDER BY t.fechaMovimiento DESC")
    List<TransferenciaAceite> findTransferenciasByDispensario(Long dispensarioId);

    boolean existsByFolio(String folio);
}