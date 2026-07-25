package com.gasmanager.lealtad.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cuenta_puntos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CuentaPuntos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long ventaId;
    private int saldoPuntos;
}
