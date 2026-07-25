package com.gasmanager.nomina.repositories;

import com.gasmanager.nomina.entities.Puesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PuestoRepository extends JpaRepository<Puesto, Long> {

    Optional<Puesto> findByNombre(String nombre);

    List<Puesto> findByActivoTrue();

    boolean existsByNombre(String nombre);
}