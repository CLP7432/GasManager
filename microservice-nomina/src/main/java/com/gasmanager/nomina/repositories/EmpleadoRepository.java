package com.gasmanager.nomina.repositories;

import com.gasmanager.nomina.entities.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    Optional<Empleado> findByCodigoEmpleado(String codigoEmpleado);
    Optional<Empleado> findByRfc(String rfc);
    Optional<Empleado> findByNss(String nss);

    List<Empleado> findByActivoTrue();
    List<Empleado> findByActivoTrueAndDepartamentoId(Long departamentoId);
    List<Empleado> findByActivoTrueAndPuestoId(Long puestoId);
    List<Empleado> findByFechaIngresoBetween(LocalDate inicio, LocalDate fin);

    boolean existsByRfc(String rfc);
    boolean existsByNss(String nss);

    @Query("SELECT e FROM Empleado e WHERE e.activo = true AND (e.fechaBaja IS NULL OR e.fechaBaja > CURRENT_DATE)")
    List<Empleado> findEmpleadosActivos();

    // =====  MÉTODOS PARA DESPACHADORES Y SUPERVISORES =====
    // Buscar empleados cuyo puesto sea "Despachador" (ignorando mayúsculas/minúsculas)
    @Query("SELECT e FROM Empleado e WHERE e.activo = true AND LOWER(e.puesto.nombre) LIKE '%despachador%'")
    List<Empleado> findDespachadores();

    // Buscar empleados cuyo puesto sea "Supervisor" (ignorando mayúsculas/minúsculas)
    @Query("SELECT e FROM Empleado e WHERE e.activo = true AND LOWER(e.puesto.nombre) LIKE '%supervisor%'")
    List<Empleado> findSupervisores();

    // Buscar empleados por rol (usando el campo rol en el DTO, pero en la entidad no existe)
    // Alternativa: usar el nombre del puesto
    @Query("SELECT e FROM Empleado e WHERE e.activo = true AND LOWER(e.puesto.nombre) LIKE %:rol%")
    List<Empleado> findEmpleadosByRol(@Param("rol") String rol);
}