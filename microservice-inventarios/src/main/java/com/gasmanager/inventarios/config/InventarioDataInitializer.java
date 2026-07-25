package com.gasmanager.inventarios.config;

import com.gasmanager.inventarios.services.InventarioCombustibleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class InventarioDataInitializer implements CommandLineRunner {

    @Autowired
    private InventarioCombustibleService inventarioService;

    @Override
    public void run(String... args) throws Exception {
        inventarioService.inicializarInventario();
        System.out.println("=== INVENTARIO DE COMBUSTIBLE INICIALIZADO ===");
    }
}