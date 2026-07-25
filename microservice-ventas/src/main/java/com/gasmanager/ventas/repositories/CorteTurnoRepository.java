//package com.gasmanager.ventas.repositories;
//
//import com.gasmanager.ventas.entities.core.CorteTurno;
//import com.gasmanager.ventas.enums.EstadoCorteEnum;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface CorteTurnoRepository extends JpaRepository<CorteTurno, Long> {
//
//    Optional<CorteTurno> findByCodigoCorte(String codigoCorte);
//
//    List<CorteTurno> findByTurnoId(Long turnoId);
//
//    List<CorteTurno> findByEstado(EstadoCorteEnum estado);
//
//    List<CorteTurno> findByFechaCorteBetween(LocalDateTime inicio, LocalDateTime fin);
//
//    List<CorteTurno> findByValidadoPor(Long validadoPor);
//}