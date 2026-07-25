package com.gasmanager.lealtad.entities;

import com.gasmanager.lealtad.enums.TipoRecompensa;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recompensas")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recompensas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String descripcion;
    private int costoPuntos;

    @Enumerated(EnumType.STRING)
    private TipoRecompensa tipo;

    private boolean activo;
}
