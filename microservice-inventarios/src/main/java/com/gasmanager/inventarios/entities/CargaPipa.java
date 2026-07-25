package com.gasmanager.inventarios.entities;

import com.gasmanager.inventarios.enums.TipoCombustible;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cargas_pipa")
public class CargaPipa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "folio", unique = true, nullable = false, length = 50)
    private String folio;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_combustible", nullable = false)
    private TipoCombustible tipoCombustible;

    @Column(name = "proveedor", length = 100)
    private String proveedor;

    @Column(name = "volumen", nullable = false, precision = 10, scale = 3)
    private BigDecimal volumen;

    @Column(name = "precio_compra", precision = 10, scale = 2)
    private BigDecimal precioCompra;

    @Column(name = "costo_total", precision = 12, scale = 2)
    private BigDecimal costoTotal;

    @Column(name = "fecha_carga", nullable = false)
    private LocalDateTime fechaCarga;

    @Column(name = "factura", length = 50)
    private String factura;

    @Column(name = "observaciones", length = 500)
    private String observaciones;

    @Column(name = "cargado_por", length = 50)
    private String cargadoPor;

    @Column(name = "cargado_por_id")
    private Long cargadoPorId;

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
    public CargaPipa() {}

    // Constructor con campos obligatorios
    public CargaPipa(TipoCombustible tipoCombustible, BigDecimal volumen) {
        this.tipoCombustible = tipoCombustible;
        this.volumen = volumen;
        this.fechaCarga = LocalDateTime.now();
    }

    // Constructor completo
    public CargaPipa(String folio, TipoCombustible tipoCombustible, String proveedor,
                     BigDecimal volumen, BigDecimal precioCompra, BigDecimal costoTotal,
                     LocalDateTime fechaCarga, String factura, String observaciones,
                     String cargadoPor, Long cargadoPorId) {
        this.folio = folio;
        this.tipoCombustible = tipoCombustible;
        this.proveedor = proveedor;
        this.volumen = volumen;
        this.precioCompra = precioCompra;
        this.costoTotal = costoTotal;
        this.fechaCarga = fechaCarga;
        this.factura = factura;
        this.observaciones = observaciones;
        this.cargadoPor = cargadoPor;
        this.cargadoPorId = cargadoPorId;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFolio() {
        return folio;
    }

    public void setFolio(String folio) {
        this.folio = folio;
    }

    public TipoCombustible getTipoCombustible() {
        return tipoCombustible;
    }

    public void setTipoCombustible(TipoCombustible tipoCombustible) {
        this.tipoCombustible = tipoCombustible;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }

    public BigDecimal getVolumen() {
        return volumen;
    }

    public void setVolumen(BigDecimal volumen) {
        this.volumen = volumen;
    }

    public BigDecimal getPrecioCompra() {
        return precioCompra;
    }

    public void setPrecioCompra(BigDecimal precioCompra) {
        this.precioCompra = precioCompra;
    }

    public BigDecimal getCostoTotal() {
        return costoTotal;
    }

    public void setCostoTotal(BigDecimal costoTotal) {
        this.costoTotal = costoTotal;
    }

    public LocalDateTime getFechaCarga() {
        return fechaCarga;
    }

    public void setFechaCarga(LocalDateTime fechaCarga) {
        this.fechaCarga = fechaCarga;
    }

    public String getFactura() {
        return factura;
    }

    public void setFactura(String factura) {
        this.factura = factura;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getCargadoPor() {
        return cargadoPor;
    }

    public void setCargadoPor(String cargadoPor) {
        this.cargadoPor = cargadoPor;
    }

    public Long getCargadoPorId() {
        return cargadoPorId;
    }

    public void setCargadoPorId(Long cargadoPorId) {
        this.cargadoPorId = cargadoPorId;
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
        if (fechaCarga == null) {
            fechaCarga = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "CargaPipa{" +
                "id=" + id +
                ", folio='" + folio + '\'' +
                ", tipoCombustible=" + tipoCombustible +
                ", proveedor='" + proveedor + '\'' +
                ", volumen=" + volumen +
                ", fechaCarga=" + fechaCarga +
                '}';
    }
}