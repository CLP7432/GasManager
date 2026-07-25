package com.gasmanager.clientes.repositories;

import com.gasmanager.clientes.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByCodigoCliente(String codigoCliente);

    Optional<Cliente> findByRfc(String rfc);

    Optional<Cliente> findByEmail(String email);

    List<Cliente> findByActivoTrue();

    List<Cliente> findByRazonSocialContainingIgnoreCase(String razonSocial);

    boolean existsByRfc(String rfc);

    boolean existsByEmail(String email);
}