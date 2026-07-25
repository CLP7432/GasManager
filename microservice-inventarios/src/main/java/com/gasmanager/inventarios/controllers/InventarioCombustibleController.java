package com.gasmanager.inventarios.controllers;

import com.gasmanager.inventarios.dto.*;
import com.gasmanager.inventarios.entities.CargaPipa;
import com.gasmanager.inventarios.entities.InventarioCombustible;
import com.gasmanager.inventarios.enums.TipoCombustible;
import com.gasmanager.inventarios.services.AceiteInventarioService;
import com.gasmanager.inventarios.services.InventarioCombustibleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class InventarioCombustibleController {

    @Autowired
    private InventarioCombustibleService inventarioService;

    @Autowired
    private AceiteInventarioService aceiteInventarioService;

    // ========== COMBUSTIBLES ==========

    @GetMapping("/inventario-combustible")
    public ResponseEntity<List<InventarioCombustibleDTO>> obtenerInventario() {
        List<InventarioCombustibleDTO> inventario = inventarioService.listarInventario().stream()
                .map(inventarioService::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(inventario);
    }

    @GetMapping("/inventario-combustible/activos")
    public ResponseEntity<List<InventarioCombustibleDTO>> obtenerInventarioActivo() {
        List<InventarioCombustibleDTO> inventario = inventarioService.listarActivos().stream()
                .map(inventarioService::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(inventario);
    }

    @GetMapping("/inventario-combustible/stock-bajo")
    public ResponseEntity<List<InventarioCombustibleDTO>> verificarStockBajo() {
        List<InventarioCombustibleDTO> stockBajo = inventarioService.verificarStockBajo().stream()
                .map(inventarioService::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(stockBajo);
    }

    @GetMapping("/inventario-combustible/tipo/{tipo}")
    public ResponseEntity<InventarioCombustibleDTO> obtenerPorTipo(@PathVariable String tipo) {
        TipoCombustible tipoCombustible = TipoCombustible.fromString(tipo);
        if (tipoCombustible == null) {
            return ResponseEntity.badRequest().build();
        }
        InventarioCombustibleDTO inventario = inventarioService.mapToDTO(inventarioService.obtenerPorTipo(tipoCombustible));
        return ResponseEntity.ok(inventario);
    }

    @GetMapping("/inventario-combustible/{id}")
    public ResponseEntity<InventarioCombustibleDTO> obtenerPorId(@PathVariable Long id) {
        InventarioCombustibleDTO inventario = inventarioService.mapToDTO(inventarioService.obtenerPorId(id));
        return ResponseEntity.ok(inventario);
    }

    @PostMapping("/inventario-combustible/descontar")
    public ResponseEntity<Void> descontarStock(
            @RequestParam String tipo,
            @RequestParam BigDecimal cantidad,
            @RequestParam String motivo,
            @AuthenticationPrincipal UserDetails userDetails) {

        TipoCombustible tipoCombustible = TipoCombustible.fromString(tipo);
        if (tipoCombustible == null) {
            return ResponseEntity.badRequest().build();
        }

        Long usuarioId = 1L;
        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";

        inventarioService.descontarStock(tipoCombustible, cantidad, motivo, usuarioId, usuarioNombre);
        return ResponseEntity.ok().build();
    }

    // ========== CARGAS DE PIPA ==========

    @PostMapping("/inventario-combustible/cargas")
    public ResponseEntity<CargaPipaDTO> registrarCargaPipa(
            @Valid @RequestBody CargaPipa carga,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = 1L;
        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";

        CargaPipa guardada = inventarioService.registrarCargaPipa(carga, usuarioId, usuarioNombre);

        CargaPipaDTO dto = new CargaPipaDTO(
                guardada.getId(), guardada.getFolio(), guardada.getTipoCombustible(),
                guardada.getProveedor(), guardada.getVolumen(), guardada.getPrecioCompra(),
                guardada.getCostoTotal(), guardada.getFechaCarga(), guardada.getFactura(),
                guardada.getObservaciones(), guardada.getCargadoPor(), guardada.getCreatedAt()
        );
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/inventario-combustible/cargas")
    public ResponseEntity<List<CargaPipaDTO>> listarCargasPipa() {
        List<CargaPipaDTO> cargas = inventarioService.listarCargasPipa().stream()
                .map(c -> new CargaPipaDTO(
                        c.getId(), c.getFolio(), c.getTipoCombustible(),
                        c.getProveedor(), c.getVolumen(), c.getPrecioCompra(),
                        c.getCostoTotal(), c.getFechaCarga(), c.getFactura(),
                        c.getObservaciones(), c.getCargadoPor(), c.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(cargas);
    }

    @PutMapping("/inventario-combustible/{id}/stock")
    public ResponseEntity<InventarioCombustibleDTO> actualizarStockManual(
            @PathVariable Long id,
            @RequestParam BigDecimal nuevoStock,
            @RequestParam(required = false) String motivo,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = 1L;
        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";

        InventarioCombustible inventario = inventarioService.actualizarStockManual(id, nuevoStock, motivo, usuarioId, usuarioNombre);
        return ResponseEntity.ok(inventarioService.mapToDTO(inventario));
    }

    // ========== CONFIGURACIÓN DE TANQUES ==========

    @GetMapping("/inventario-combustible/configuracion")
    public ResponseEntity<List<InventarioCombustibleDTO>> obtenerConfiguracionTanques() {
        List<InventarioCombustibleDTO> configuracion = inventarioService.listarInventario().stream()
                .map(inventarioService::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(configuracion);
    }

    @PutMapping("/inventario-combustible/configuracion")
    public ResponseEntity<List<InventarioCombustibleDTO>> actualizarConfiguracionTanques(
            @RequestBody List<InventarioCombustibleDTO> configuracion,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = 1L;
        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";

        List<InventarioCombustible> actualizados = inventarioService.actualizarConfiguracionTanques(
                configuracion, usuarioId, usuarioNombre);

        return ResponseEntity.ok(actualizados.stream()
                .map(inventarioService::mapToDTO)
                .collect(Collectors.toList()));
    }

    @PostMapping("/inventario-combustible/reiniciar")
    public ResponseEntity<Map<String, String>> reiniciarInventario(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = 1L;
        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";

        inventarioService.reiniciarInventario(usuarioId, usuarioNombre);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Inventario de combustibles reiniciado a cero correctamente",
                "detalle", "Todos los tanques tienen stock 0. Se han conservado las capacidades y stocks mínimos."
        ));
    }

    // ========== INVENTARIO DE ACEITES ==========

    @GetMapping("/inventario-aceites/bodega")
    public ResponseEntity<List<AceiteBodegaDTO>> listarBodega() {
        return ResponseEntity.ok(aceiteInventarioService.listarBodega());
    }

    @GetMapping("/inventario-aceites/bodega/{aceiteId}")
    public ResponseEntity<AceiteBodegaDTO> obtenerBodegaPorAceite(@PathVariable Long aceiteId) {
        return ResponseEntity.ok(aceiteInventarioService.obtenerBodegaPorAceite(aceiteId));
    }

    @GetMapping("/inventario-aceites/bodega/stock-bajo")
    public ResponseEntity<List<AceiteBodegaDTO>> listarStockBajoBodega() {
        return ResponseEntity.ok(aceiteInventarioService.listarStockBajoBodega());
    }

    @GetMapping("/inventario-aceites/bodega/stock-critico")
    public ResponseEntity<List<AceiteBodegaDTO>> listarStockCriticoBodega() {
        return ResponseEntity.ok(aceiteInventarioService.listarStockCriticoBodega());
    }

    @GetMapping("/inventario-aceites/dispensario/{dispensarioId}")
    public ResponseEntity<List<AceiteDispensarioDTO>> listarStockDispensario(@PathVariable Long dispensarioId) {
        return ResponseEntity.ok(aceiteInventarioService.listarStockDispensario(dispensarioId));
    }

    @GetMapping("/inventario-aceites/dispensario/stock-bajo")
    public ResponseEntity<List<AceiteDispensarioDTO>> listarStockBajoDispensarios() {
        return ResponseEntity.ok(aceiteInventarioService.listarStockBajoDispensarios());
    }

    @GetMapping("/inventario-aceites/dispensario/{dispensarioId}/stock-bajo")
    public ResponseEntity<List<AceiteDispensarioDTO>> listarStockBajoPorDispensario(@PathVariable Long dispensarioId) {
        return ResponseEntity.ok(aceiteInventarioService.listarStockBajoPorDispensario(dispensarioId));
    }

    @GetMapping("/inventario-aceites/resumen-stock")
    public ResponseEntity<List<AceiteDispensarioDTO>> obtenerResumenStockPorDispensario() {
        return ResponseEntity.ok(aceiteInventarioService.obtenerResumenStockPorDispensario());
    }

    @PostMapping("/inventario-aceites/compras")
    public ResponseEntity<CompraAceiteDTO> registrarCompra(
            @RequestBody CompraAceiteDTO compraDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long usuarioId = 1L;
        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";
        return new ResponseEntity<>(
                aceiteInventarioService.registrarCompra(compraDTO, usuarioId, usuarioNombre),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/inventario-aceites/compras")
    public ResponseEntity<List<CompraAceiteDTO>> listarCompras() {
        return ResponseEntity.ok(aceiteInventarioService.listarCompras());
    }

    @GetMapping("/inventario-aceites/compras/aceite/{aceiteId}")
    public ResponseEntity<List<CompraAceiteDTO>> listarComprasPorAceite(@PathVariable Long aceiteId) {
        return ResponseEntity.ok(aceiteInventarioService.listarComprasPorAceite(aceiteId));
    }

    @PostMapping("/inventario-aceites/surtir")
    public ResponseEntity<List<TransferenciaAceiteDTO>> surtirDispensario(
            @RequestBody SurtidoRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long usuarioId = 1L;
        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";
        return new ResponseEntity<>(
                aceiteInventarioService.surtirDispensario(request, usuarioId, usuarioNombre),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/inventario-aceites/transferencias")
    public ResponseEntity<List<TransferenciaAceiteDTO>> listarTransferencias() {
        return ResponseEntity.ok(aceiteInventarioService.listarTransferencias());
    }

    @GetMapping("/inventario-aceites/transferencias/dispensario/{dispensarioId}")
    public ResponseEntity<List<TransferenciaAceiteDTO>> listarTransferenciasPorDispensario(@PathVariable Long dispensarioId) {
        return ResponseEntity.ok(aceiteInventarioService.listarTransferenciasPorDispensario(dispensarioId));
    }

    @PostMapping("/inventario-aceites/inicializar")
    public ResponseEntity<Map<String, String>> inicializarInventarioAceites(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = 1L;
        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";

        aceiteInventarioService.inicializarInventarioAceites(usuarioId, usuarioNombre);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Inventario de aceites inicializado correctamente",
                "detalle", "Se crearon registros en bodega para todos los aceites activos."
        ));
    }

    @PostMapping("/inventario-aceites/reiniciar")
    public ResponseEntity<Map<String, String>> reiniciarInventarioAceites(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = 1L;
        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";

        aceiteInventarioService.reiniciarInventarioAceites(usuarioId, usuarioNombre);

        return ResponseEntity.ok(Map.of(
                "mensaje", "✅ Inventario de aceites reiniciado a cero correctamente",
                "detalle", "Se pusieron a cero todos los stocks en bodega y dispensarios."
        ));
    }

    @PostMapping("/inventario-aceites/reiniciar-completo")
    public ResponseEntity<Map<String, String>> reiniciarInventarioCompleto(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = 1L;
        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";

        Map<String, Object> resultado = aceiteInventarioService.reiniciarInventarioCompleto(usuarioId, usuarioNombre);

        return ResponseEntity.ok(Map.of(
                "mensaje", "✅ Inventario de aceites reiniciado COMPLETAMENTE",
                "detalle", "Se eliminaron " + resultado.get("comprasEliminadas") + " compras y " +
                        resultado.get("transferenciasEliminadas") + " transferencias. Stocks en cero.",
                "comprasRestantes", String.valueOf(resultado.get("comprasRestantes")),
                "transferenciasRestantes", String.valueOf(resultado.get("transferenciasRestantes"))
        ));
    }

    @PutMapping("/inventario-aceites/bodega/{aceiteId}/stock")
    public ResponseEntity<AceiteBodegaDTO> actualizarStockBodega(
            @PathVariable Long aceiteId,
            @RequestParam Integer nuevoStock,
            @AuthenticationPrincipal UserDetails userDetails) {

        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";

        AceiteBodegaDTO resultado = aceiteInventarioService.actualizarStockBodega(aceiteId, nuevoStock, usuarioNombre);

        return ResponseEntity.ok(resultado);
    }
}