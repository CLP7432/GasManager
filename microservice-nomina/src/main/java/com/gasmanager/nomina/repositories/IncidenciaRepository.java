package com.gasmanager.nomina.repositories;

import com.gasmanager.nomina.entities.Incidencia;
import com.gasmanager.nomina.enums.TipoIncidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncidenciaRepository extends JpaRepository<Incidencia, Long> {

    List<Incidencia> findByEmpleadoId(Long empleadoId);

    List<Incidencia> findByEmpleadoIdAndFechaBetween(Long empleadoId, LocalDate inicio, LocalDate fin);

    List<Incidencia> findByTipoAndFechaBetween(TipoIncidencia tipo, LocalDate inicio, LocalDate fin);

    @Query("SELECT i.empleado.id, SUM(i.cantidad) FROM Incidencia i " +
            "WHERE i.tipo = :tipo AND i.fecha BETWEEN :inicio AND :fin " +
            "GROUP BY i.empleado.id")
    List<Object[]> sumIncidenciasPorEmpleado(@Param("tipo") TipoIncidencia tipo,
                                             @Param("inicio") LocalDate inicio,
                                             @Param("fin") LocalDate fin);
}