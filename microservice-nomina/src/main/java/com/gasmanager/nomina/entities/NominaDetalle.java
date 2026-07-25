package com.gasmanager.nomina.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "nominas_detalle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NominaDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nomina_id", nullable = false)
    private Nomina nomina;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Column(name = "dias_trabajados", precision = 10, scale = 2)
    private BigDecimal diasTrabajados;

    @Column(name = "sueldo_base", precision = 12, scale = 2)
    private BigDecimal sueldoBase;

    @Column(name = "horas_extras", precision = 10, scale = 2)
    private BigDecimal horasExtras;

    @Column(name = "horas_extras_monto", precision = 12, scale = 2)
    private BigDecimal horasExtrasMonto;

    @Column(name = "faltas", precision = 10, scale = 2)
    private BigDecimal faltas;

    @Column(name = "faltas_descuento", precision = 12, scale = 2)
    private BigDecimal faltasDescuento;

    @Column(name = "bonos", precision = 12, scale = 2)
    private BigDecimal bonos;

    @Column(name = "total_gravado", precision = 12, scale = 2)
    private BigDecimal totalGravado;

    @Column(name = "isr", precision = 12, scale = 2)
    private BigDecimal isr;

    @Column(name = "cuota_sindical", precision = 12, scale = 2)
    private BigDecimal cuotaSindical;

    @Column(name = "seguro_social", precision = 12, scale = 2)
    private BigDecimal seguroSocial;

    @Column(name = "infonavit", precision = 12, scale = 2)
    private BigDecimal infonavit;

    @Column(name = "otras_deducciones", precision = 12, scale = 2)
    private BigDecimal otrasDeducciones;

    @Column(name = "total_deducciones", precision = 12, scale = 2)
    private BigDecimal totalDeducciones;

    @Column(name = "neto_pagar", precision = 12, scale = 2)
    private BigDecimal netoPagar;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}