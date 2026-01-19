package com.gasmanager.users.entities.security;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPermiso;

    @NotBlank
    @Column(unique = true)
    private String codigoPermiso;

    private String nombrePermiso;
    private String descripcion;
    private LocalDate fechaCreacion = LocalDate.now();
    private boolean activo = true;


}
