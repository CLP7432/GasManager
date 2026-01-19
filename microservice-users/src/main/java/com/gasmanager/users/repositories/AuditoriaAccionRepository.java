package com.gasmanager.users.repositories;

import com.gasmanager.users.entities.core.AuditoriaAccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaAccionRepository extends JpaRepository<AuditoriaAccion,Integer> {

    List<AuditoriaAccion> findByIdUsuarioEjecutor(Integer idUsuario);
    List<AuditoriaAccion> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);

}
