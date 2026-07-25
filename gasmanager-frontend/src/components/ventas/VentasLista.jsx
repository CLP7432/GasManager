import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ventasService } from '../../api/ventas/auth';

const VentasLista = () => {
    const navigate = useNavigate();
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState('');

    useEffect(() => {
        cargarVentas();
    }, [estadoFiltro]);

    const cargarVentas = async () => {
        setLoading(true);
        try {
            let data;
            if (estadoFiltro) {
                data = await ventasService.listarPorEstado(estadoFiltro);
                setVentas(data);
            } else {
                const response = await ventasService.listar(0, 50);
                setVentas(response.ventas || []);
            }
        } catch (error) {
            console.error('Error al cargar ventas:', error);
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
        return <div className="card">Cargando ventas...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Historial de Ventas</h2>
            </div>

            <div className="card">
                <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label>Filtrar por estado: </label>
                    <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} style={{ padding: '5px' }}>
                        <option value="">Todos</option>
                        <option value="COMPLETADA">Completadas</option>
                        <option value="CANCELADA">Canceladas</option>
                        <option value="FACTURADA">Facturadas</option>
                    </select>
                    <button onClick={cargarVentas} className="btn btn-secondary">Actualizar</button>
                </div>

                {loading ? (
                    <p>Cargando ventas...</p>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Folio</th>
                                <th>Fecha</th>
                                <th>Despachador</th>
                                <th>Método Pago</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ventas.map(venta => (
                                <tr key={venta.id}>
                                    <td>{venta.id}</td>
                                    <td><strong>{venta.folio}</strong></td>
                                    <td>{new Date(venta.fechaHora).toLocaleString()}</td>
                                    <td>{venta.despachadorNombre || venta.despachadorId}</td>
                                    <td>{getMetodoPagoLabel(venta.metodoPago)}</td>
                                    <td>${venta.total?.toFixed(2)}</td>
                                    <td>{getEstadoBadge(venta.estado)}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => navigate(`/ventas/${venta.id}`)}
                                        >
                                            👁 Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {ventas.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No hay ventas registradas
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VentasLista;