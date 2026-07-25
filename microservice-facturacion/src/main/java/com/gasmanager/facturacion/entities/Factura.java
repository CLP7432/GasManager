package com.gasmanager.facturacion.entities;

import com.gasmanager.facturacion.enums.EstadoFactura;
import com.gasmanager.facturacion.enums.FormaPago;
import com.gasmanager.facturacion.enums.MetodoPago;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "facturas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "folio_factura", unique = true, nullable = false, length = 30)
    private String folioFactura;

    @Column(name = "uuid_cfdi", unique = true, length = 36)
    private String uuidCfdi;

    // Datos del cliente (se copian al momento de facturar)
    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "cliente_nombre", nullable = false, length = 150)
    private String clienteNombre;

    @Column(name = "cliente_rfc", nullable = false, length = 13)
    private String clienteRfc;

    @Column(name = "cliente_regimen_fiscal", length = 3)
    private String clienteRegimenFiscal;

    @Column(name = "cliente_codigo_postal", length = 5)
    private String clienteCodigoPostal;

    @Column(name = "cliente_email", length = 100)
    private String clienteEmail;

    // Datos de la factura
    @Column(name = "fecha_emision", nullable = false)
    private LocalDateTime fechaEmision;

    @Column(name = "subtotal", nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "descuento", precision = 12, scale = 2)
    private BigDecimal descuento;

    @Column(name = "iva", nullable = false, precision = 12, scale = 2)
    private BigDecimal iva;

    @Column(name = "total", nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoFactura estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pago", length = 10)
    private FormaPago formaPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", length = 3)
    private MetodoPago metodoPago;

    @Column(name = "xml_path", length = 255)
    private String xmlPath;

    @Column(name = "pdf_path", length = 255)
    private String pdfPath;

    @Column(name = "serie", length = 10)
    private String serie;

    @Column(name = "folio", length = 10)
    private String folio;

    @Column(name = "sello_cfd", columnDefinition = "TEXT")
    private String selloCfd;

    @Column(name = "sello_sat", columnDefinition = "TEXT")
    private String selloSat;

    @Column(name = "cadena_original", columnDefinition = "TEXT")
    private String cadenaOriginal;

    @Column(name = "no_certificado", length = 20)
    private String noCertificado;

    @Column(name = "no_certificado_sat", length = 20)
    private String noCertificadoSat;

    @Column(name = "fecha_timbrado")
    private LocalDateTime fechaTimbrado;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FacturaDetalle> detalles = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @Version
    private Long version;

    public void addDetalle(FacturaDetalle detalle) {
        detalles.add(detalle);
        detalle.setFactura(this);
    }

    public void removeDetalle(FacturaDetalle detalle) {
        detalles.remove(detalle);
        detalle.setFactura(null);
    }
}