package com.gasmanager.inventarios.dto;

import com.gasmanager.inventarios.enums.TipoCombustible;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CargaPipaDTO {

    private Long id;
    private String folio;
    private TipoCombustible tipoCombustible;
    private String proveedor;
    private BigDecimal volumen;
    private BigDecimal precioCompra;
    private BigDecimal costoTotal;
    private LocalDateTime fechaCarga;
    private String factura;
    private String observaciones;
    private String cargadoPor;
    private LocalDateTime createdAt;

    public CargaPipaDTO() {}

    public CargaPipaDTO(Long id, String folio, TipoCombustible tipoCombustible, String proveedor,
                        BigDecimal volumen, BigDecimal precioCompra, BigDecimal costoTotal,
                        LocalDateTime fechaCarga, String factura, String observaciones,
                        String cargadoPor, LocalDateTime createdAt) {
        this.id = id;
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
        this.createdAt = createdAt;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}