package com.gasmanager.ventas.entities.core;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "notas_credito_turno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotaCreditoTurno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_id", nullable = false)
    private Turno turno;

    @Column(name = "folio_nota", nullable = false, length = 50)
    private String folioNota;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "cliente_nombre", length = 150)
    private String clienteNombre;

    @Column(name = "tipo_combustible", length = 30)
    private String tipoCombustible;

    @Column(name = "litros", precision = 10, scale = 3)
    private BigDecimal litros;

    @Column(name = "monto", precision = 12, scale = 2)
    private BigDecimal monto;

    @Column(name = "autorizado_por", length = 100)
    private String autorizadoPor;

    @Column(name = "vehiculo_placas", length = 20)
    private String vehiculoPlacas;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}