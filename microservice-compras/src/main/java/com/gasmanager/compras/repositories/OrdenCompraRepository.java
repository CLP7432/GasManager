package com.gasmanager.compras.repositories;

import com.gasmanager.compras.entities.OrdenCompra;
import com.gasmanager.compras.enums.EstadoOrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {

    Optional<OrdenCompra> findByFolioOrden(String folioOrden);

    List<OrdenCompra> findByProveedorId(Long proveedorId);

    List<OrdenCompra> findByEstado(EstadoOrdenCompra estado);

    List<OrdenCompra> findByFechaOrdenBetween(LocalDate inicio, LocalDate fin);

    List<OrdenCompra> findByEstadoAndFechaOrdenBefore(EstadoOrdenCompra estado, LocalDate fecha);
}