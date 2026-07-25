package com.gasmanager.inventarios.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "precios_historicos")
public class PrecioHistorico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combustible_id", nullable = false)
    private Combustible combustible;

    @Column(name = "precio_anterior", precision = 10, scale = 2)
    private BigDecimal precioAnterior;

    @Column(name = "precio_nuevo", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioNuevo;

    @Column(name = "fecha_cambio", nullable = false)
    private LocalDateTime fechaCambio;

    @Column(name = "motivo_cambio", length = 200)
    private String motivoCambio;

    @Column(name = "cambiado_por", length = 50)
    private String cambiadoPor;

    @Column(name = "cambiado_por_id")
    private Long cambiadoPorId;

    public PrecioHistorico() {
    }

    public PrecioHistorico(
            Combustible combustible,
            BigDecimal precioAnterior,
            BigDecimal precioNuevo,
            LocalDateTime fechaCambio,
            String motivoCambio,
            String cambiadoPor,
            Long cambiadoPorId)
    {
        this.combustible = combustible;
        this.precioAnterior = precioAnterior;
        this.precioNuevo = precioNuevo;
        this.fechaCambio = fechaCambio;
        this.motivoCambio = motivoCambio;
        this.cambiadoPor = cambiadoPor;
        this.cambiadoPorId = cambiadoPorId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Combustible getCombustible() {
        return combustible;
    }

    public void setCombustible(Combustible combustible) {
        this.combustible = combustible;
    }

    public BigDecimal getPrecioAnterior() {
        return precioAnterior;
    }

    public void setPrecioAnterior(BigDecimal precioAnterior) {
        this.precioAnterior = precioAnterior;
    }

    public BigDecimal getPrecioNuevo() {
        return precioNuevo;
    }

    public void setPrecioNuevo(BigDecimal precioNuevo) {
        this.precioNuevo = precioNuevo;
    }

    public LocalDateTime getFechaCambio() {
        return fechaCambio;
    }

    public void setFechaCambio(LocalDateTime fechaCambio) {
        this.fechaCambio = fechaCambio;
    }

    public String getMotivoCambio() {
        return motivoCambio;
    }

    public void setMotivoCambio(String motivoCambio) {
        this.motivoCambio = motivoCambio;
    }

    public String getCambiadoPor() {
        return cambiadoPor;
    }

    public void setCambiadoPor(String cambiadoPor) {
        this.cambiadoPor = cambiadoPor;
    }

    public Long getCambiadoPorId() {
        return cambiadoPorId;
    }

    public void setCambiadoPorId(Long cambiadoPorId) {
        this.cambiadoPorId = cambiadoPorId;
    }
}
