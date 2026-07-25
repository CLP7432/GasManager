package com.gasmanager.users.entities.security;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "permiso")
@Getter
@Setter
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso")
    private Integer idPermiso;

    @NotBlank
    @Column(name = "codigo_permiso", unique = true, nullable = false)
    private String codigoPermiso;

    @Column(name = "nombre_permiso")
    private String nombrePermiso;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "activo")
    private boolean activo = true;

    public Permiso() {
    }

    public Permiso(String codigoPermiso, String nombrePermiso, String descripcion) {
        this.codigoPermiso = codigoPermiso;
        this.nombrePermiso = nombrePermiso;
        this.descripcion = descripcion;
    }
}
