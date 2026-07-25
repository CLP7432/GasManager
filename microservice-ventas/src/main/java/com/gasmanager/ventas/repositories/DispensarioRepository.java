package com.gasmanager.ventas.repositories;

import com.gasmanager.ventas.entities.core.Dispensario;
import com.gasmanager.ventas.enums.EstadoDispensarioEnum;
import com.gasmanager.ventas.enums.TipoCombustibleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DispensarioRepository extends JpaRepository<Dispensario, Long> {

    Optional<Dispensario> findByNumero(String numero);

    List<Dispensario> findByEstado(EstadoDispensarioEnum estado);

    List<Dispensario> findByTipoCombustible(TipoCombustibleEnum tipoCombustible);

    List<Dispensario> findByActivoTrue();
}