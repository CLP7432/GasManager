package com.gasmanager.iot.clients;

import com.gasmanager.iot.dto.TurnoActivoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "microservice-ventas", contextId = "iotTurnoClient")
public interface IotTurnoClient {

    @GetMapping("/api/ventas/iot/turno-activo")
    TurnoActivoDTO obtenerTurnoActivo();
}