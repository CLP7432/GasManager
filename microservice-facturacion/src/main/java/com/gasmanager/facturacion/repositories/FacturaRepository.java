package com.gasmanager.facturacion.repositories;

import com.gasmanager.facturacion.entities.Factura;
import com.gasmanager.facturacion.enums.EstadoFactura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {

    Optional<Factura> findByFolioFactura(String folioFactura);

    Optional<Factura> findByUuidCfdi(String uuidCfdi);

    List<Factura> findByClienteRfc(String clienteRfc);

    List<Factura> findByClienteId(Long clienteId);

    List<Factura> findByEstado(EstadoFactura estado);

    List<Factura> findByFechaEmisionBetween(LocalDateTime inicio, LocalDateTime fin);

    boolean existsByFolioFactura(String folioFactura);
}