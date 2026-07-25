package com.gasmanager.compras.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@FeignClient(name = "msvc-inventarios")
public interface InventarioClient {

    // Para combustibles
    @PostMapping("/api/inventario-combustible/descontar")
    void descontarStockCombustible(
            @RequestParam("tipo") String tipo,
            @RequestParam("cantidad") BigDecimal cantidad,
            @RequestParam("motivo") String motivo);

    // Para aceites
    @PostMapping("/api/aceites/{id}/aumentar-stock")
    void aumentarStockAceite(
            @PathVariable("id") Long id,
            @RequestParam("cantidad") Integer cantidad,
            @RequestParam("motivo") String motivo);
}