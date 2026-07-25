import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aceiteService } from '../../api/inventarios/auth';
import { useAuth } from '../../contexts/AuthContext';

const AceiteList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [aceites, setAceites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stockModal, setStockModal] = useState(null);
    const [nuevoStock, setNuevoStock] = useState('');
    const [actualizando, setActualizando] = useState(false);

    useEffect(() => {
        cargarAceites();
    }, []);

    const cargarAceites = async () => {
        setLoading(true);
        try {
            const data = await aceiteService.listar();
            setAceites(data);
        } catch (error) {
            console.error('Error al cargar aceites:', error);
        }
        setLoading(false);
    };

    const abrirModalStock = (aceite) => {
        setStockModal(aceite);
        setNuevoStock(aceite.stockActual);
    };

    const cerrarModal = () => {
        setStockModal(null);
        setNuevoStock('');
    };

    const guardarStock = async () => {
        if (!nuevoStock || parseInt(nuevoStock) < 0) {
            alert('Ingrese un stock válido');
            return;
        }

        setActualizando(true);
        try {
            await aceiteService.actualizarStock(stockModal.id, parseInt(nuevoStock), 'Actualización manual');
            alert('Stock actualizado exitosamente');
            cerrarModal();
            cargarAceites();
        } catch (error) {
            alert(error.response?.data?.message || 'Error al actualizar stock');
        } finally {
            setActualizando(false);
        }
    };

    const toggleActivo = async (aceite) => {
        const nuevoEstado = !aceite.activo;
        const accion = nuevoEstado ? 'activar' : 'desactivar';
        if (window.confirm(`¿Estás seguro de ${accion} "${aceite.nombre}"?`)) {
            try {
                await aceiteService.toggleActivo(aceite.id);
                cargarAceites();
            } catch (error) {
                alert('Error al cambiar estado del aceite');
            }
        }
    };

    const eliminarAceite = async (aceite) => {
        if (window.confirm(`¿Estás seguro de eliminar "${aceite.nombre}"?`)) {
            try {
                await aceiteService.eliminar(aceite.id);
                cargarAceites();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al eliminar aceite');
            }
        }
    };

    const getStockBadge = (stock, min) => {
        if (stock <= min) {
            return <span className="badge badge-danger" style={{ marginLeft: '8px' }}>Stock Bajo</span>;
        }
        return null;
    };

    if (loading) {
        return <div className="card">Cargando aceites...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Aceites y Aditivos</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/aceites/nuevo')}>
                        + Nuevo Aceite
                    </button>
                )}
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Marca</th>
                            <th>Presentación</th>
                            <th>Stock</th>
                            <th>Precio Venta</th>
                            <th>Estado</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {aceites.map(aceite => (
                            <tr key={aceite.id}>
                                <td>{aceite.id}</td>
                                <td><code>{aceite.codigo}</code></td>
                                <td><strong>{aceite.nombre}</strong></td>
                                <td>{aceite.marca || '-'}</td>
                                <td>{aceite.presentacion || '-'}</td>
                                <td>
                                    {aceite.stockActual} {getStockBadge(aceite.stockActual, aceite.stockMinimo)}
                                </td>
                                <td>${aceite.precioVenta?.toFixed(2)}</td>
                                <td>
                                        <span className={`badge ${aceite.activo ? 'badge-success' : 'badge-danger'}`}>
                                            {aceite.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                </td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }}
                                            onClick={() => navigate(`/aceites/editar/${aceite.id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-warning"
                                            style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }}
                                            onClick={() => abrirModalStock(aceite)}
                                        >
                                            Stock
                                        </button>
                                        <button
                                            className={`btn ${aceite.activo ? 'btn-secondary' : 'btn-success'}`}
                                            style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }}
                                            onClick={() => toggleActivo(aceite)}
                                        >
                                            {aceite.activo ? 'Desactivar' : 'Activar'}
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            style={{ padding: '4px 8px', fontSize: '12px' }}
                                            onClick={() => eliminarAceite(aceite)}
                                            disabled={!aceite.activo}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {aceites.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 9 : 8} style={{ textAlign: 'center' }}>
                                    No hay aceites registrados
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para actualizar stock */}
            {stockModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
                        <h3>Actualizar Stock</h3>
                        <p><strong>Aceite:</strong> {stockModal.nombre}</p>
                        <p><strong>Stock actual:</strong> {stockModal.stockActual}</p>
                        <p><strong>Stock mínimo:</strong> {stockModal.stockMinimo}</p>

                        <div className="form-group">
                            <label>Nuevo Stock *</label>
                            <input
                                type="number"
                                min="0"
                                value={nuevoStock}
                                onChange={(e) => setNuevoStock(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button
                                className="btn btn-primary"
                                onClick={guardarStock}
                                disabled={actualizando}
                            >
                                {actualizando ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button className="btn" onClick={cerrarModal}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AceiteList;