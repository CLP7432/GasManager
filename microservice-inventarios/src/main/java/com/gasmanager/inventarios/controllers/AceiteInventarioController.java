//package com.gasmanager.inventarios.controllers;
//
//import com.gasmanager.inventarios.dto.*;
//import com.gasmanager.inventarios.services.AceiteInventarioService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/inventario-aceites")
//@CrossOrigin(origins = "http://localhost:5173")
//@RequiredArgsConstructor
//public class AceiteInventarioController {
//
//    private final AceiteInventarioService aceiteInventarioService;
//
//    // ========== INICIALIZACIÓN ==========
//
//    @PostMapping("/inicializar")
//    public ResponseEntity<Map<String, String>> inicializarInventario(
//            @AuthenticationPrincipal UserDetails userDetails) {
//        Long usuarioId = 1L;
//        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";
//
//        aceiteInventarioService.inicializarInventarioAceites(usuarioId, usuarioNombre);
//
//        return ResponseEntity.ok(Map.of(
//                "mensaje", "Inventario de aceites inicializado correctamente",
//                "detalle", "Se crearon registros en bodega y dispensarios para todos los aceites activos."
//        ));
//    }
//
//    // ========== BODEGA ==========
//
//    @GetMapping("/bodega")
//    public ResponseEntity<List<AceiteBodegaDTO>> listarBodega() {
//        return ResponseEntity.ok(aceiteInventarioService.listarBodega());
//    }
//
//    @GetMapping("/bodega/{aceiteId}")
//    public ResponseEntity<AceiteBodegaDTO> obtenerBodegaPorAceite(@PathVariable Long aceiteId) {
//        return ResponseEntity.ok(aceiteInventarioService.obtenerBodegaPorAceite(aceiteId));
//    }
//
//    @GetMapping("/bodega/stock-bajo")
//    public ResponseEntity<List<AceiteBodegaDTO>> listarStockBajoBodega() {
//        return ResponseEntity.ok(aceiteInventarioService.listarStockBajoBodega());
//    }
//
//    @GetMapping("/bodega/stock-critico")
//    public ResponseEntity<List<AceiteBodegaDTO>> listarStockCriticoBodega() {
//        return ResponseEntity.ok(aceiteInventarioService.listarStockCriticoBodega());
//    }
//
//    // ========== DISPENSARIOS ==========
//
//    @GetMapping("/dispensario/{dispensarioId}")
//    public ResponseEntity<List<AceiteDispensarioDTO>> listarStockDispensario(@PathVariable Long dispensarioId) {
//        return ResponseEntity.ok(aceiteInventarioService.listarStockDispensario(dispensarioId));
//    }
//
//    @GetMapping("/dispensario/stock-bajo")
//    public ResponseEntity<List<AceiteDispensarioDTO>> listarStockBajoDispensarios() {
//        return ResponseEntity.ok(aceiteInventarioService.listarStockBajoDispensarios());
//    }
//
//    @GetMapping("/dispensario/{dispensarioId}/stock-bajo")
//    public ResponseEntity<List<AceiteDispensarioDTO>> listarStockBajoPorDispensario(@PathVariable Long dispensarioId) {
//        return ResponseEntity.ok(aceiteInventarioService.listarStockBajoPorDispensario(dispensarioId));
//    }
//
//    @GetMapping("/resumen-stock")
//    public ResponseEntity<List<AceiteDispensarioDTO>> obtenerResumenStockPorDispensario() {
//        return ResponseEntity.ok(aceiteInventarioService.obtenerResumenStockPorDispensario());
//    }
//
//    // ========== COMPRAS ==========
//
//    @PostMapping("/compras")
//    public ResponseEntity<CompraAceiteDTO> registrarCompra(
//            @Valid @RequestBody CompraAceiteDTO compraDTO,
//            @AuthenticationPrincipal UserDetails userDetails) {
//        Long usuarioId = 1L;
//        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";
//
//        return new ResponseEntity<>(
//                aceiteInventarioService.registrarCompra(compraDTO, usuarioId, usuarioNombre),
//                HttpStatus.CREATED
//        );
//    }
//
//    @GetMapping("/compras")
//    public ResponseEntity<List<CompraAceiteDTO>> listarCompras() {
//        return ResponseEntity.ok(aceiteInventarioService.listarCompras());
//    }
//
//    @GetMapping("/compras/aceite/{aceiteId}")
//    public ResponseEntity<List<CompraAceiteDTO>> listarComprasPorAceite(@PathVariable Long aceiteId) {
//        return ResponseEntity.ok(aceiteInventarioService.listarComprasPorAceite(aceiteId));
//    }
//
//    // ========== TRANSFERENCIAS / SURTIDO ==========
//
//    @PostMapping("/surtir")
//    public ResponseEntity<List<TransferenciaAceiteDTO>> surtirDispensario(
//            @Valid @RequestBody SurtidoRequestDTO request,
//            @AuthenticationPrincipal UserDetails userDetails) {
//        Long usuarioId = 1L;
//        String usuarioNombre = userDetails != null ? userDetails.getUsername() : "sistema";
//
//        return new ResponseEntity<>(
//                aceiteInventarioService.surtirDispensario(request, usuarioId, usuarioNombre),
//                HttpStatus.CREATED
//        );
//    }
//
//    @GetMapping("/transferencias")
//    public ResponseEntity<List<TransferenciaAceiteDTO>> listarTransferencias() {
//        return ResponseEntity.ok(aceiteInventarioService.listarTransferencias());
//    }
//
//    @GetMapping("/transferencias/dispensario/{dispensarioId}")
//    public ResponseEntity<List<TransferenciaAceiteDTO>> listarTransferenciasPorDispensario(@PathVariable Long dispensarioId) {
//        return ResponseEntity.ok(aceiteInventarioService.listarTransferenciasPorDispensario(dispensarioId));
//    }
//}