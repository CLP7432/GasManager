package com.gasmanager.users.entities.core;

import com.gasmanager.users.entities.security.TipoAcccion;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class AuditoriaAccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAuditoria;

    private Integer idUsuarioEjecutor;

    @Enumerated(EnumType.STRING)
    private TipoAcccion tipoAcccion;

    private String descripcion;
    private String moduloAfectado;
    private LocalDateTime fechaHora;

    @Lob
    private String datosAnteriores;

    @Lob
    private String datosNuevos;

    private String origen;
}
