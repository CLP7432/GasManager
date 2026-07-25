package com.gasmanager.nomina.repositories;

import com.gasmanager.nomina.entities.NominaDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NominaDetalleRepository extends JpaRepository<NominaDetalle, Long> {

    List<NominaDetalle> findByNominaId(Long nominaId);

    List<NominaDetalle> findByEmpleadoId(Long empleadoId);

    List<NominaDetalle> findByNominaIdAndEmpleadoId(Long nominaId, Long empleadoId);
}