package com.gasmanager.inventarios.entities;

import com.gasmanager.inventarios.enums.TipoCombustible;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventario_combustible")
public class InventarioCombustible {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_combustible", nullable = false, unique = true)
    private TipoCombustible tipoCombustible;

    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "capacidad_tanque", precision = 10, scale = 3)
    private BigDecimal capacidadTanque;

    @Column(name = "stock_actual", nullable = false, precision = 10, scale = 3)
    private BigDecimal stockActual = BigDecimal.ZERO;

    @Column(name = "stock_minimo", precision = 10, scale = 3)
    private BigDecimal stockMinimo;

    @Column(name = "ultima_lectura")
    private LocalDateTime ultimaLectura;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @Version
    private Long version;

    // Constructor vacío
    public InventarioCombustible() {}

    // Constructor con campos obligatorios
    public InventarioCombustible(TipoCombustible tipoCombustible, String nombre, BigDecimal capacidadTanque) {
        this.tipoCombustible = tipoCombustible;
        this.nombre = nombre;
        this.capacidadTanque = capacidadTanque;
        this.stockActual = BigDecimal.ZERO;
        this.activo = true;
    }

    // Constructor completo
    public InventarioCombustible(TipoCombustible tipoCombustible, String nombre, BigDecimal capacidadTanque,
                                 BigDecimal stockActual, BigDecimal stockMinimo, Boolean activo) {
        this.tipoCombustible = tipoCombustible;
        this.nombre = nombre;
        this.capacidadTanque = capacidadTanque;
        this.stockActual = stockActual != null ? stockActual : BigDecimal.ZERO;
        this.stockMinimo = stockMinimo;
        this.activo = activo != null ? activo : true;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoCombustible getTipoCombustible() {
        return tipoCombustible;
    }

    public void setTipoCombustible(TipoCombustible tipoCombustible) {
        this.tipoCombustible = tipoCombustible;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getCapacidadTanque() {
        return capacidadTanque;
    }

    public void setCapacidadTanque(BigDecimal capacidadTanque) {
        this.capacidadTanque = capacidadTanque;
    }

    public BigDecimal getStockActual() {
        return stockActual;
    }

    public void setStockActual(BigDecimal stockActual) {
        this.stockActual = stockActual;
    }

    public BigDecimal getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(BigDecimal stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public LocalDateTime getUltimaLectura() {
        return ultimaLectura;
    }

    public void setUltimaLectura(LocalDateTime ultimaLectura) {
        this.ultimaLectura = ultimaLectura;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    // Métodos JPA
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Métodos de negocio
    public boolean isStockBajo() {
        if (stockMinimo == null) return false;
        return stockActual.compareTo(stockMinimo) <= 0;
    }

    public boolean isTanqueLleno() {
        if (capacidadTanque == null) return false;
        return stockActual.compareTo(capacidadTanque) >= 0;
    }

    public BigDecimal getPorcentajeOcupacion() {
        if (capacidadTanque == null || capacidadTanque.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return stockActual.multiply(new BigDecimal("100")).divide(capacidadTanque, 2, java.math.RoundingMode.HALF_UP);
    }

    @Override
    public String toString() {
        return "InventarioCombustible{" +
                "id=" + id +
                ", tipoCombustible=" + tipoCombustible +
                ", nombre='" + nombre + '\'' +
                ", stockActual=" + stockActual +
                ", stockMinimo=" + stockMinimo +
                ", activo=" + activo +
                '}';
    }
}