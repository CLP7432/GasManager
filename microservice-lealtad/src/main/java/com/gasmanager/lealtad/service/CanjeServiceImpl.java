package com.gasmanager.lealtad.service;

import com.gasmanager.lealtad.entities.CanjeRecompensa;
import com.gasmanager.lealtad.entities.CuentaPuntos;
import com.gasmanager.lealtad.entities.Recompensas;
import com.gasmanager.lealtad.enums.EstadoCanje;
import com.gasmanager.lealtad.exceptions.RecompensaNoDisponibleException;
import com.gasmanager.lealtad.exceptions.SaldoInsuficienteException;
import com.gasmanager.lealtad.repositories.CanjeRepository;
import com.gasmanager.lealtad.repositories.CuentaPuntosRepository;
import com.gasmanager.lealtad.repositories.RecompensaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CanjeServiceImpl implements CanjeService {

    private final CuentaPuntosRepository cuentaRepo;
    private final RecompensaRepository recompensaRepo;
    private final CanjeRepository canjeRepo;

    public CanjeServiceImpl(CuentaPuntosRepository cuentaRepo,
                            RecompensaRepository recompensaRepo,
                            CanjeRepository canjeRepo) {
        this.cuentaRepo = cuentaRepo;
        this.recompensaRepo = recompensaRepo;
        this.canjeRepo = canjeRepo;
    }

    @Override
    @Transactional
    public CanjeRecompensa registrarCanje(Long ventaId, Long recompensaId) {
        CuentaPuntos cuenta = cuentaRepo.findByVentaId(ventaId)
                .orElseThrow(() -> new IllegalArgumentException("No existe cuenta para la venta"));

        Recompensas recompensa = recompensaRepo.findById(recompensaId)
                .orElseThrow(() -> new RecompensaNoDisponibleException("Recompensa no encontrada"));

        if (cuenta.getSaldoPuntos() < recompensa.getCostoPuntos()) {
            throw new SaldoInsuficienteException("Saldo insuficiente para canjear");
        }

        cuenta.setSaldoPuntos(cuenta.getSaldoPuntos() - recompensa.getCostoPuntos());
        cuentaRepo.save(cuenta);

        CanjeRecompensa canje = new CanjeRecompensa();
        canje.setVentaId(ventaId);
        canje.setRecompensa(recompensa);
        canje.setFechaCanje(LocalDateTime.now());
        canje.setPuntosUsados(recompensa.getCostoPuntos());
        canje.setEstado(EstadoCanje.APROBADO);

        return canjeRepo.save(canje);
    }

    @Override
    public List<CanjeRecompensa> obtenerCanjesPorVenta(Long ventaId) {
        return canjeRepo.findByVentaId(ventaId);
    }
}
