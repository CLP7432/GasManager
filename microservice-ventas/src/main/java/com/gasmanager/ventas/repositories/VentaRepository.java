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
public interface VentaRepository extends JpaRepository<Venta,Long> {

    //Buscar por Folio
    Optional<Venta> findByFolio(String folio);

    //Buscar ventas por estado
    List<Venta> findByEstado(EstadoVenta estadoVenta);

    //Buscar Ventas por turno
    List<Venta> findByTurnoId(Long turnoId);

    //Buscar ventas por despachador
    List<Venta> findByDespachadorId(Long despachadorId);

    //Buscar ventas por cliente
    List<Venta> findByClienteId(Long clienteId);

    //Buscar ventas por rango de fechas
    List<Venta> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);

    //Buscar ventas por dispensario
    List<Venta> findBySurtidorId(Integer dispensarioId);

    //Buscar ventas facturadas o no facturadas
    List<Venta> findByFacturada(Boolean facturada);

    //Buscar ventas a credito
    List<Venta> findByEsCredito(Boolean esCredito);

    //Consulta con paginacion para reportes
    Page<Venta> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin, Pageable pageable);

    //Consulta personalizada para totales por dia
    @Query(value = "SELECT DATE(v.fecha_hora) as fecha, SUM(v.total) as total " +
            "FROM ventas v " +
            "WHERE v.fecha_hora BETWEEN :inicio AND :fin " +
            "GROUP BY DATE(v.fecha_hora) " +
            "ORDER BY fecha",
            nativeQuery = true)
    List<Object[]> findVentasTotalesPorDia(@Param("inicio") LocalDateTime inicio,
                                           @Param("fin") LocalDateTime fin);

    // Consulta para ventas por método de pago
    @Query("SELECT v.metodoPago, COUNT(v), SUM(v.total) " +
            "FROM Venta v " +
            "WHERE v.fechaHora BETWEEN :inicio AND :fin " +
            "GROUP BY v.metodoPago")
    List<Object[]> findVentasPorMetodoPago(@Param("inicio") LocalDateTime inicio,
                                           @Param("fin") LocalDateTime fin);

    //Contar ventas por estado
    Long countByEstado(EstadoVenta estado);
}












