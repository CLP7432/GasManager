package com.gasmanager.ventas.entities.core;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gasmanager.ventas.enums.TipoProductoEnum;
import com.gasmanager.ventas.enums.UnidadMedidaEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "detalles_venta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false)
    @JsonIgnoreProperties({"detalles", "turno"})
    private Venta venta;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_producto", nullable = false, length = 30)
    private TipoProductoEnum tipoProducto;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(name = "producto_nombre", nullable = false, length = 100)
    private String productoNombre;

    @Column(name = "producto_codigo", length = 50)
    private String productoCodigo;

    @Column(name = "cantidad", nullable = false, precision = 10, scale = 3)
    private BigDecimal cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(name = "importe", nullable = false, precision = 10, scale = 2)
    private BigDecimal importe;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_medida", length = 20)
    private UnidadMedidaEnum unidadMedida;

    @Column(name = "created_at", updatable = false)  // ← CORREGIDO
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")  // ← CORREGIDO
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void setVenta(Venta venta) {
        this.venta = venta;
        if (venta != null && !venta.getDetalles().contains(this)) {
            venta.getDetalles().add(this);
        }
    }
}