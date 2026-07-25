package com.gasmanager.clientes.services;

import com.gasmanager.clientes.repositories.AbonoCreditoRepository;
import com.gasmanager.clientes.repositories.ClienteRepository;
import com.gasmanager.clientes.repositories.CreditoRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LimpiezaClientesService {

    private final ClienteRepository clienteRepository;
    private final CreditoRepository creditoRepository;
    private final AbonoCreditoRepository abonoCreditoRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void reiniciarClientes() {
        log.info("=== INICIANDO REINICIO DE CLIENTES Y CRÉDITOS ===");

        abonoCreditoRepository.deleteAll();
        abonoCreditoRepository.flush();

        creditoRepository.deleteAll();
        creditoRepository.flush();

        clienteRepository.deleteAll();
        clienteRepository.flush();

        try {
            entityManager.createNativeQuery("ALTER TABLE clientes AUTO_INCREMENT = 1").executeUpdate();
            entityManager.createNativeQuery("ALTER TABLE creditos AUTO_INCREMENT = 1").executeUpdate();
            entityManager.createNativeQuery("ALTER TABLE abonos_credito AUTO_INCREMENT = 1").executeUpdate();
            log.info("Secuencias reseteadas correctamente");
        } catch (Exception e) {
            log.warn("No se pudieron resetear las secuencias: {}", e.getMessage());
        }

        log.info("=== CLIENTES Y CRÉDITOS REINICIADOS CORRECTAMENTE ===");
    }
}