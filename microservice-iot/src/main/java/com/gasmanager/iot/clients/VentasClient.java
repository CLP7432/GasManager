package com.gasmanager.iot.clients;

import com.gasmanager.iot.dto.IotVentaRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "microservice-ventas", contextId = "ventasClient")
public interface VentasClient {

    @PostMapping("/api/ventas/iot")
    Map<String, Object> realizarCarga(@RequestBody IotVentaRequest request);

}