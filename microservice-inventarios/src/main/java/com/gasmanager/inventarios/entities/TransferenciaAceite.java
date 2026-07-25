package com.gasmanager.inventarios.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "transferencias_aceites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferenciaAceite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "folio", unique = true, nullable = false, length = 50)
    private String folio;

    @Column(name = "aceite_id", nullable = false)
    private Long aceiteId;

    @Column(name = "aceite_nombre", nullable = false, length = 100)
    private String aceiteNombre;

    @Column(name = "dispensario_origen_id")
    private Long dispensarioOrigenId;

    @Column(name = "dispensario_destino_id", nullable = false)
    private Long dispensarioDestinoId;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "tipo", nullable = false, length = 30)
    private String tipo;

    @Column(name = "motivo", length = 200)
    private String motivo;

    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDateTime fechaMovimiento;

    @Column(name = "realizado_por_id")
    private Long realizadoPorId;

    @Column(name = "realizado_por_nombre", length = 100)
    private String realizadoPorNombre;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    // ⚠️ NO @Version AQUÍ

    @PrePersist
    protected void onCreate() {
        if (fechaMovimiento == null) {
            fechaMovimiento = LocalDateTime.now();
        }
    }
}