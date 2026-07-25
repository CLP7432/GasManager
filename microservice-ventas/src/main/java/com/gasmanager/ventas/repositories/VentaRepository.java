package com.gasmanager.ventas.repositories;

import com.gasmanager.ventas.entities.core.Venta;
import com.gasmanager.ventas.enums.EstadoVenta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    Optional<Venta> findByFolio(String folio);

    List<Venta> findByEstado(EstadoVenta estado);

    //  CORREGIDO - Usando la relación turno.id
    @Query("SELECT v FROM Venta v WHERE v.turno.id = :turnoId")
    List<Venta> findByTurnoId(@Param("turnoId") Long turnoId);

    List<Venta> findByDespachadorId(Long despachadorId);

    List<Venta> findByClienteId(Long clienteId);

    List<Venta> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Venta> findBySurtidorId(Integer dispensarioId);

    List<Venta> findByFacturada(Boolean facturada);

    List<Venta> findByEsCredito(Boolean esCredito);

    Page<Venta> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin, Pageable pageable);

    Long countByEstado(EstadoVenta estado);

    @Query(value = "SELECT DATE(v.fecha_hora) as fecha, SUM(v.total) as total " +
            "FROM ventas v " +
            "WHERE v.fecha_hora BETWEEN :inicio AND :fin " +
            "GROUP BY DATE(v.fecha_hora) " +
            "ORDER BY fecha", nativeQuery = true)
    List<Object[]> findVentasTotalesPorDia(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT v.metodoPago, COUNT(v), SUM(v.total) " +
            "FROM Venta v " +
            "WHERE v.fechaHora BETWEEN :inicio AND :fin " +
            "GROUP BY v.metodoPago")
    List<Object[]> findVentasPorMetodoPago(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
}