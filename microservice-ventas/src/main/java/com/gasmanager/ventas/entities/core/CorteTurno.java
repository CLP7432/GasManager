package com.gasmanager.ventas.entities.core;

import com.gasmanager.ventas.enums.EstadoCorteEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cortes_turno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CorteTurno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_corte", unique = true, nullable = false, length = 30)
    private String codigoCorte;

    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "fecha_corte", nullable = false)
    private LocalDateTime fechaCorte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_id", nullable = false)
    private Turno turno;

    @Column(name = "turno_codigo", nullable = false, length = 20)
    private String turnoCodigo;

    @Column(name = "total_ventas", precision = 12, scale = 2)
    private BigDecimal totalVentas;

    @Column(name = "total_efectivo_reporte", precision = 12, scale = 2)
    private BigDecimal totalEfectivoReporte;

    @Column(name = "total_efectivo_real", precision = 12, scale = 2)
    private BigDecimal totalEfectivoReal;

    @Column(name = "diferencia_efectivo", precision = 10, scale = 2)
    private BigDecimal diferenciaEfectivo;

    @Column(name = "total_tarjeta", precision = 12, scale = 2)
    private BigDecimal totalTarjeta;

    @Column(name = "total_transferencia", precision = 12, scale = 2)
    private BigDecimal totalTransferencia;

    @Column(name = "total_credito", precision = 12, scale = 2)
    private BigDecimal totalCredito;

    @Column(name = "inventario_inicial_gasolina", precision = 10, scale = 3)
    private BigDecimal inventarioInicialGasolina;

    @Column(name = "inventario_final_gasolina", precision = 10, scale = 3)
    private BigDecimal inventarioFinalGasolina;

    @Column(name = "ventas_gasolina", precision = 10, scale = 3)
    private BigDecimal ventasGasolina;

    @Column(name = "diferencia_inventario", precision = 10, scale = 3)
    private BigDecimal diferenciaInventario;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 20)
    private EstadoCorteEnum estado;

    @Column(name = "validado_por")
    private Long validadoPor;

    @Column(name = "numero_ventas")
    private Integer numeroVentas;

    @Column(name = "validado_nombre", length = 100)
    private String validadoNombre;

    @Column(name = "fecha_validacion")
    private LocalDateTime fechaValidacion;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "reporte_pdf_path", length = 255)
    private String reportePdfPath;

    @Column(name = "reporte_excel_path", length = 255)
    private String reporteExcelPath;

    @OneToMany(mappedBy = "corteTurno", cascade = CascadeType.ALL)
    @Builder.Default
    private List<DetalleCorte> detalles = new ArrayList<>();

    @Column(name = "created_at", updatable = false)  // ← CORREGIDO
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")  // ← CORREGIDO
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_by", length = 50)  // ← CORREGIDO
    private String updatedBy;

    @Version
    private Long version;

    public void addDetalle(DetalleCorte detalle) {
        detalles.add(detalle);
        detalle.setCorteTurno(this);
    }

    public void removeDetalle(DetalleCorte detalle) {
        detalles.remove(detalle);
        detalle.setCorteTurno(null);
    }
}