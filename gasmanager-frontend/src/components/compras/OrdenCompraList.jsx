import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ordenesCompraService, proveedoresService } from '../../api/compras/auth';
import { useAuth } from '../../contexts/AuthContext';

const OrdenCompraList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdmin } = useAuth();
    const [ordenes, setOrdenes] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [proveedorFiltro, setProveedorFiltro] = useState('');

    useEffect(() => {
        cargarProveedores();

        const params = new URLSearchParams(location.search);
        const proveedorId = params.get('proveedorId');
        const estado = params.get('estado');
        if (proveedorId) setProveedorFiltro(proveedorId);
        if (estado) setEstadoFiltro(estado);
    }, [location]);

    useEffect(() => {
        cargarOrdenes();
    }, [estadoFiltro, proveedorFiltro]);

    const cargarProveedores = async () => {
        try {
            const data = await proveedoresService.listarActivos();
            setProveedores(data);
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    };

    const cargarOrdenes = async () => {
        setLoading(true);
        try {
            let data;
            if (proveedorFiltro) {
                data = await ordenesCompraService.listarPorProveedor(proveedorFiltro);
            } else if (estadoFiltro) {
                data = await ordenesCompraService.listarPorEstado(estadoFiltro);
            } else {
                data = await ordenesCompraService.listar();
            }
            setOrdenes(data);
        } catch (error) {
            console.error('Error al cargar órdenes:', error);
        }
        setLoading(false);
    };

    const handleRecibirOrden = async (orden) => {
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
                cargarOrdenes();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al recibir orden');
            }
        }
    };

    const handleCancelarOrden = async (id, folio) => {
        const motivo = prompt('Motivo de cancelación:');
        if (motivo === null) return;

        if (window.confirm(`¿Estás seguro de cancelar la orden ${folio}?`)) {
            try {
                await ordenesCompraService.cancelar(id, motivo);
                alert('Orden cancelada exitosamente');
                cargarOrdenes();
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

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX');
    };

    if (loading) {
        return <div className="card">Cargando órdenes de compra...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Órdenes de Compra</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/ordenes-compra/nueva')}>
                        + Nueva Orden
                    </button>
                )}
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-4">
                            <label className="form-label small">Filtrar por Estado</label>
                            <select
                                className="form-select"
                                value={estadoFiltro}
                                onChange={(e) => setEstadoFiltro(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="PENDIENTE">Pendientes</option>
                                <option value="RECIBIDA">Recibidas</option>
                                <option value="CANCELADA">Canceladas</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small">Filtrar por Proveedor</label>
                            <select
                                className="form-select"
                                value={proveedorFiltro}
                                onChange={(e) => setProveedorFiltro(e.target.value)}
                            >
                                <option value="">Todos los proveedores</option>
                                {proveedores.map(prov => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button className="btn btn-secondary w-100" onClick={cargarOrdenes}>
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Folio</th>
                            <th>Proveedor</th>
                            <th>Fecha Orden</th>
                            <th>Fecha Entrega</th>
                            <th>Subtotal</th>
                            <th>IVA</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Factura</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ordenes.map(orden => (
                            <tr key={orden.id}>
                                <td>{orden.id}</td>
                                <td><code>{orden.folioOrden}</code></td>
                                <td><strong>{orden.proveedorNombre}</strong></td>
                                <td>{formatDate(orden.fechaOrden)}</td>
                                <td>{formatDate(orden.fechaEntrega)}</td>
                                <td className="text-end">{formatMonto(orden.subtotal)}</td>
                                <td className="text-end">{formatMonto(orden.iva)}</td>
                                <td className="text-end fw-bold">{formatMonto(orden.total)}</td>
                                <td>{getEstadoBadge(orden.estado)}</td>
                                <td>{orden.factura || '-'}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-1"
                                        onClick={() => navigate(`/ordenes-compra/${orden.id}`)}
                                    >
                                        Ver
                                    </button>
                                    {orden.estado === 'PENDIENTE' && (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-1"
                                                onClick={() => handleRecibirOrden(orden)}
                                            >
                                                Recibir
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleCancelarOrden(orden.id, orden.folioOrden)}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {ordenes.length === 0 && (
                            <tr>
                                <td colSpan="11" className="text-center">
                                    No hay órdenes de compra registradas
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdenCompraList;