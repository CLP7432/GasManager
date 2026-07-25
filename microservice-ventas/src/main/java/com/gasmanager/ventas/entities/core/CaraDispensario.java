package com.gasmanager.ventas.entities.core;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "caras_dispensario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaraDispensario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispensario_id", nullable = false)
    @JsonIgnoreProperties({"caras", "hibernateLazyInitializer"})
    private Dispensario dispensario;

    @Column(name = "codigo", nullable = false, length = 10)
    private String codigo;

    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "activo")
    private Boolean activo = true;

    @OneToMany(mappedBy = "cara", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnoreProperties({"cara", "hibernateLazyInitializer"})
    private List<Manguera> mangueras = new ArrayList<>();

    public void addManguera(Manguera manguera) {
        mangueras.add(manguera);
        manguera.setCara(this);
    }
}