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

    //Relacion con el turno
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turno_id", nullable = false)
    private Turno turno;

    @Column(name = "turno_codigo", nullable = false, length = 20)
    private String turnoCodigo;

    //Totales
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

    // Inventario
    @Column(name = "inventario_inicial_gasolina", precision = 10, scale = 3)
    private BigDecimal inventarioInicialGasolina;

    @Column(name = "inventario_final_gasolina", precision = 10, scale = 3)
    private BigDecimal inventarioFinalGasolina;

    @Column(name = "ventas_gasolina", precision = 10, scale = 3)
    private BigDecimal ventasGasolina;

    @Column(name = "diferencia_inventario", precision = 10, scale = 3)
    private BigDecimal diferenciaInventario;

    //Estado y Validacion
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 20)
    private EstadoCorteEnum estado;  //pendiente, validado, conciliado, cerrado

    @Column(name = "validado_por")
    private Long validadoPor; //ID del supervisor que valido

    @Column(name = "validado_nombre", length = 100)
    private String validadoNombre;

    @Column(name = "fecha_validacion")
    private LocalDateTime fechaValidacion;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    //Archivos Adjuntos
    @Column(name = "reporte_pdf_path", length = 255)
    private String reportePdfPath; //Ruta del archivo PDF

    @Column(name = "reporte_excel_path", length = 255)
    private String reporteExcelPath;  //Ruta del archivo Excel

    // Detalles del Corte
    @OneToMany(mappedBy = "corteTurno", cascade = CascadeType.ALL)
    @Builder.Default
    private List<DetalleCorte> detalles = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_by", length = 50)
    private String updateBy;

    @Version
    private Long version;

    //Metodos Simples
    public void addDetalle(DetalleCorte detalle) {
        detalles.add(detalle);
        detalle.setCorteTurno(this);
    }

    public void removeDetalle(DetalleCorte detalle){
        detalles.remove(detalle);
        detalle.setCorteTurno(null);
    }


}
