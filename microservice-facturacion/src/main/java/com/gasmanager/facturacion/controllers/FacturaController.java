package com.gasmanager.facturacion.controllers;

import com.gasmanager.facturacion.dto.FacturaResponseDTO;
import com.gasmanager.facturacion.dto.SolicitudFacturaDTO;
import com.gasmanager.facturacion.dto.VentaFacturableDTO;
import com.gasmanager.facturacion.services.FacturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facturas")
@RequiredArgsConstructor
public class FacturaController {

    private final FacturaService facturaService;

    // Obtener usuario actual (temporal, después vendrá del token)
    private Long getCurrentUserId() {
        return 1L;
    }

    private String getCurrentUserNombre() {
        return "SISTEMA";
    }

    // ========== VERIFICACIÓN DE VENTAS FACTURABLES ==========

    /**
     * Verificar si una venta específica es facturable
     * GET /api/facturas/venta/{ventaId}/facturable
     */
    @GetMapping("/venta/{ventaId}/facturable")
    public ResponseEntity<VentaFacturableDTO> verificarVentaFacturable(@PathVariable Long ventaId) {
        return ResponseEntity.ok(facturaService.verificarVentaFacturable(ventaId));
    }

    /**
     * Verificar múltiples ventas para facturación consolidada
     * POST /api/facturas/ventas/verificar
     */
    @PostMapping("/ventas/verificar")
    public ResponseEntity<List<VentaFacturableDTO>> verificarVentasFacturables(@RequestBody List<Long> ventasIds) {
        return ResponseEntity.ok(facturaService.verificarVentasFacturables(ventasIds));
    }

    // ========== CRUD DE FACTURAS ==========

    /**
     * Solicitar factura (una o múltiples ventas)
     * POST /api/facturas/solicitar
     */
    @PostMapping("/solicitar")
    public ResponseEntity<FacturaResponseDTO> solicitarFactura(@Valid @RequestBody SolicitudFacturaDTO solicitud) {
        FacturaResponseDTO factura = facturaService.solicitarFactura(
                solicitud, getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(factura);
    }

    /**
     * Obtener factura por ID
     * GET /api/facturas/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<FacturaResponseDTO> obtenerFactura(@PathVariable Long id) {
        return ResponseEntity.ok(facturaService.obtenerFactura(id));
    }

    /**
     * Obtener factura por folio
     * GET /api/facturas/folio/{folio}
     */
    @GetMapping("/folio/{folio}")
    public ResponseEntity<FacturaResponseDTO> obtenerFacturaPorFolio(@PathVariable String folio) {
        return ResponseEntity.ok(facturaService.obtenerFacturaPorFolio(folio));
    }

    /**
     * Listar todas las facturas
     * GET /api/facturas
     */
    @GetMapping
    public ResponseEntity<List<FacturaResponseDTO>> listarFacturas() {
        return ResponseEntity.ok(facturaService.listarFacturas());
    }

    /**
     * Listar facturas por cliente
     * GET /api/facturas/cliente/{clienteId}
     */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<FacturaResponseDTO>> listarFacturasPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(facturaService.listarFacturasPorCliente(clienteId));
    }

    /**
     * Listar facturas por RFC
     * GET /api/facturas/rfc/{rfc}
     */
    @GetMapping("/rfc/{rfc}")
    public ResponseEntity<List<FacturaResponseDTO>> listarFacturasPorRFC(@PathVariable String rfc) {
        return ResponseEntity.ok(facturaService.listarFacturasPorRFC(rfc));
    }

    /**
     * Cancelar factura
     * POST /api/facturas/{id}/cancelar?motivo=
     */
    @PostMapping("/{id}/cancelar")
    public ResponseEntity<FacturaResponseDTO> cancelarFactura(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {
        FacturaResponseDTO factura = facturaService.cancelarFactura(
                id, motivo != null ? motivo : "Cancelación solicitada",
                getCurrentUserId(), getCurrentUserNombre());
        return ResponseEntity.ok(factura);
    }
}