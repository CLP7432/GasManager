package com.gasmanager.lealtad.service;

import com.gasmanager.lealtad.dto.VentaResponse;
import com.gasmanager.lealtad.entities.Transaccion;
import com.gasmanager.lealtad.entities.ProgramaLealtad;
import com.gasmanager.lealtad.repositories.TransaccionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransaccionServiceImpl implements TransaccionService {

    private static final Logger log = LoggerFactory.getLogger(TransaccionServiceImpl.class);

    private final TransaccionRepository transaccionRepo;
    private final CuentaPuntosService cuentaService;
    private final ProgramaLealtadService programaService;
    private final RestTemplate restTemplate;

    @Value("${microservicio.ventas.url:http://msvc-ventas:8082}")
    private String ventasUrl;

    public TransaccionServiceImpl(TransaccionRepository transaccionRepo,
                                  CuentaPuntosService cuentaService,
                                  ProgramaLealtadService programaService,
                                  RestTemplate restTemplate) {
        this.transaccionRepo = transaccionRepo;
        this.cuentaService = cuentaService;
        this.programaService = programaService;
        this.restTemplate = restTemplate;
    }

    @Override
    @Transactional
    public Transaccion registrarTransaccion(Long ventaId) {
        String url = ventasUrl + "/api/ventas/" + ventaId;
        log.info("Obteniendo venta desde: {}", url);

        VentaResponse venta = restTemplate.getForObject(url, VentaResponse.class);
        if (venta == null) {
            throw new IllegalArgumentException("La venta no existe.");
        }

        double litros = 0;
        if (venta.getDetalles() != null) {
            litros = venta.getDetalles().stream()
                    .filter(d -> "LITROS".equals(d.getUnidadMedida()))
                    .map(VentaResponse.DetalleVentaResponse::getCantidad)
                    .mapToDouble(BigDecimal::doubleValue)
                    .sum();
        }

        double monto = venta.getTotal() != null ? venta.getTotal().doubleValue() : 0;

        ProgramaLealtad programa = programaService.obtenerProgramaActivo();
        int puntosCalculados = (int) (litros * programa.getFactorPuntos());

        Transaccion transaccion = new Transaccion();
        transaccion.setVentaId(ventaId);
        transaccion.setMonto(monto);
        transaccion.setLitros(litros);
        transaccion.setFecha(LocalDateTime.now());
        transaccion.setPuntosGenerados(puntosCalculados);

        transaccionRepo.save(transaccion);
        cuentaService.actualizarSaldo(ventaId, puntosCalculados);

        return transaccion;
    }

    @Override
    public List<Transaccion> obtenerTransaccionesPorVenta(Long ventaId) {
        return transaccionRepo.findByVentaId(ventaId);
    }
}
