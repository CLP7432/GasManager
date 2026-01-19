package com.gasmanager.users.repositories;

import com.gasmanager.users.entities.core.SesionUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SesionUsuarioRepository extends JpaRepository<SesionUsuario,Integer> {

    Optional<SesionUsuario> findByToken(String token);
    List<SesionUsuario> findByIdUsuario(Integer idUsuario);
    List<SesionUsuario> findByActivoTrue();

}
