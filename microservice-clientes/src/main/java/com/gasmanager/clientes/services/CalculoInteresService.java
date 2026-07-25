package com.gasmanager.clientes.services;

import com.gasmanager.clientes.entities.Credito;
import com.gasmanager.clientes.enums.EstadoCredito;
import com.gasmanager.clientes.enums.MetodoPagoCredito;
import com.gasmanager.clientes.repositories.CreditoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CalculoInteresService {

    private final CreditoRepository creditoRepository;

    private int getDiasPorMetodoPago(MetodoPagoCredito metodoPago) {
        if (metodoPago == null) return 30;
        switch (metodoPago) {
            case SEMANAL:
                return 7;
            case QUINCENAL:
                return 15;
            case MENSUAL:
                return 30;
            case PERSONALIZADO:
                return 30;
            default:
                return 30;
        }
    }

    private BigDecimal calcularInteresPeriodo(BigDecimal saldoPendiente, BigDecimal tasaInteres, int dias) {
        if (saldoPendiente == null || saldoPendiente.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        if (tasaInteres == null || tasaInteres.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal tasaDecimal = tasaInteres.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal proporcionDias = new BigDecimal(dias).divide(new BigDecimal("30"), 4, RoundingMode.HALF_UP);

        return saldoPendiente
                .multiply(tasaDecimal)
                .multiply(proporcionDias)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calcularMora(BigDecimal saldoPendiente, BigDecimal tasaMora, int diasMora) {
        if (saldoPendiente == null || saldoPendiente.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        if (tasaMora == null || tasaMora.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        if (diasMora <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal tasaDecimal = tasaMora.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        return saldoPendiente
                .multiply(tasaDecimal)
                .multiply(new BigDecimal(diasMora))
                .setScale(2, RoundingMode.HALF_UP);
    }

    @Transactional
    public Credito procesarCalculoIntereses(Credito credito) {
        if (credito.getEstado() != EstadoCredito.ACTIVO && credito.getEstado() != EstadoCredito.VENCIDO) {
            return credito;
        }

        if (credito.getSaldoPendiente() == null || credito.getSaldoPendiente().compareTo(BigDecimal.ZERO) <= 0) {
            return credito;
        }

        LocalDate hoy = LocalDate.now();
        LocalDate fechaVencimiento = credito.getFechaVencimiento();
        MetodoPagoCredito metodoPago = credito.getMetodoPago();

        // 1. CALCULAR INTERÉS NORMAL
        BigDecimal interesCalculado = BigDecimal.ZERO;
        LocalDate fechaUltimoCalculo = credito.getFechaUltimoCalculoInteres();

        if (fechaUltimoCalculo != null) {
            int diasDesdeUltimoCalculo = (int) ChronoUnit.DAYS.between(fechaUltimoCalculo, hoy);
            int diasPorPeriodo = getDiasPorMetodoPago(metodoPago);

            if (diasDesdeUltimoCalculo >= diasPorPeriodo) {
                int periodos = diasDesdeUltimoCalculo / diasPorPeriodo;
                BigDecimal saldoActual = credito.getSaldoPendiente();

                for (int i = 0; i < periodos; i++) {
                    BigDecimal interesPeriodo = calcularInteresPeriodo(
                            saldoActual,
                            credito.getTasaInteres(),
                            diasPorPeriodo
                    );
                    interesCalculado = interesCalculado.add(interesPeriodo);
                    saldoActual = saldoActual.add(interesPeriodo);
                }
                credito.setFechaUltimoCalculoInteres(hoy);
            }
        } else {
            LocalDate fechaInicio = credito.getFechaInicio();
            if (fechaInicio != null) {
                int diasDesdeInicio = (int) ChronoUnit.DAYS.between(fechaInicio, hoy);
                int diasPorPeriodo = getDiasPorMetodoPago(metodoPago);

                if (diasDesdeInicio >= diasPorPeriodo) {
                    int periodos = diasDesdeInicio / diasPorPeriodo;
                    BigDecimal saldoActual = credito.getSaldoPendiente();

                    for (int i = 0; i < periodos; i++) {
                        BigDecimal interesPeriodo = calcularInteresPeriodo(
                                saldoActual,
                                credito.getTasaInteres(),
                                diasPorPeriodo
                        );
                        interesCalculado = interesCalculado.add(interesPeriodo);
                        saldoActual = saldoActual.add(interesPeriodo);
                    }
                    credito.setFechaUltimoCalculoInteres(hoy);
                } else {
                    return credito;
                }
            }
        }

        // 2. CALCULAR MORA
        BigDecimal moraCalculada = BigDecimal.ZERO;
        if (fechaVencimiento != null && hoy.isAfter(fechaVencimiento)) {
            int diasMora = (int) ChronoUnit.DAYS.between(fechaVencimiento, hoy);
            if (diasMora > 0) {
                credito.setDiasMora(diasMora);
                moraCalculada = calcularMora(
                        credito.getSaldoPendiente().add(interesCalculado),
                        credito.getTasaMora(),
                        diasMora
                );
            }
        }

        // 3. ACTUALIZAR CRÉDITO
        if (interesCalculado.compareTo(BigDecimal.ZERO) > 0 || moraCalculada.compareTo(BigDecimal.ZERO) > 0) {
            credito.setMontoInteresAcumulado(
                    credito.getMontoInteresAcumulado() != null ?
                            credito.getMontoInteresAcumulado().add(interesCalculado) :
                            interesCalculado
            );

            credito.setMontoMoraAcumulado(
                    credito.getMontoMoraAcumulado() != null ?
                            credito.getMontoMoraAcumulado().add(moraCalculada) :
                            moraCalculada
            );

            BigDecimal nuevoSaldo = credito.getSaldoPendiente()
                    .add(interesCalculado)
                    .add(moraCalculada);
            credito.setSaldoPendiente(nuevoSaldo);

            if (moraCalculada.compareTo(BigDecimal.ZERO) > 0) {
                credito.setEstado(EstadoCredito.VENCIDO);
            }

            log.info("Crédito {} actualizado: Interés=${}, Mora=${}, Nuevo Saldo=${}",
                    credito.getFolioCredito(),
                    interesCalculado,
                    moraCalculada,
                    nuevoSaldo);

            return creditoRepository.save(credito);
        }

        return credito;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void procesarInteresesTodosLosCreditos() {
        log.info("=== INICIANDO CÁLCULO DE INTERESES PARA TODOS LOS CRÉDITOS ===");

        List<Credito> creditosActivos = creditoRepository.findByEstado(EstadoCredito.ACTIVO);
        int procesados = 0;
        int conCambios = 0;

        for (Credito credito : creditosActivos) {
            try {
                Credito actualizado = procesarCalculoIntereses(credito);
                procesados++;
                if (!actualizado.equals(credito)) {
                    conCambios++;
                }
            } catch (Exception e) {
                log.error("Error procesando crédito {}: {}", credito.getFolioCredito(), e.getMessage());
            }
        }

        log.info("=== CÁLCULO FINALIZADO: {} créditos procesados, {} con cambios ===",
                procesados, conCambios);
    }

    @Transactional
    public int procesarInteresesManual() {
        log.info("=== EJECUTANDO CÁLCULO DE INTERESES MANUAL ===");
        List<Credito> creditosActivos = creditoRepository.findByEstado(EstadoCredito.ACTIVO);
        int contador = 0;

        for (Credito credito : creditosActivos) {
            try {
                Credito actualizado = procesarCalculoIntereses(credito);
                if (!actualizado.equals(credito)) {
                    contador++;
                }
            } catch (Exception e) {
                log.error("Error: {}", e.getMessage());
            }
        }

        return contador;
    }
}