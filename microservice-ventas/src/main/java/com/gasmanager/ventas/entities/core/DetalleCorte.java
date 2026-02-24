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

    //Relacion con Corte
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "corte_turno_id", nullable = false)
    private CorteTurno corteTurno;

    //Tipo de Detalle
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 30)
    private TipoDetalleCorteEnum tipo; //Venta, gasto, ajuste, diferencia

    @Column(name = "descripcion", nullable = false, length = 200)
    private String descripcion;

    //Valores Monetarios
    @Column(name = "monto_esperado", precision = 10, scale = 2)
    private BigDecimal montoEsperado;

    @Column(name = "monto_real", precision = 10, scale = 2)
    private BigDecimal montoReal;

    @Column(name = "diferencia", precision = 10, scale = 2)
    private BigDecimal diferencia;

    //Informacion Adicional

    @Column(name = "referencia", length = 50)
    private String referencia;  //numero de venta, folio, etc

    @Column(name = "coprobante_path", length = 255)
    private String comprobantePath; //Ruta a imagen PDF del comprobante

    @Column(name = "onservaciones", columnDefinition = "TEXT")
    private String observaciones;

    //Auditoria
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime cratedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    //Metodo para la relacion
    public void setCorteTurno(CorteTurno corteTurno) {
        this.corteTurno = corteTurno;
        if(corteTurno != null && !corteTurno.getDetalles().contains(this)) {
            corteTurno.getDetalles().add(this);
        }
    }





}
