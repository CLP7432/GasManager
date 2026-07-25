package com.gasmanager.iot.controllers;

import com.gasmanager.iot.clients.IotDispensarioClient;
import com.gasmanager.iot.clients.IotTurnoClient;
import com.gasmanager.iot.clients.VentasClient;
import com.gasmanager.iot.dto.CargaActivaDTO;
import com.gasmanager.iot.dto.DispensarioDTO;
import com.gasmanager.iot.dto.IotVentaRequest;
import com.gasmanager.iot.dto.TurnoActivoDTO;
import com.gasmanager.iot.services.IotProgresoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/iot")
@RequiredArgsConstructor
@Slf4j
public class IotController {

    private final IotTurnoClient turnoClient;
    private final IotDispensarioClient dispensarioClient;
    private final VentasClient ventasClient;
    private final IotProgresoService progresoService;

    @GetMapping("/turno-activo")
    public ResponseEntity<TurnoActivoDTO> obtenerTurnoActivo() {
        try {
            TurnoActivoDTO turno = turnoClient.obtenerTurnoActivo();
            return ResponseEntity.ok(turno);
        } catch (Exception e) {
            log.error("Error al obtener turno activo: {}", e.getMessage());
            TurnoActivoDTO error = new TurnoActivoDTO();
            error.setTieneTurnoActivo(false);
            return ResponseEntity.ok(error);
        }
    }

    @GetMapping("/dispensarios")
    public ResponseEntity<List<DispensarioDTO>> obtenerDispensarios() {
        try {
            List<DispensarioDTO> dispensarios = dispensarioClient.obtenerDispensarios();
            return ResponseEntity.ok(dispensarios);
        } catch (Exception e) {
            log.error("Error al obtener dispensarios: {}", e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }

    @PostMapping("/progreso")
    public ResponseEntity<Map<String, String>> recibirProgreso(@RequestBody CargaActivaDTO carga) {
        log.info("Progreso recibido - Dispensario: {}, Manguera: {}, Litros: {}, Total: {}",
                carga.getDispensarioId(), carga.getMangueraId(), carga.getLitros(), carga.getTotal());
        progresoService.actualizarProgreso(carga);
        return ResponseEntity.ok(Map.of("status", "OK"));
    }

    @GetMapping("/carga-activa/{dispensarioId}")
    public ResponseEntity<?> obtenerCargaActiva(@PathVariable Long dispensarioId) {
        CargaActivaDTO carga = progresoService.obtenerCargaActiva(dispensarioId);
        if (carga != null) {
            return ResponseEntity.ok(carga);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/carga-completada")
    public ResponseEntity<Map<String, Object>> cargaCompletada(@RequestBody CargaActivaDTO carga) {
        log.info("CARGA COMPLETADA - Dispensario: {}, Manguera: {}, Litros: {}, Total: {}",
                carga.getDispensarioId(), carga.getMangueraId(), carga.getLitros(), carga.getTotal());

        try {
            IotVentaRequest ventaRequest = new IotVentaRequest();
            ventaRequest.setDispensarioId(carga.getDispensarioId());
            ventaRequest.setDispensarioNombre(carga.getDispensarioNombre());
            ventaRequest.setMangueraId(carga.getMangueraId());
            ventaRequest.setMangueraNombre(carga.getMangueraNombre());
            ventaRequest.setTipoCombustible(carga.getTipoCombustible());
            ventaRequest.setLitros(carga.getLitros());
            ventaRequest.setTotal(carga.getTotal());
            ventaRequest.setPrecioUnitario(carga.getPrecioUnitario());
            ventaRequest.setDespachadorId(carga.getDespachadorId());
            ventaRequest.setDespachadorNombre(carga.getDespachadorNombre());

            log.info("Enviando a ventas: {}", ventaRequest);

            Map<String, Object> resultado = ventasClient.realizarCarga(ventaRequest);
            log.info("Venta creada exitosamente: {}", resultado);

            progresoService.limpiarCargaActiva(carga.getDispensarioId());

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("status", "OK");
            respuesta.put("mensaje", "Carga completada y venta registrada");
            respuesta.put("folio", resultado.get("folio"));
            respuesta.put("ventaId", resultado.get("ventaId"));
            respuesta.put("despachador", resultado.get("despachador"));
            respuesta.put("dispensario", resultado.get("dispensario"));
            respuesta.put("manguera", resultado.get("manguera"));
            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            log.error("Error al crear la venta: {}", e.getMessage(), e);
            Map<String, Object> errorResp = new HashMap<>();
            errorResp.put("status", "ERROR");
            errorResp.put("mensaje", "Error al crear la venta: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResp);
        }
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "message", "IoT Service funcionando",
                "service", "microservice-iot"
        ));
    }
}