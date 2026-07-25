package com.gasmanager.ventas.entities.core;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gasmanager.ventas.enums.EstadoVenta;
import com.gasmanager.ventas.enums.MetodoPagoEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ventas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "folio", unique = true, nullable = false, length = 50)
    private String folio;

    @Column(name = "fecha_hora", nullable = false)
    @CreationTimestamp
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoVenta estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false, length = 20)
    private MetodoPagoEnum metodoPago;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "iva", nullable = false, precision = 10, scale = 2)
    private BigDecimal iva;

    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "despachador_id", nullable = false)
    private Long despachadorId;

    @Column(name = "despachador_nombre", length = 100)
    private String despachadorNombre;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "cliente_nombre", length = 150)
    private String clienteNombre;

    @Column(name = "cliente_rfc", length = 13)
    private String clienteRfc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_id", nullable = false)
    @JsonIgnoreProperties({"ventas", "detalles"})
    private Turno turno;

    @Transient
    private Long turnoId;

    @Column(name = "surtidor_id", nullable = false)
    private Integer surtidorId;

    @Column(name = "surtidor_numero", length = 10)
    private String surtidorNumero;

    @Column(name = "facturada")
    private Boolean facturada = false;

    @Column(name = "folio_factura", length = 50)
    private String folioFactura;

    @Column(name = "es_credito")
    private Boolean esCredito = false;

    @Column(name = "credito_id")
    private Long creditoId;

    @Column(name = "puntos_obtenidos")
    private Integer puntosObtenidos = 0;

    @Column(name = "puntos_canjeados")
    private Integer puntosCanjeados = 0;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("venta")
    @Builder.Default
    private List<DetalleVenta> detalles = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @Version
    private Long version;

    @Column(name = "dispensario_id")
    private Integer dispensarioId;

    public void addDetalle(DetalleVenta detalle) {
        detalles.add(detalle);
        detalle.setVenta(this);
    }

    public void removeDetalle(DetalleVenta detalle) {
        detalles.remove(detalle);
        detalle.setVenta(null);
    }
}