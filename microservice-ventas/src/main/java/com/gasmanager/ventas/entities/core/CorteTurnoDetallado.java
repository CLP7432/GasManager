package com.gasmanager.ventas.entities.core;

import com.gasmanager.ventas.enums.EstadoCorteEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cortes_turno_detallado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CorteTurnoDetallado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_corte", unique = true, nullable = false, length = 30)
    private String codigoCorte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_id", nullable = false)
    private Turno turno;

    // ===== NUEVO: DISPENSARIO =====
    @Column(name = "dispensario_id")
    private Long dispensarioId;

    @Column(name = "dispensario_nombre", length = 100)
    private String dispensarioNombre;

    // ===== NUEVO: DESPACHADOR =====
    @Column(name = "despachador_id")
    private Long despachadorId;

    @Column(name = "despachador_nombre", length = 100)
    private String despachadorNombre;

    // Magna
    @Column(name = "magna_lectura_inicial", precision = 10, scale = 3)
    private BigDecimal magnaLecturaInicial;

    @Column(name = "magna_lectura_final", precision = 10, scale = 3)
    private BigDecimal magnaLecturaFinal;

    @Column(name = "magna_litros_vendidos", precision = 10, scale = 3)
    private BigDecimal magnaLitrosVendidos;

    @Column(name = "magna_precio", precision = 10, scale = 2)
    private BigDecimal magnaPrecio;

    @Column(name = "magna_importe", precision = 12, scale = 2)
    private BigDecimal magnaImporte;

    // Premium
    @Column(name = "premium_lectura_inicial", precision = 10, scale = 3)
    private BigDecimal premiumLecturaInicial;

    @Column(name = "premium_lectura_final", precision = 10, scale = 3)
    private BigDecimal premiumLecturaFinal;

    @Column(name = "premium_litros_vendidos", precision = 10, scale = 3)
    private BigDecimal premiumLitrosVendidos;

    @Column(name = "premium_precio", precision = 10, scale = 2)
    private BigDecimal premiumPrecio;

    @Column(name = "premium_importe", precision = 12, scale = 2)
    private BigDecimal premiumImporte;

    // Diesel
    @Column(name = "diesel_lectura_inicial", precision = 10, scale = 3)
    private BigDecimal dieselLecturaInicial;

    @Column(name = "diesel_lectura_final", precision = 10, scale = 3)
    private BigDecimal dieselLecturaFinal;

    @Column(name = "diesel_litros_vendidos", precision = 10, scale = 3)
    private BigDecimal dieselLitrosVendidos;

    @Column(name = "diesel_precio", precision = 10, scale = 2)
    private BigDecimal dieselPrecio;

    @Column(name = "diesel_importe", precision = 12, scale = 2)
    private BigDecimal dieselImporte;

    @Column(name = "total_combustibles_litros", precision = 10, scale = 3)
    private BigDecimal totalCombustiblesLitros;

    @Column(name = "total_combustibles_importe", precision = 12, scale = 2)
    private BigDecimal totalCombustiblesImporte;

    @OneToMany(mappedBy = "corteTurno", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetalleAceiteCorte> detallesAceites = new ArrayList<>();

    @Column(name = "total_aceites_importe", precision = 12, scale = 2)
    private BigDecimal totalAceitesImporte;

    @OneToMany(mappedBy = "corteTurno", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<NotaCreditoCorte> notasCredito = new ArrayList<>();

    @Column(name = "total_notas_credito", precision = 12, scale = 2)
    private BigDecimal totalNotasCredito;

    @Column(name = "total_ventas", precision = 12, scale = 2)
    private BigDecimal totalVentas;

    @Column(name = "total_efectivo", precision = 12, scale = 2)
    private BigDecimal totalEfectivo;

    @Column(name = "total_tarjeta", precision = 12, scale = 2)
    private BigDecimal totalTarjeta;

    @Column(name = "total_transferencia", precision = 12, scale = 2)
    private BigDecimal totalTransferencia;

    @Column(name = "total_credito", precision = 12, scale = 2)
    private BigDecimal totalCredito;

    @Column(name = "efectivo_que_debe_entregar", precision = 12, scale = 2)
    private BigDecimal efectivoQueDebeEntregar;

    @Column(name = "diferencia", precision = 12, scale = 2)
    private BigDecimal diferencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 20)
    private EstadoCorteEnum estado;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void addDetalleAceite(DetalleAceiteCorte detalle) {
        detallesAceites.add(detalle);
        detalle.setCorteTurno(this);
    }

    public void addNotaCredito(NotaCreditoCorte nota) {
        notasCredito.add(nota);
        nota.setCorteTurno(this);
    }
}