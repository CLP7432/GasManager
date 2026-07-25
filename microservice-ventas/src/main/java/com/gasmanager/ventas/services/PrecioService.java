package com.gasmanager.ventas.services;

import com.gasmanager.ventas.clients.InventarioClient;
import com.gasmanager.ventas.dto.CombustiblePrecioDTO;
import com.gasmanager.ventas.dto.PrecioUpdateDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrecioService {

    private final InventarioClient inventarioClient;

    @Transactional(readOnly = true)
    public List<CombustiblePrecioDTO> listarCombustibles() {
        try {
            List<InventarioClient.CombustibleDTO> combustibles = inventarioClient.listarCombustiblesActivos();
            return combustibles.stream()
                    .map(c -> CombustiblePrecioDTO.builder()
                            .id(c.getId())
                            .tipo(c.getTipo())
                            .nombre(c.getNombre())
                            .precioActual(c.getPrecioActual())
                            .activo(c.getActivo())
                            .ultimaActualizacion(LocalDateTime.now())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error listando combustibles: {}", e.getMessage());
            throw new RuntimeException("Error al obtener combustibles desde inventarios", e);
        }
    }

    @Transactional
    public CombustiblePrecioDTO actualizarPrecio(Long id, PrecioUpdateDTO request, String usuarioNombre) {
        log.info("Actualizando precio de combustible ID: {} a ${} - Motivo: {} - Usuario: {}",
                id, request.getNuevoPrecio(), request.getMotivoCambio(), usuarioNombre);

        try {
            InventarioClient.CombustibleDTO actualizado = inventarioClient.actualizarPrecioCombustible(id, request);

            return CombustiblePrecioDTO.builder()
                    .id(actualizado.getId())
                    .tipo(actualizado.getTipo())
                    .nombre(actualizado.getNombre())
                    .precioActual(actualizado.getPrecioActual())
                    .activo(actualizado.getActivo())
                    .ultimaActualizacion(LocalDateTime.now())
                    .build();
        } catch (Exception e) {
            log.error("Error actualizando precio: {}", e.getMessage());
            throw new RuntimeException("Error al actualizar precio en inventarios", e);
        }
    }

    @Transactional(readOnly = true)
    public BigDecimal obtenerPrecioPorTipo(String tipo) {
        try {
            return inventarioClient.obtenerPrecioActualPorTipo(tipo);
        } catch (Exception e) {
            log.error("Error obteniendo precio por tipo {}: {}", tipo, e.getMessage());
            // Valores por defecto
            switch (tipo.toUpperCase()) {
                case "MAGNA": return new BigDecimal("24.00");
                case "PREMIUM": return new BigDecimal("30.00");
                case "DIESEL": return new BigDecimal("24.00");
                default: return BigDecimal.ZERO;
            }
        }
    }
}