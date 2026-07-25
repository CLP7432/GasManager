package com.gasmanager.ventas.controllers;

import com.gasmanager.ventas.dto.CombustiblePrecioDTO;
import com.gasmanager.ventas.dto.PrecioUpdateDTO;
import com.gasmanager.ventas.services.PrecioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/precios")
@RequiredArgsConstructor
public class PrecioController {

    private final PrecioService precioService;

    @GetMapping("/combustibles")
    public ResponseEntity<List<CombustiblePrecioDTO>> listarCombustibles() {
        return ResponseEntity.ok(precioService.listarCombustibles());
    }

    @PutMapping("/combustibles/{id}")
    public ResponseEntity<CombustiblePrecioDTO> actualizarPrecio(
            @PathVariable Long id,
            @Valid @RequestBody PrecioUpdateDTO request,
            @RequestHeader(value = "X-Usuario", required = false) String usuarioNombre) {
        String usuario = usuarioNombre != null ? usuarioNombre : "ADMIN";
        return ResponseEntity.ok(precioService.actualizarPrecio(id, request, usuario));
    }

    @GetMapping("/combustibles/precio/{tipo}")
    public ResponseEntity<BigDecimal> obtenerPrecioPorTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(precioService.obtenerPrecioPorTipo(tipo));
    }
}