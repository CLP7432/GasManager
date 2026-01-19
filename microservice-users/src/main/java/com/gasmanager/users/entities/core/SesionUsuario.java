package com.gasmanager.users.entities.core;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class SesionUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSesion;

    private Integer idUsuario;

    @Column(unique = true)
    private String token;

    private LocalDateTime fechaInicio;
    private LocalDateTime ultimaActividad;
    private LocalDateTime fechaExpiracion;

    private boolean activo;
    private String origen;



}
