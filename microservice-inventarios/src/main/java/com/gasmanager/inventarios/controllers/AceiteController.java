package com.gasmanager.inventarios.controllers;

import com.gasmanager.inventarios.dto.AceiteDTO;
import com.gasmanager.inventarios.services.AceiteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aceites")
public class AceiteController {

    @Autowired
    private AceiteService aceiteService;

    @PostMapping
    public ResponseEntity<AceiteDTO> crearAceite(
            @Valid @RequestBody AceiteDTO aceiteDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = 1L;
        String usuarioNombre = (userDetails != null) ? userDetails.getUsername() : "sistema";

        AceiteDTO response = aceiteService.crearAceite(aceiteDTO, usuarioId, usuarioNombre);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AceiteDTO> actualizarAceite(
            @PathVariable Long id,
            @Valid @RequestBody AceiteDTO aceiteDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = 1L;
        String usuarioNombre = (userDetails != null) ? userDetails.getUsername() : "sistema";

        AceiteDTO response = aceiteService.actualizarAceite(id, aceiteDTO, usuarioId, usuarioNombre);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AceiteDTO>> listarAceites() {
        return ResponseEntity.ok(aceiteService.listarAceites());
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<AceiteDTO> actualizarStock(
            @PathVariable Long id,
            @RequestParam Integer nuevoStock,
            @RequestParam(required = false) String motivo,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long usuarioId = 1L;
        String usuarioNombre = (userDetails != null) ? userDetails.getUsername() : "sistema";

        AceiteDTO response = aceiteService.actualizarStock(id, nuevoStock, motivo, usuarioId, usuarioNombre);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/activos")
    public ResponseEntity<List<AceiteDTO>> listarActivos() {
        return ResponseEntity.ok(aceiteService.listarActivos());
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<List<AceiteDTO>> listarStockBajo() {
        return ResponseEntity.ok(aceiteService.listarConStockBajo());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AceiteDTO> obtenerAceite(@PathVariable Long id) {
        return ResponseEntity.ok(aceiteService.obtenerAceite(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAceite(@PathVariable Long id) {
        aceiteService.eliminarAceite(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<AceiteDTO> toggleActivo(@PathVariable Long id) {
        return ResponseEntity.ok(aceiteService.toggleActivo(id));
    }
}