package com.gasmanager.reportes.controllers;

import com.gasmanager.reportes.dto.DashboardDTO;
import com.gasmanager.reportes.dto.GraficaDataDTO;
import com.gasmanager.reportes.services.DashboardService;
import com.gasmanager.reportes.services.GraficaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final GraficaService graficaService;

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard() {
        DashboardDTO dashboard = dashboardService.obtenerDashboard();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/graficas/ventas-por-dia")
    public ResponseEntity<List<GraficaDataDTO>> getVentasPorDia(
            @RequestParam(defaultValue = "7") int dias) {
        return ResponseEntity.ok(graficaService.getVentasPorDia(dias));
    }

    @GetMapping("/graficas/ventas-por-mes")
    public ResponseEntity<List<GraficaDataDTO>> getVentasPorMes(
            @RequestParam(defaultValue = "6") int meses) {
        return ResponseEntity.ok(graficaService.getVentasPorMes(meses));
    }

    @GetMapping("/graficas/ventas-por-producto")
    public ResponseEntity<List<GraficaDataDTO>> getVentasPorProducto() {
        return ResponseEntity.ok(graficaService.getVentasPorTipoProducto());
    }

    @GetMapping("/graficas/ventas-por-metodo-pago")
    public ResponseEntity<List<GraficaDataDTO>> getVentasPorMetodoPago() {
        return ResponseEntity.ok(graficaService.getVentasPorMetodoPago());
    }

    @GetMapping("/graficas/inventario-combustible")
    public ResponseEntity<List<GraficaDataDTO>> getInventarioCombustible() {
        return ResponseEntity.ok(graficaService.getInventarioCombustible());
    }

    @GetMapping("/graficas/creditos-por-estado")
    public ResponseEntity<List<GraficaDataDTO>> getCreditosPorEstado() {
        return ResponseEntity.ok(graficaService.getCreditosPorEstado());
    }

    @GetMapping("/graficas/top-productos")
    public ResponseEntity<List<GraficaDataDTO>> getTopProductos(
            @RequestParam(defaultValue = "5") int limite) {
        return ResponseEntity.ok(graficaService.getTopProductos(limite));
    }
}