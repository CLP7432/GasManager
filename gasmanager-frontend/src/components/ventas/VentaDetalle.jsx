import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ventasService } from '../../api/ventas/auth';

const VentaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venta, setVenta] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarVenta();
    }, [id]);

    const cargarVenta = async () => {
        setLoading(true);
        try {
            const data = await ventasService.obtenerPorId(id);
            setVenta(data);
        } catch (error) {
            console.error('Error al cargar venta:', error);
        }
        setLoading(false);
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            COMPLETADA: 'badge bg-success',
            CANCELADA: 'badge bg-danger',
            FACTURADA: 'badge bg-info',
            PENDIENTE: 'badge bg-warning text-dark'
        };
        const textos = {
            COMPLETADA: '✅ COMPLETADA',
            CANCELADA: '❌ CANCELADA',
            FACTURADA: '📄 FACTURADA',
            PENDIENTE: '⏳ PENDIENTE'
        };
        return <span className={colores[estado] || 'badge bg-secondary'}>{textos[estado] || estado}</span>;
    };

    const getMetodoPagoLabel = (metodo) => {
        const labels = {
            EFECTIVO: '💰 Efectivo',
            TARJETA_CREDITO: '💳 Tarjeta Crédito',
            TARJETA_DEBITO: '💳 Tarjeta Débito',
            TRANSFERENCIA: '🏦 Transferencia',
            CREDITO: '📝 Crédito'
        };
        return labels[metodo] || metodo;
    };

    if (loading) {
        return <div className="container">Cargando...</div>;
    }

    if (!venta) {
        return <div className="container">Venta no encontrada</div>;
    }

    return (
        <div className="container">
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Detalle de Venta</h2>
                    <span className={getEstadoBadge(venta.estado)} style={{ fontSize: '14px', padding: '6px 12px' }}>
                        {venta.estado}
                    </span>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <p><strong>Folio:</strong> {venta.folio}</p>
                    <p><strong>Fecha:</strong> {new Date(venta.fechaHora).toLocaleString()}</p>
                    <p><strong>Despachador:</strong> {venta.despachadorNombre || venta.despachadorId}</p>
                    <p><strong>Método de Pago:</strong> {getMetodoPagoLabel(venta.metodoPago)}</p>
                    <p><strong>Surtidor:</strong> {venta.surtidorNumero || venta.surtidorId}</p>
                    {venta.turno && <p><strong>Turno:</strong> {venta.turno.codigoTurno} - {venta.turno.nombre}</p>}
                    {venta.clienteNombre && <p><strong>Cliente:</strong> {venta.clienteNombre}</p>}
                    {venta.clienteRfc && <p><strong>RFC:</strong> {venta.clienteRfc}</p>}
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h3>Detalles de Productos</h3>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Importe</th>
                            </tr>
                            </thead>
                            <tbody>
                            {venta.detalles?.map((detalle, idx) => (
                                <tr key={idx}>
                                    <td>{detalle.productoNombre}</td>
                                    <td>{detalle.cantidad} {detalle.unidadMedida}</td>
                                    <td>${detalle.precioUnitario?.toFixed(2)}</td>
                                    <td>${detalle.importe?.toFixed(2)}</td>
                                </tr>
                            ))}
                            {(!venta.detalles || venta.detalles.length === 0) && (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Sin detalles</td></tr>
                            )}
                            </tbody>
                            <tfoot>
                            <tr><td colSpan="3" style={{ textAlign: 'right' }}><strong>Subtotal:</strong></td><td>${venta.subtotal?.toFixed(2)}</td></tr>
                            <tr><td colSpan="3" style={{ textAlign: 'right' }}><strong>IVA (16%):</strong></td><td>${venta.iva?.toFixed(2)}</td></tr>
                            <tr><td colSpan="3" style={{ textAlign: 'right' }}><strong>Total:</strong></td><td><strong>${venta.total?.toFixed(2)}</strong></td></tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/ventas')}>
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VentaDetalle;