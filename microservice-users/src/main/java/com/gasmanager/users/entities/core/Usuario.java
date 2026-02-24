package com.gasmanager.users.entities.core;

import com.gasmanager.users.entities.security.Rol;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Entity

@Getter
@Setter
@Table(name = "usuario")
public class Usuario {

    public Usuario() {}

    public Usuario(String nombre, String correo, String password, Rol rol) {
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
        this.rol = rol;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @NotBlank
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @NotBlank
    @Column(name = "correo", nullable = false,  unique = true)
    private String correo;

    @NotBlank
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    @Column(name = "activo")
    private boolean activo = true;

    @Column(name = "intentos_fallidos")
    private int intentosFallidos = 0;

    @Column(name = "bloqueado")
    private boolean bloqueado = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoUsuario estado = EstadoUsuario.ACTIVO;

    @ManyToOne
    @JoinColumn(name = "rol_id", referencedColumnName = "id_rol")
    private Rol rol;




}
