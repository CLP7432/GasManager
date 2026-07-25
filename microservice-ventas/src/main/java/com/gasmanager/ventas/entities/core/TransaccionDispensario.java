package com.gasmanager.ventas.entities.core;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacciones_dispensario")
@Getter
@Setter
public class TransaccionDispensario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long surtidorId;
    private String tipoCombustible;
    private BigDecimal litros;
    private BigDecimal total;
    private LocalDateTime fechaHora;
    private String estado; //INICIADA, EN_CURSO, COMPLETADA, DETENDIA
}
