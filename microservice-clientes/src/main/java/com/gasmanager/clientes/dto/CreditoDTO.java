package com.gasmanager.clientes.dto;

import com.gasmanager.clientes.enums.EstadoCredito;
import com.gasmanager.clientes.enums.MetodoPagoCredito;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreditoDTO {

    private Long id;
    private String folioCredito;
    private Long clienteId;
    private String clienteNombre;

    // Montos
    private BigDecimal montoTotal;
    private BigDecimal montoPagado;
    private BigDecimal saldoPendiente;

    // Intereses y mora
    private Integer plazoMeses;
    private BigDecimal tasaInteres;
    private BigDecimal tasaMora;
    private BigDecimal montoInteres;
    private BigDecimal montoInteresAcumulado;
    private BigDecimal montoMoraAcumulado;
    private Integer diasMora;

    // Total calculado (solo para UI, no se guarda en BD)
    private BigDecimal totalConIntereses;

    // Fechas
    private LocalDate fechaInicio;
    private LocalDate fechaVencimiento;
    private LocalDate fechaUltimoPago;

    // Estado y configuración
    private EstadoCredito estado;
    private MetodoPagoCredito metodoPago;
    private Integer diaPago;
    private String notas;

    // Relaciones
    private List<AbonoCreditoDTO> abonos;

    // Auditoría
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}