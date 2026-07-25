import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { facturacionService } from '../../api/facturacion/auth';
import { useAuth } from '../../contexts/AuthContext';

const FacturaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [factura, setFactura] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarFactura();
    }, [id]);

    const cargarFactura = async () => {
        setLoading(true);
        try {
            const data = await facturacionService.obtenerPorId(id);
            setFactura(data);
        } catch (error) {
            console.error('Error al cargar factura:', error);
            alert('Error al cargar factura');
        }
        setLoading(false);
    };

    const handleCancelarFactura = async () => {
        const motivo = prompt('Motivo de cancelación:');
        if (motivo === null) return;

        if (window.confirm(`¿Estás seguro de cancelar la factura ${factura.folioFactura}?`)) {
            try {
                await facturacionService.cancelar(factura.id, motivo);
                alert('Factura cancelada exitosamente');
                cargarFactura();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al cancelar factura');
            }
        }
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            EMITIDA: 'bg-success',
            CANCELADA: 'bg-danger',
            PENDIENTE_TIMBRADO: 'bg-warning text-dark',
            ERROR_TIMBRADO: 'bg-danger'
        };
        return <span className={`badge ${colores[estado] || 'bg-secondary'}`}>{estado}</span>;
    };

    const getFormaPagoLabel = (formaPago) => {
        const labels = {
            EFECTIVO: 'Efectivo',
            CHEQUE: 'Cheque',
            TRANSFERENCIA: 'Transferencia electrónica',
            TARJETA_CREDITO: 'Tarjeta de crédito',
            TARJETA_DEBITO: 'Tarjeta de débito'
        };
        return labels[formaPago] || formaPago;
    };

    const getMetodoPagoLabel = (metodoPago) => {
        const labels = {
            PAGO_EN_UNA_EXHIBICION: 'Pago en una sola exhibición (PUE)',
            PAGO_EN_PARCIALIDADES: 'Pago en parcialidades (PPD)'
        };
        return labels[metodoPago] || metodoPago;
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="card">Cargando detalles de la factura...</div>;
    }

    if (!factura) {
        return <div className="card">Factura no encontrada</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/facturas')}>
                    ← Volver a Facturas
                </button>
                <h2 className="m-0">Detalle de Factura</h2>
                <div style={{ width: '100px' }}></div>
            </div>

            {/* Información de la factura */}
            <div className="card mb-4">
                <div className="card-header bg-dark text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <span><strong>Folio:</strong> {factura.folioFactura}</span>
                        {getEstadoBadge(factura.estado)}
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Datos del Cliente</h5>
                            <p><strong>Nombre:</strong> {factura.clienteNombre}</p>
                            <p><strong>RFC:</strong> {factura.clienteRfc}</p>
                            <p><strong>Régimen Fiscal:</strong> {factura.clienteRegimenFiscal || '-'}</p>
                            <p><strong>Código Postal:</strong> {factura.clienteCodigoPostal || '-'}</p>
                            <p><strong>Email:</strong> {factura.clienteEmail || '-'}</p>
                        </div>
                        <div className="col-md-6">
                            <h5>Datos de la Factura</h5>
                            <p><strong>Fecha de Emisión:</strong> {formatDate(factura.fechaEmision)}</p>
                            <p><strong>Forma de Pago:</strong> {getFormaPagoLabel(factura.formaPago)}</p>
                            <p><strong>Método de Pago:</strong> {getMetodoPagoLabel(factura.metodoPago)}</p>
                            {factura.uuidCfdi && <p><strong>UUID CFDI:</strong> <code>{factura.uuidCfdi}</code></p>}
                            {factura.fechaTimbrado && <p><strong>Fecha de Timbrado:</strong> {formatDate(factura.fechaTimbrado)}</p>}
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Subtotal</small>
                                <h4 className="text-primary">{formatMonto(factura.subtotal)}</h4>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">IVA (16%)</small>
                                <h4 className="text-warning">{formatMonto(factura.iva)}</h4>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Total</small>
                                <h4 className="text-success">{formatMonto(factura.total)}</h4>
                            </div>
                        </div>
                    </div>
                    {factura.observaciones && (
                        <>
                            <hr />
                            <p><strong>Observaciones:</strong> {factura.observaciones}</p>
                        </>
                    )}
                </div>
                <div className="card-footer">
                    <div className="d-flex gap-2">
                        {factura.estado === 'EMITIDA' && (
                            <button className="btn btn-danger" onClick={handleCancelarFactura}>
                                Cancelar Factura
                            </button>
                        )}
                        {factura.xmlPath && (
                            <button className="btn btn-secondary" onClick={() => window.open(factura.xmlPath, '_blank')}>
                                Descargar XML
                            </button>
                        )}
                        {factura.pdfPath && (
                            <button className="btn btn-primary" onClick={() => window.open(factura.pdfPath, '_blank')}>
                                Descargar PDF
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Ventas facturadas */}
            <div className="card">
                <div className="card-header">
                    <h5 className="m-0">Ventas incluidas en esta factura</h5>
                </div>
                <div className="card-body">
                    {factura.detalles?.length === 0 ? (
                        <p className="text-muted text-center">No hay ventas asociadas</p>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>ID Venta</th>
                                    <th>Folio Venta</th>
                                    <th>Fecha</th>
                                    <th>Monto</th>
                                    <th>IVA</th>
                                    <th>Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {factura.detalles?.map((detalle, idx) => (
                                    <tr key={idx}>
                                        <td>{detalle.ventaId}</td>
                                        <td><code>{detalle.ventaFolio}</code></td>
                                        <td>{formatDate(detalle.ventaFecha)}</td>
                                        <td className="text-success fw-bold">{formatMonto(detalle.monto)}</td>
                                        <td className="text-warning">{formatMonto(detalle.iva)}</td>
                                        <td className="text-primary">{formatMonto(detalle.subtotal)}</td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr className="table-light">
                                    <td colSpan="3" className="text-end fw-bold">Total facturado:</td>
                                    <td className="text-success fw-bold">{formatMonto(factura.total)}</td>
                                    <td className="text-warning">{formatMonto(factura.iva)}</td>
                                    <td className="text-primary">{formatMonto(factura.subtotal)}</td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacturaDetalle;