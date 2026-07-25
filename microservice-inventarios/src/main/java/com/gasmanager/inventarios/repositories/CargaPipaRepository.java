package com.gasmanager.inventarios.repositories;

import com.gasmanager.inventarios.entities.CargaPipa;
import com.gasmanager.inventarios.enums.TipoCombustible;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CargaPipaRepository extends JpaRepository<CargaPipa, Long> {

    Optional<CargaPipa> findByFolio(String folio);

    List<CargaPipa> findByTipoCombustible(TipoCombustible tipoCombustible);

    List<CargaPipa> findByFechaCargaBetween(LocalDateTime inicio, LocalDateTime fin);

    List<CargaPipa> findByProveedor(String proveedor);

    boolean existsByFolio(String folio);
}