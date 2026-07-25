package com.gasmanager.ventas.entities.core;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalles_aceite_corte")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleAceiteCorte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "corte_turno_id", nullable = false)
    private CorteTurnoDetallado corteTurno;

    @Column(name = "aceite_id")
    private Long aceiteId;

    @Column(name = "aceite_nombre", length = 100)
    private String aceiteNombre;

    @Column(name = "cantidad_inicial")
    private Integer cantidadInicial;

    @Column(name = "cantidad_final")
    private Integer cantidadFinal;

    @Column(name = "cantidad_vendida")
    private Integer cantidadVendida;

    @Column(name = "precio_unitario", precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(name = "importe", precision = 12, scale = 2)
    private BigDecimal importe;
}