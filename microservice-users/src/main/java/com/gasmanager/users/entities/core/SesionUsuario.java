package com.gasmanager.users.entities.core;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "sesion_usuario")
@Getter
@Setter
public class SesionUsuario {
    public SesionUsuario() {
    }

    public SesionUsuario(Integer idUsuario, String token) {
        this.idUsuario = idUsuario;
        this.token = token;
        this.fechaInicio = LocalDateTime.now();
        this.activo = true;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sesion")
    private Integer idSesion;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "token", unique = true)
    private String token;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "ultima_actividad")
    private LocalDateTime ultimaActividad;

    @Column(name = "fecha_expiracion")
    private LocalDateTime fechaExpiracion;

    @Column(name = "activo")
    private boolean activo;

    @Column(name = "origen")
    private String origen;



}
