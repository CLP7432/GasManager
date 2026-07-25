import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { preciosService } from '../../api/ventas/auth';
import { useAuth } from '../../contexts/AuthContext';

const PreciosCombustiblesPage = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [combustibles, setCombustibles] = useState([]);
    const [error, setError] = useState(null);
    const [editando, setEditando] = useState(null);
    const [nuevoPrecio, setNuevoPrecio] = useState('');
    const [motivo, setMotivo] = useState('');
    const [actualizando, setActualizando] = useState(false);

    useEffect(() => {
        cargarCombustibles();
    }, []);

    const cargarCombustibles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await preciosService.listarCombustibles();
            console.log('Datos recibidos:', data);

            // Validar que data sea un arreglo
            if (Array.isArray(data)) {
                setCombustibles(data);
            } else if (data && typeof data === 'object') {
                // Si es un objeto, convertirlo a arreglo o mostrar error
                console.warn('Los datos no son un arreglo:', data);
                setCombustibles([]);
                setError('Formato de datos inválido');
            } else {
                setCombustibles([]);
                setError('No se recibieron datos de combustibles');
            }
        } catch (error) {
            console.error('Error cargando combustibles:', error);
            setError(error.response?.data?.message || error.message || 'Error al cargar combustibles');
            setCombustibles([]);
        }
        setLoading(false);
    };


    const handleActualizarPrecio = async (id) => {
        if (!nuevoPrecio || parseFloat(nuevoPrecio) <= 0) {
            alert('Ingrese un precio válido');
            return;
        }

        setActualizando(true);
        try {
            await preciosService.actualizarPrecio(id, parseFloat(nuevoPrecio), motivo);
            alert('✅ Precio actualizado exitosamente');

            // 🔥 NUEVO: Disparar evento para que el Punto de Venta recargue
            window.dispatchEvent(new CustomEvent('preciosActualizados'));

            setEditando(null);
            setNuevoPrecio('');
            setMotivo('');
            cargarCombustibles();
        } catch (error) {
            console.error('Error actualizando precio:', error);
            alert('Error al actualizar precio: ' + (error.response?.data?.message || error.message));
        }
        setActualizando(false);
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
            case 'DIESEL': return '#dc3545';
            default: return '#6c757d';
        }
    };

    if (!isAdmin) {
        return (
            <Layout>
                <div className="alert alert-danger">No tienes permisos para acceder a esta página</div>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <div className="card text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3">Cargando combustibles...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="card">
                    <h2>💰 Precios de Combustibles</h2>
                    <div className="alert alert-danger">
                        <strong>Error:</strong> {error}
                    </div>
                    <button className="btn btn-primary" onClick={cargarCombustibles}>
                        🔄 Reintentar
                    </button>
                    <button className="btn btn-secondary mt-2" onClick={() => navigate('/modulo-administracion')}>
                        ← Volver
                    </button>
                </div>
            </Layout>
        );
    }

    if (!combustibles || combustibles.length === 0) {
        return (
            <Layout>
                <div className="card">
                    <h2>💰 Precios de Combustibles</h2>
                    <div className="alert alert-warning">
                        ⚠️ No hay combustibles registrados en el sistema.
                    </div>
                    <button className="btn btn-secondary" onClick={() => navigate('/modulo-administracion')}>
                        ← Volver
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>💰 Precios de Combustibles</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/modulo-administracion')}>
                    ← Volver
                </button>
            </div>

            <div className="alert alert-info">
                ℹ️ Los precios se actualizan en el microservicio de inventarios y afectan todas las ventas.
            </div>

            <div className="row">
                {combustibles.map(comb => (
                    <div key={comb.id} className="col-md-4 mb-4">
                        <div className="card h-100" style={{ borderTop: `4px solid ${getColorCombustible(comb.tipo)}` }}>
                            <div className="card-body text-center">
                                <div style={{ fontSize: '48px' }}>{getIconoCombustible(comb.tipo)}</div>
                                <h3 className="mt-2">{comb.nombre || comb.tipo}</h3>
                                <p className="text-muted">{comb.tipo}</p>

                                {editando === comb.id ? (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label">Nuevo Precio por Litro ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control text-center"
                                                value={nuevoPrecio}
                                                onChange={(e) => setNuevoPrecio(e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Motivo del cambio</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={motivo}
                                                onChange={(e) => setMotivo(e.target.value)}
                                                placeholder="Ej: Ajuste mensual, Cambio de proveedor"
                                            />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-success w-50"
                                                onClick={() => handleActualizarPrecio(comb.id)}
                                                disabled={actualizando}
                                            >
                                                {actualizando ? 'Guardando...' : '✅ Guardar'}
                                            </button>
                                            <button
                                                className="btn btn-secondary w-50"
                                                onClick={() => {
                                                    setEditando(null);
                                                    setNuevoPrecio('');
                                                    setMotivo('');
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-3">
                                            <h2 className="text-success">${comb.precioActual?.toFixed(2) || '0.00'}</h2>
                                            <small className="text-muted">por litro</small>
                                        </div>
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={() => {
                                                setEditando(comb.id);
                                                setNuevoPrecio(comb.precioActual || 0);
                                            }}
                                        >
                                            ✏️ Cambiar Precio
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="card-footer text-muted text-center small">
                                {comb.activo ? '✅ Activo' : '❌ Inactivo'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card mt-4">
                <div className="card-header">
                    <h5 className="m-0">📋 Información importante</h5>
                </div>
                <div className="card-body">
                    <ul className="mb-0">
                        <li>Los precios se actualizan en <strong>tiempo real</strong> para todos los surtidores</li>
                        <li>Cada cambio de precio queda registrado en el <strong>historial</strong> del sistema</li>
                        <li>Los precios se obtienen del <strong>microservicio de inventarios</strong></li>
                        <li>Las ventas usan el precio <strong>vigente</strong> al momento de la transacción</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default PreciosCombustiblesPage;