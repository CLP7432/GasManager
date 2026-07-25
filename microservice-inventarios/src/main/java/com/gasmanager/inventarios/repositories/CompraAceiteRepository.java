package com.gasmanager.inventarios.repositories;

import com.gasmanager.inventarios.entities.CompraAceite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompraAceiteRepository extends JpaRepository<CompraAceite, Long> {

    Optional<CompraAceite> findByFolio(String folio);

    List<CompraAceite> findByAceiteIdOrderByFechaCompraDesc(Long aceiteId);

    List<CompraAceite> findByProveedor(String proveedor);

    List<CompraAceite> findByFechaCompraBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT c FROM CompraAceite c ORDER BY c.fechaCompra DESC")
    List<CompraAceite> findTop10ByOrderByFechaCompraDesc();

    boolean existsByFolio(String folio);
}