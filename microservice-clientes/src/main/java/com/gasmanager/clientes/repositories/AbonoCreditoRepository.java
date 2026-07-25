package com.gasmanager.clientes.repositories;

import com.gasmanager.clientes.entities.AbonoCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AbonoCreditoRepository extends JpaRepository<AbonoCredito, Long> {

    Optional<AbonoCredito> findByFolioAbono(String folioAbono);

    List<AbonoCredito> findByCreditoId(Long creditoId);

    List<AbonoCredito> findByFechaAbonoBetween(LocalDate inicio, LocalDate fin);

    List<AbonoCredito> findByCreditoIdOrderByFechaAbonoDesc(Long creditoId);
}