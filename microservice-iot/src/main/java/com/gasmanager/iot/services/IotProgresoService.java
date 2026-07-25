package com.gasmanager.iot.services;

import com.gasmanager.iot.dto.CargaActivaDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class IotProgresoService {

    // Almacena la carga activa por dispensarioId
    private final Map<Long, CargaActivaDTO> cargasActivas = new ConcurrentHashMap<>();

    public void actualizarProgreso(CargaActivaDTO carga) {
        log.info("Actualizando progreso - Dispensario: {}, Litros: {}, Total: {}",
                carga.getDispensarioId(), carga.getLitros(), carga.getTotal());
        cargasActivas.put(carga.getDispensarioId(), carga);
    }

    public CargaActivaDTO obtenerCargaActiva(Long dispensarioId) {
        return cargasActivas.get(dispensarioId);
    }

    public void limpiarCargaActiva(Long dispensarioId) {
        cargasActivas.remove(dispensarioId);
        log.info("Carga activa limpiada para dispensario: {}", dispensarioId);
    }

    public boolean hayCargaActiva(Long dispensarioId) {
        return cargasActivas.containsKey(dispensarioId);
    }
}