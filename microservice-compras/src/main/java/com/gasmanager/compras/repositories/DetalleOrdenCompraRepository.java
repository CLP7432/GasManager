package com.gasmanager.compras.repositories;

import com.gasmanager.compras.entities.DetalleOrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleOrdenCompraRepository extends JpaRepository<DetalleOrdenCompra, Long> {

    List<DetalleOrdenCompra> findByOrdenCompraId(Long ordenCompraId);
}