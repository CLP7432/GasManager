import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventarioCombustibleService } from '../../api/inventarios/auth.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ConfigurarTanques = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [tanques, setTanques] = useState([]);
    const [editando, setEditando] = useState({});
    const [stockMinimo, setStockMinimo] = useState({});
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarConfiguracion();
    }, []);

    const cargarConfiguracion = async () => {
        setLoading(true);
        setMensaje(null);
        setError(null);
        try {
            const data = await inventarioCombustibleService.obtenerConfiguracion();
            setTanques(data);

            const editState = {};
            const minState = {};
            data.forEach(t => {
                editState[t.id] = t.stockActual || 0;
                minState[t.id] = t.stockMinimo || 0;
            });
            setEditando(editState);
            setStockMinimo(minState);
        } catch (error) {
            console.error('Error cargando configuración:', error);
            setError('Error al cargar la configuración de tanques');
        }
        setLoading(false);
    };

    const handleStockChange = (id, value) => {
        setEditando(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
    };

    const handleMinimoChange = (id, value) => {
        setStockMinimo(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
    };

    const handleGuardar = async () => {
        setGuardando(true);
        setMensaje(null);
        setError(null);

        try {
            const configuracion = tanques.map(t => ({
                id: t.id,
                stockActual: editando[t.id] || 0,
                stockMinimo: stockMinimo[t.id] || 0
            }));

            await inventarioCombustibleService.actualizarConfiguracion(configuracion);
            setMensaje('✅ Configuración de tanques actualizada exitosamente');
            await cargarConfiguracion();
        } catch (error) {
            console.error('Error guardando configuración:', error);
            setError(error.response?.data?.message || 'Error al guardar la configuración');
        }
        setGuardando(false);
    };

    const handleReiniciar = async () => {
        if (!window.confirm('⚠️ ¿Estás seguro de reiniciar el inventario a cero?\n\nEsta acción eliminará TODOS los litros de todos los tanques. No se puede deshacer.')) {
            return;
        }

        setGuardando(true);
        setMensaje(null);
        setError(null);

        try {
            const response = await inventarioCombustibleService.reiniciarInventario();
            setMensaje(response.mensaje || '✅ Inventario reiniciado a cero correctamente');
            await cargarConfiguracion();
        } catch (error) {
            console.error('Error reiniciando inventario:', error);
            setError(error.response?.data?.message || 'Error al reiniciar inventario');
        }
        setGuardando(false);
    };

    const getIconoCombustible = (tipo) => {
        switch(tipo) {
            case 'MAGNA': return '⛽';
            case 'PREMIUM': return '🏁';
            case 'DIESEL': return '🛢️';
            default: return '⛽';
        }
    };

    const getColorCombustible = (tipo) => {
        switch(tipo) {
            case 'MAGNA': return '#28a745';
            case 'PREMIUM': return '#fd7e14';
            case 'DIESEL': return '#6f42c1';
            default: return '#6c757d';
        }
    };

    if (!isAdmin) {
        return <div className="alert alert-danger">No tienes permisos para acceder a esta página</div>;
    }

    if (loading) {
        return (
            <div className="card text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando configuración de tanques...</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>🛢️ Configuración de Tanques de Combustible</h2>

            <div className="alert alert-info">
                <strong>ℹ️ Instrucciones:</strong>
                <ul className="mb-0 mt-2">
                    <li>Configure los <strong>litros actuales</strong> de cada tanque según la medición real.</li>
                    <li>Configure el <strong>stock mínimo</strong> para recibir alertas cuando el nivel esté bajo.</li>
                    <li>Use el botón <strong>"Reiniciar a Cero"</strong> solo si desea borrar todo el inventario.</li>
                </ul>
            </div>

            {mensaje && (
                <div className="alert alert-success">
                    {mensaje}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    ❌ {error}
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="table-dark">
                    <tr>
                        <th style={{ width: '120px' }}>Tipo</th>
                        <th>Combustible</th>
                        <th>Capacidad (L)</th>
                        <th style={{ width: '180px' }}>Stock Actual (L)</th>
                        <th style={{ width: '180px' }}>Stock Mínimo (L)</th>
                        <th style={{ width: '100px' }}>% Ocupación</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tanques.map(tanque => {
                        const stock = editando[tanque.id] || 0;
                        const minimo = stockMinimo[tanque.id] || 0;
                        const capacidad = tanque.capacidadTanque || 0;
                        const porcentaje = capacidad > 0 ? (stock / capacidad) * 100 : 0;
                        const color = porcentaje < 20 ? '#dc3545' : porcentaje < 50 ? '#ffc107' : '#28a745';
                        const icono = getIconoCombustible(tanque.tipoCombustible);
                        const colorTipo = getColorCombustible(tanque.tipoCombustible);

                        return (
                            <tr key={tanque.id}>
                                <td>
                                    <span style={{ fontSize: '24px' }}>{icono}</span>
                                    <span className="badge ms-2" style={{ backgroundColor: colorTipo }}>
                                            {tanque.tipoCombustible}
                                        </span>
                                </td>
                                <td><strong>{tanque.nombre}</strong></td>
                                <td>{capacidad.toLocaleString()} L</td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.001"
                                        min="0"
                                        max={capacidad}
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => handleStockChange(tanque.id, e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.001"
                                        min="0"
                                        className="form-control"
                                        value={minimo}
                                        onChange={(e) => handleMinimoChange(tanque.id, e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '8px',
                                            backgroundColor: '#e0e0e0',
                                            borderRadius: '4px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${Math.min(porcentaje, 100)}%`,
                                                height: '100%',
                                                backgroundColor: color
                                            }}></div>
                                        </div>
                                        <span style={{ fontWeight: 'bold' }}>{porcentaje.toFixed(1)}%</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="d-flex gap-2 mt-3 flex-wrap">
                <button
                    className="btn btn-success"
                    onClick={handleGuardar}
                    disabled={guardando}
                >
                    {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleReiniciar}
                    disabled={guardando}
                >
                    🔄 Reiniciar Inventario a Cero
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/modulo-administracion')}
                >
                    Volver
                </button>
            </div>

            <div className="alert alert-warning mt-3">
                <strong>⚠️ Reiniciar inventario a cero:</strong> Esta acción borrará todos los litros de todos los tanques.
                Se conservarán las capacidades y los stocks mínimos. Esta acción NO se puede deshacer.
            </div>
        </div>
    );
};

export default ConfigurarTanques;