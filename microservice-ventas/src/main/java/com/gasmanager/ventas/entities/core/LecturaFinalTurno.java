package com.gasmanager.ventas.entities.core;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lecturas_finales_turno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LecturaFinalTurno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_id", nullable = false)
    private Turno turno;

    @Column(name = "manguera_id")
    private Long mangueraId;

    @Column(name = "manguera_nombre", length = 50)
    private String mangueraNombre;

    @Column(name = "tipo_combustible", length = 30)
    private String tipoCombustible;

    @Column(name = "lectura_final", precision = 10, scale = 3)
    private BigDecimal lecturaFinal;

    @Column(name = "aceite_id")
    private Long aceiteId;

    @Column(name = "aceite_nombre", length = 100)
    private String aceiteNombre;

    @Column(name = "cantidad_final")
    private Integer cantidadFinal;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}