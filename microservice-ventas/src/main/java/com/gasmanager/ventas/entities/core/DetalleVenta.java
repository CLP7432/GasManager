package com.gasmanager.ventas.entities.core;

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

    //Relacion con la Venta

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false)
    private Venta venta;

    //Informacion del Producto
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_producto", nullable = false, length = 30)
    private TipoProductoEnum tipoProducto;

    //ID del producto en el modulo de inventarios
    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    //Nombre cacheado para evitar joins constantes
    @Column(name = "producto_nombre", nullable = false, length = 100)
    private String productoNombre;

    //codigo SKU o identificador unico
    @Column(name = "producto_codigo", length = 50)
    private String productoCodigo;

    //Cantidad y Precio
    @Column(name = "cantidad", nullable = false, precision = 10, scale = 3)
    private BigDecimal cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    //Calculado automaticamente: cantidad * precioUnitario
    @Column(name = "importe", nullable = false, precision = 10, scale = 2)
    private BigDecimal importe;

    //UNIDADES de MEDIDA
    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_medida", length = 20)
    private UnidadMedidaEnum unidadMedida;  //Litros, Unidades,

    //Campos para Auditoria
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    //Metodo para establecer la relacion bidireccional
    public void setVenta(Venta venta) {
        this.venta = venta;
        if(venta != null && !venta.getDetalles().contains(this)) {
            venta.getDetalles().add(this);
        }
    }


}











