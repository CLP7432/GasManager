import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordenesCompraService } from '../../api/compras/auth';
import { useAuth } from '../../contexts/AuthContext';

const OrdenCompraDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [orden, setOrden] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarOrden();
    }, [id]);

    const cargarOrden = async () => {
        setLoading(true);
        try {
            const data = await ordenesCompraService.obtenerPorId(id);
            setOrden(data);
        } catch (error) {
            console.error('Error al cargar orden:', error);
            alert('Error al cargar orden de compra');
        }
        setLoading(false);
    };

    const handleRecibirOrden = async () => {
        const factura = prompt('Número de factura:', orden.factura || '');
        if (factura === null) return;

        if (window.confirm(`¿Confirmar recepción de la orden ${orden.folioOrden}?`)) {
            try {
                await ordenesCompraService.recibir({
                    ordenId: orden.id,
                    fechaRecepcion: new Date().toISOString().split('T')[0],
                    factura: factura,
                    observaciones: 'Mercancía recibida'
                });
                alert('Orden recibida exitosamente. El inventario ha sido actualizado.');
                cargarOrden();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al recibir orden');
            }
        }
    };

    const handleCancelarOrden = async () => {
        const motivo = prompt('Motivo de cancelación:');
        if (motivo === null) return;

        if (window.confirm(`¿Estás seguro de cancelar la orden ${orden.folioOrden}?`)) {
            try {
                await ordenesCompraService.cancelar(orden.id, motivo);
                alert('Orden cancelada exitosamente');
                cargarOrden();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al cancelar orden');
            }
        }
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            PENDIENTE: 'bg-warning text-dark',
            RECIBIDA: 'bg-success',
            CANCELADA: 'bg-danger'
        };
        return <span className={`badge ${colores[estado] || 'bg-secondary'}`}>{estado}</span>;
    };

    const getTipoProductoLabel = (tipo) => {
        const labels = {
            COMBUSTIBLE_MAGNA: '⛽ Gasolina Magna',
            COMBUSTIBLE_PREMIUM: '⛽ Gasolina Premium',
            COMBUSTIBLE_DIESEL: '🛢️ Diesel',
            ACEITE_MOTOR: '🛢️ Aceite de Motor',
            ADITIVO: '🧪 Aditivo',
            OTRO: '📦 Otro'
        };
        return labels[tipo] || tipo;
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX');
    };

    if (loading) {
        return <div className="card">Cargando detalle de orden...</div>;
    }

    if (!orden) {
        return <div className="card">Orden no encontrada</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/ordenes-compra')}>
                    ← Volver a Órdenes
                </button>
                <h2 className="m-0">Detalle de Orden de Compra</h2>
                <div style={{ width: '100px' }}></div>
            </div>

            {/* Información general */}
            <div className="card mb-4">
                <div className="card-header bg-dark text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <span><strong>Folio:</strong> {orden.folioOrden}</span>
                        {getEstadoBadge(orden.estado)}
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Proveedor</h5>
                            <p>
                                <strong>Nombre:</strong> {orden.proveedorNombre}<br />
                                <strong>ID Proveedor:</strong> {orden.proveedorId}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <h5>Fechas</h5>
                            <p>
                                <strong>Fecha de Orden:</strong> {formatDate(orden.fechaOrden)}<br />
                                <strong>Fecha de Entrega:</strong> {formatDate(orden.fechaEntrega)}<br />
                                <strong>Factura:</strong> {orden.factura || 'Pendiente'}
                            </p>
                        </div>
                    </div>
                    {orden.observaciones && (
                        <>
                            <hr />
                            <p><strong>Observaciones:</strong> {orden.observaciones}</p>
                        </>
                    )}
                    <hr />
                    <div className="row">
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Subtotal</small>
                                <h4 className="text-primary">{formatMonto(orden.subtotal)}</h4>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">IVA (16%)</small>
                                <h4 className="text-warning">{formatMonto(orden.iva)}</h4>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Total</small>
                                <h4 className="text-success">{formatMonto(orden.total)}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                {orden.estado === 'PENDIENTE' && (
                    <div className="card-footer">
                        <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={handleRecibirOrden}>
                                Recibir Orden
                            </button>
                            <button className="btn btn-danger" onClick={handleCancelarOrden}>
                                Cancelar Orden
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detalle de productos */}
            <div className="card">
                <div className="card-header">
                    <h5 className="m-0">Productos</h5>
                </div>
                <div className="card-body">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>ID Producto</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Importe</th>
                                <th>IVA</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orden.detalles?.map((detalle, idx) => (
                                <tr key={idx}>
                                    <td>{getTipoProductoLabel(detalle.tipoProducto)}</td>
                                    <td>{detalle.productoId}</td>
                                    <td><strong>{detalle.productoNombre}</strong></td>
                                    <td className="text-end">{detalle.cantidad.toLocaleString()}</td>
                                    <td className="text-end">{formatMonto(detalle.precioUnitario)}</td>
                                    <td className="text-end">{formatMonto(detalle.subtotal)}</td>
                                    <td className="text-end">{formatMonto(detalle.iva)}</td>
                                    <td className="text-end fw-bold">{formatMonto(detalle.total)}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr className="table-light">
                                <td colSpan="5" className="text-end fw-bold">Totales:</td>
                                <td className="text-end fw-bold">{formatMonto(orden.subtotal)}</td>
                                <td className="text-end fw-bold">{formatMonto(orden.iva)}</td>
                                <td className="text-end fw-bold text-success">{formatMonto(orden.total)}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdenCompraDetalle;