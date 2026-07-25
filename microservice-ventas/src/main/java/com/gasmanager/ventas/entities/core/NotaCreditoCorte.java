package com.gasmanager.ventas.entities.core;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "notas_credito_corte")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotaCreditoCorte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "corte_turno_id", nullable = false)
    private CorteTurnoDetallado corteTurno;

    @Column(name = "folio_nota", nullable = false, length = 50)
    private String folioNota;

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
}