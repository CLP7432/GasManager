package com.gasmanager.ventas.entities.core;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

@Entity
@Table(name = "mangueras")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Manguera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cara_id", nullable = false)
    @JsonIgnoreProperties({"mangueras", "dispensario", "hibernateLazyInitializer"})
    private CaraDispensario cara;

    @Column(name = "codigo", nullable = false, length = 20)
    private String codigo;

    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "tipo_combustible", nullable = false, length = 20)
    private String tipoCombustible;

    @Column(name = "combustible_id")
    private Long combustibleId;

    @Column(name = "lectura_actual", precision = 10, scale = 3)
    private BigDecimal lecturaActual = BigDecimal.ZERO;

    @Column(name = "activo")
    private Boolean activo = true;
}