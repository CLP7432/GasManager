package com.gasmanager.clientes.controllers;

import com.gasmanager.clientes.services.LimpiezaClientesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin-clientes")
@RequiredArgsConstructor
public class AdministracionController {

    private final LimpiezaClientesService limpiezaService;

    @PostMapping("/reiniciar-clientes")
    public ResponseEntity<?> reiniciarClientes() {
        try {
            limpiezaService.reiniciarClientes();
            return ResponseEntity.ok(Map.of(
                    "mensaje", "✅ Clientes y créditos reiniciados correctamente",
                    "detalle", "Se eliminaron todos los clientes, créditos y abonos."
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}