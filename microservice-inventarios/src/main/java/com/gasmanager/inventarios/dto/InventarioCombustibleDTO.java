package com.gasmanager.inventarios.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InventarioCombustibleDTO {

    private Long id;
    private String tipoCombustible;
    private String nombre;
    private BigDecimal capacidadTanque;
    private BigDecimal stockActual;
    private BigDecimal stockMinimo;
    private BigDecimal porcentajeOcupacion;
    private LocalDateTime ultimaLectura;
    private Boolean activo;

    public InventarioCombustibleDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTipoCombustible() { return tipoCombustible; }
    public void setTipoCombustible(String tipoCombustible) { this.tipoCombustible = tipoCombustible; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public BigDecimal getCapacidadTanque() { return capacidadTanque; }
    public void setCapacidadTanque(BigDecimal capacidadTanque) { this.capacidadTanque = capacidadTanque; }
    public BigDecimal getStockActual() { return stockActual; }
    public void setStockActual(BigDecimal stockActual) { this.stockActual = stockActual; }
    public BigDecimal getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(BigDecimal stockMinimo) { this.stockMinimo = stockMinimo; }
    public BigDecimal getPorcentajeOcupacion() { return porcentajeOcupacion; }
    public void setPorcentajeOcupacion(BigDecimal porcentajeOcupacion) { this.porcentajeOcupacion = porcentajeOcupacion; }
    public LocalDateTime getUltimaLectura() { return ultimaLectura; }
    public void setUltimaLectura(LocalDateTime ultimaLectura) { this.ultimaLectura = ultimaLectura; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}