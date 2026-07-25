package com.gasmanager.ventas.entities.core;

import com.gasmanager.ventas.enums.TipoDetalleCorteEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "detalles_corte")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleCorte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "corte_turno_id", nullable = false)
    private CorteTurno corteTurno;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 30)
    private TipoDetalleCorteEnum tipo;

    @Column(name = "descripcion", nullable = false, length = 200)
    private String descripcion;

    @Column(name = "monto_esperado", precision = 10, scale = 2)
    private BigDecimal montoEsperado;

    @Column(name = "monto_real", precision = 10, scale = 2)
    private BigDecimal montoReal;

    @Column(name = "diferencia", precision = 10, scale = 2)
    private BigDecimal diferencia;

    @Column(name = "referencia", length = 50)
    private String referencia;

    @Column(name = "comprobante_path", length = 255)
    private String comprobantePath;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "created_at", updatable = false)  // ← CORREGIDO
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")  // ← CORREGIDO
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_by", length = 50)  // ← CORREGIDO (en BD es varchar(255) pero funciona)
    private String updatedBy;

    public void setCorteTurno(CorteTurno corteTurno) {
        this.corteTurno = corteTurno;
        if(corteTurno != null && !corteTurno.getDetalles().contains(this)) {
            corteTurno.getDetalles().add(this);
        }
    }
}