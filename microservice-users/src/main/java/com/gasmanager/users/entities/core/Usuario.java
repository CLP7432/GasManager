package com.gasmanager.users.entities.core;

import com.gasmanager.users.entities.security.Rol;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;

    @NotBlank
    private String nombre;

    @NotBlank
    @Column(unique = true)
    private String correo;

    @NotBlank
    private String password;

    private LocalDateTime fechaCreacion = LocalDateTime.now();
    private LocalDateTime ultimoAcceso;

    private boolean activo = true;
    private int intentosFallidos = 0;
    private boolean bloqueado = false;

    @Enumerated(EnumType.STRING)
    private EstadoUsuario estado;

    @ManyToOne
    @Enumerated(EnumType.STRING)
    private Rol rol;



}
