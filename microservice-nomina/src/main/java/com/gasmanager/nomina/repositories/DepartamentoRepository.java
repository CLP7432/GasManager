package com.gasmanager.nomina.repositories;

import com.gasmanager.nomina.entities.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {

    Optional<Departamento> findByNombre(String nombre);

    List<Departamento> findByActivoTrue();

    boolean existsByNombre(String nombre);
}