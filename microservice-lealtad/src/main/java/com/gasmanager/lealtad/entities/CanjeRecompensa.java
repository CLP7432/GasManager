package com.gasmanager.lealtad.entities;

import com.gasmanager.lealtad.enums.EstadoCanje;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "canje_recompensa")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CanjeRecompensa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long ventaId;

    @ManyToOne
    @JoinColumn(name = "recompensa_id")
    private Recompensas recompensa;

    private LocalDateTime fechaCanje;
    private int puntosUsados;

    @Enumerated(EnumType.STRING)
    private EstadoCanje estado;
}
