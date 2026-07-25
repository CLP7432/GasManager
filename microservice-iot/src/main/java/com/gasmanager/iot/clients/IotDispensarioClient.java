package com.gasmanager.iot.clients;

import com.gasmanager.iot.dto.DispensarioDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "microservice-ventas", contextId = "iotDispensarioClient")
public interface IotDispensarioClient {

    @GetMapping("/api/ventas/iot/dispensarios")
    List<DispensarioDTO> obtenerDispensarios();
}