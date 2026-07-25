package com.gasmanager.inventarios.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "compras_aceites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompraAceite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "folio", unique = true, nullable = false, length = 50)
    private String folio;

    @Column(name = "aceite_id", nullable = false)
    private Long aceiteId;

    @Column(name = "aceite_nombre", nullable = false, length = 100)
    private String aceiteNombre;

    @Column(name = "proveedor", length = 100)
    private String proveedor;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(name = "subtotal", precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "iva", precision = 12, scale = 2)
    private BigDecimal iva;

    @Column(name = "total", precision = 12, scale = 2)
    private BigDecimal total;

    @Column(name = "factura", length = 50)
    private String factura;

    @Column(name = "fecha_compra", nullable = false)
    private LocalDateTime fechaCompra;

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
        if (fechaCompra == null) {
            fechaCompra = LocalDateTime.now();
        }
    }
}