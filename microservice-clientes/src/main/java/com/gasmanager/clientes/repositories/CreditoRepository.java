package com.gasmanager.clientes.repositories;

import com.gasmanager.clientes.entities.Credito;
import com.gasmanager.clientes.enums.EstadoCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CreditoRepository extends JpaRepository<Credito, Long> {

    Optional<Credito> findByFolioCredito(String folioCredito);

    List<Credito> findByClienteId(Long clienteId);

    List<Credito> findByEstado(EstadoCredito estado);

    List<Credito> findByClienteIdAndEstado(Long clienteId, EstadoCredito estado);

    List<Credito> findByFechaVencimientoBeforeAndEstado(LocalDate fecha, EstadoCredito estado);

    @Query("SELECT c FROM Credito c WHERE c.saldoPendiente > 0 AND c.estado = 'ACTIVO'")
    List<Credito> findCreditosActivosConSaldo();

//    @Query(value = "SELECT * FROM creditos WHERE fecha_vencimiento < CURDATE() AND estado = 'ACTIVO'", nativeQuery = true)
//    List<Credito> findCreditosVencidos();

    @Modifying
    @Transactional
    @Query(value = "UPDATE creditos SET estado = 'VENCIDO' WHERE fecha_vencimiento < CURDATE() AND estado = 'ACTIVO'", nativeQuery = true)
    int updateVencidosToVencido();
}