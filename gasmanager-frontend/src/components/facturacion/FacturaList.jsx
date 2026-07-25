import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facturacionService } from '../../api/facturacion/auth';
import { useAuth } from '../../contexts/AuthContext';

const FacturaList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroRFC, setFiltroRFC] = useState('');
    const [filtroCliente, setFiltroCliente] = useState('');

    useEffect(() => {
        cargarFacturas();
    }, []);

    const cargarFacturas = async () => {
        setLoading(true);
        try {
            let data;
            if (filtroRFC) {
                data = await facturacionService.listarPorRFC(filtroRFC);
            } else if (filtroCliente) {
                data = await facturacionService.listarPorCliente(filtroCliente);
            } else {
                data = await facturacionService.listar();
            }
            setFacturas(data);
        } catch (error) {
            console.error('Error al cargar facturas:', error);
        }
        setLoading(false);
    };

    const handleBuscarPorRFC = () => {
        if (filtroRFC.trim()) {
            cargarFacturas();
        }
    };

    const limpiarFiltros = () => {
        setFiltroRFC('');
        setFiltroCliente('');
        cargarFacturas();
    };

    const handleCancelarFactura = async (id, folio) => {
        const motivo = prompt('Motivo de cancelación:');
        if (motivo === null) return;

        if (window.confirm(`¿Estás seguro de cancelar la factura ${folio}?`)) {
            try {
                await facturacionService.cancelar(id, motivo);
                alert('Factura cancelada exitosamente');
                cargarFacturas();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al cancelar factura');
            }
        }
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            EMITIDA: 'badge bg-success',
            CANCELADA: 'badge bg-danger',
            PENDIENTE_TIMBRADO: 'badge bg-warning text-dark',
            ERROR_TIMBRADO: 'badge bg-danger'
        };
        return <span className={colores[estado] || 'badge bg-secondary'}>{estado}</span>;
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX');
    };

    if (loading) {
        return <div className="card">Cargando facturas...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Facturas</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/facturas/nueva')}>
                        + Nueva Factura
                    </button>
                )}
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-4">
                            <label className="form-label small">Filtrar por RFC</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="RFC del cliente..."
                                    value={filtroRFC}
                                    onChange={(e) => setFiltroRFC(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => e.key === 'Enter' && handleBuscarPorRFC()}
                                />
                                <button className="btn btn-outline-secondary" onClick={handleBuscarPorRFC}>
                                    Buscar
                                </button>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small">Filtrar por Cliente ID</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="ID del cliente..."
                                    value={filtroCliente}
                                    onChange={(e) => setFiltroCliente(e.target.value)}
                                />
                                <button className="btn btn-outline-secondary" onClick={cargarFacturas}>
                                    Buscar
                                </button>
                            </div>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button className="btn btn-secondary w-100" onClick={limpiarFiltros}>
                                Limpiar filtros
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
                            <th>Folio Factura</th>
                            <th>Cliente</th>
                            <th>RFC</th>
                            <th>Fecha Emisión</th>
                            <th>Subtotal</th>
                            <th>IVA</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Ventas</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {facturas.map(factura => (
                            <tr key={factura.id}>
                                <td>{factura.id}</td>
                                <td><code>{factura.folioFactura}</code></td>
                                <td><strong>{factura.clienteNombre}</strong></td>
                                <td>{factura.clienteRfc}</td>
                                <td>{formatDate(factura.fechaEmision)}</td>
                                <td className="text-end">{formatMonto(factura.subtotal)}</td>
                                <td className="text-end">{formatMonto(factura.iva)}</td>
                                <td className="text-end fw-bold">{formatMonto(factura.total)}</td>
                                <td>{getEstadoBadge(factura.estado)}</td>
                                <td>{factura.detalles?.length || 0}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-1"
                                        onClick={() => navigate(`/facturas/${factura.id}`)}
                                    >
                                        Ver
                                    </button>
                                    {factura.estado === 'EMITIDA' && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleCancelarFactura(factura.id, factura.folioFactura)}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {facturas.length === 0 && (
                            <tr>
                                <td colSpan="11" className="text-center">
                                    No hay facturas registradas
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

export default FacturaList;