package com.gasmanager.ventas.repositories;

import com.gasmanager.ventas.entities.core.Manguera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MangueraRepository extends JpaRepository<Manguera, Long> {

    List<Manguera> findByActivoTrue();

    List<Manguera> findByCaraId(Long caraId);

    List<Manguera> findAll();

    // ===== NUEVO: Cargar mangueras con sus relaciones (cara y dispensario) =====
    @Query("SELECT m FROM Manguera m " +
            "LEFT JOIN FETCH m.cara c " +
            "LEFT JOIN FETCH c.dispensario d " +
            "WHERE m.activo = true")
    List<Manguera> findAllWithRelations();
}