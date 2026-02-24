package com.gasmanager.users.entities.security;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "permiso")
@Getter
@Setter
public class Permiso {

    public Permiso() {
    }

    public Permiso(String codigoPermiso, String nombrePermiso, String descripcion) {
        this.codigoPermiso = codigoPermiso;
        this.nombrePermiso = nombrePermiso;
        this.descripcion = descripcion;
    }

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
    private LocalDate fechaCreacion = LocalDate.now();

    @Column(name = "activo")
    private boolean activo = true;


}
