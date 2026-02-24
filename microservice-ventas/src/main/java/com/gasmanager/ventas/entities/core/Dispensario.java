package com.gasmanager.ventas.entities.core;

import com.gasmanager.ventas.enums.EstadoDispensarioEnum;
import com.gasmanager.ventas.enums.TipoCombustibleEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispensarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dispensario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero", nullable = false, unique = true, length = 10)
    private String numero;

    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_combustible", length = 30)
    private TipoCombustibleEnum tipoCombustible;

    @Column(name = "ubicacion", length = 100)
    private String ubicacion;

    //Estado y Operacion
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 20)
    private EstadoDispensarioEnum estado;

    @Column(name = "ultima_calibracion")
    private LocalDateTime ultimaCalibracion;

    @Column(name = "proxima_calibracion")
    private LocalDateTime proximaCalibracion;

    //Configuracion
    @Column(name = "capacidad_tanque", precision = 10, scale = 3)
    private BigDecimal capacidadTanque;

    @Column(name = "mangueras")
    private Integer mangueras; //numero de mangueras

    @Column(name = "lectura_inicial", precision = 10, scale = 3)
    private BigDecimal lecturaInicial; //lectura del medidor al inicio del dia

    @Column(name = "lectura_actual", precision = 10, scale = 3)
    private BigDecimal lecturaActual; //lectura actual del medidor

    //Capos de Auditoria
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



}
