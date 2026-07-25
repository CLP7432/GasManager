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
@Table(name = "aceites_bodega")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AceiteBodega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aceite_id", nullable = false)
    private Long aceiteId;

    @Column(name = "codigo", nullable = false, length = 50)
    private String codigo;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "stock_actual", nullable = false)
    private Integer stockActual = 0;

    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo = 5;

    @Column(name = "stock_maximo", nullable = false)
    private Integer stockMaximo = 100;

    @Column(name = "precio_compra", precision = 10, scale = 2)
    private BigDecimal precioCompra;

    @Column(name = "precio_venta", precision = 10, scale = 2)
    private BigDecimal precioVenta;

    @Column(name = "proveedor", length = 100)
    private String proveedor;

    @Column(name = "ubicacion", length = 50)
    private String ubicacion;

    @Column(name = "activo")
    private Boolean activo = true;

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

    // ⚠️ @Version ELIMINADO - NO USAR CONTROL DE CONCURRENCIA

    public boolean isStockBajo() {
        return stockActual <= stockMinimo;
    }

    public boolean isStockCritico() {
        return stockActual <= (stockMinimo / 2);
    }

    public boolean isStockDisponible(Integer cantidad) {
        return stockActual >= cantidad;
    }
}