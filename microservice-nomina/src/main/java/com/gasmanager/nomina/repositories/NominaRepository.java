package com.gasmanager.nomina.repositories;

import com.gasmanager.nomina.entities.Nomina;
import com.gasmanager.nomina.enums.EstadoNomina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NominaRepository extends JpaRepository<Nomina, Long> {

    Optional<Nomina> findByFolioNomina(String folioNomina);

    List<Nomina> findByPeriodoInicioBetween(LocalDate inicio, LocalDate fin);

    List<Nomina> findByEstado(EstadoNomina estado);

    List<Nomina> findByFechaPagoBetween(LocalDate inicio, LocalDate fin);

    boolean existsByPeriodoInicioAndPeriodoFin(LocalDate inicio, LocalDate fin);
}