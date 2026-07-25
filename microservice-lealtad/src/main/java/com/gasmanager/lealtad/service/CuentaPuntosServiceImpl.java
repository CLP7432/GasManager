package com.gasmanager.lealtad.service;

import com.gasmanager.lealtad.entities.CuentaPuntos;
import com.gasmanager.lealtad.repositories.CuentaPuntosRepository;
import org.springframework.stereotype.Service;

@Service
public class CuentaPuntosServiceImpl implements CuentaPuntosService {

    private final CuentaPuntosRepository repo;

    public CuentaPuntosServiceImpl(CuentaPuntosRepository repo) {
        this.repo = repo;
    }

    @Override
    public int consultarSaldo(Long ventaId) {
        return repo.findByVentaId(ventaId)
                .map(CuentaPuntos::getSaldoPuntos)
                .orElse(0);
    }

    @Override
    public void actualizarSaldo(Long ventaId, int puntos) {
        CuentaPuntos cuenta = repo.findByVentaId(ventaId)
                .orElse(new CuentaPuntos(null, ventaId, 0));
        cuenta.setSaldoPuntos(cuenta.getSaldoPuntos() + puntos);
        repo.save(cuenta);
    }
}
