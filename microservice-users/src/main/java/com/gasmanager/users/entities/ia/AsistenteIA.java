package com.gasmanager.users.entities.ia;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class AsistenteIA {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAsistente;

    private String modeloIA;
    private String contextoActual;

    @ElementCollection
    private List<String> historiaConversacion;

}
