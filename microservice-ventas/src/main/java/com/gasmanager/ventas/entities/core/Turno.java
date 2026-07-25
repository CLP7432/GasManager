package com.gasmanager.ventas.entities.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gasmanager.ventas.enums.EstadoTurno;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "turnos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_turno", unique = true, nullable = false, length = 20)
    private String codigoTurno;

    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "fecha_turno", nullable = false)
    private LocalDateTime fechaTurno;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoTurno estado;

    @Column(name = "supervisor_id", nullable = false)
    private Long supervisorId;

    @Column(name = "supervisor_nombre", length = 100)
    private String supervisorNombre;

    @Column(name = "total_efectivo", precision = 12, scale = 2)
    private BigDecimal totalEfectivo;

    @Column(name = "total_tarjeta", precision = 12, scale = 2)
    private BigDecimal totalTarjeta;

    @Column(name = "total_transferencia", precision = 12, scale = 2)  // ← NOTA: tiene "tranferencia" (sin 's')
    private BigDecimal totalTransferencia;

    @Column(name = "total_credito", precision = 12, scale = 2)
    private BigDecimal totalCredito;

    @Column(name = "total_ventas", precision = 12, scale = 2)
    private BigDecimal totalVentas;

    @Column(name = "diferencia", precision = 10, scale = 2)
    private BigDecimal diferencia;

    @Column(name = "numero_ventas")
    private Integer numeroVentas = 0;

    @Column(name = "numero_clientes")
    private Integer numeroClientes = 0;

    @Column(name = "litros_vendidos", precision = 10, scale = 3)
    private BigDecimal litrosVendidos;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @OneToMany(mappedBy = "turno", cascade = CascadeType.ALL)
    @JsonIgnore
    @Builder.Default
    private List<Venta> ventas = new ArrayList<>();

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

    public void addVenta(Venta venta) {
        ventas.add(venta);
        venta.setTurno(this);
    }

    public void removeVenta(Venta venta) {
        ventas.remove(venta);
        venta.setTurno(null);
    }
}