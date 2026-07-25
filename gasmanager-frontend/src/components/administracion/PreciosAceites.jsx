import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { aceiteService } from '../../api/inventarios/auth';

const PreciosAceites = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [aceites, setAceites] = useState([]);
    const [filtro, setFiltro] = useState('todos'); // 'todos', 'aceites', 'aditivos'
    const [editando, setEditando] = useState(null);
    const [nuevoPrecio, setNuevoPrecio] = useState('');
    const [motivo, setMotivo] = useState('');
    const [actualizando, setActualizando] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarAceites();
    }, []);

    const cargarAceites = async () => {
        setLoading(true);
        setMensaje(null);
        setError(null);
        try {
            const data = await aceiteService.listarActivos();
            setAceites(data);
        } catch (error) {
            console.error('Error cargando aceites:', error);
            setError('Error al cargar los aceites');
        }
        setLoading(false);
    };

    const handleActualizarPrecio = async (id) => {
        if (!nuevoPrecio || parseFloat(nuevoPrecio) <= 0) {
            alert('Ingrese un precio válido');
            return;
        }

        setActualizando(true);
        setMensaje(null);
        setError(null);

        try {
            const aceite = await aceiteService.obtenerPorId(id);

            await aceiteService.actualizar(id, {
                ...aceite,
                precioVenta: parseFloat(nuevoPrecio)
            });

            setMensaje(`✅ Precio actualizado exitosamente para ${aceite.nombre}`);

            window.dispatchEvent(new CustomEvent('preciosAceitesActualizados'));

            setEditando(null);
            setNuevoPrecio('');
            setMotivo('');
            cargarAceites();
        } catch (error) {
            console.error('Error actualizando precio:', error);
            setError('❌ Error al actualizar precio: ' + (error.response?.data?.message || error.message));
        }
        setActualizando(false);
    };

    // ===== FILTRAR POR CATEGORÍA =====
    const getAceitesFiltrados = () => {
        if (filtro === 'todos') {
            return aceites;
        }

        // Aceites: tipoAceite es 'Sintético', 'Semisintético' o 'Mineral'
        if (filtro === 'aceites') {
            return aceites.filter(a =>
                a.tipoAceite === 'Sintético' ||
                a.tipoAceite === 'Semisintético' ||
                a.tipoAceite === 'Mineral'
            );
        }

        // Aditivos: tipoAceite es 'Aditivo'
        if (filtro === 'aditivos') {
            return aceites.filter(a => a.tipoAceite === 'Aditivo');
        }

        return aceites;
    };

    const getIconoAceite = (tipo) => {
        switch(tipo) {
            case 'Sintético': return '🧪';
            case 'Semisintético': return '🔬';
            case 'Mineral': return '⛽';
            case 'Aditivo': return '🧴';
            default: return '🛢️';
        }
    };

    const getColorAceite = (tipo) => {
        switch(tipo) {
            case 'Sintético': return '#9c27b0';
            case 'Semisintético': return '#2196f3';
            case 'Mineral': return '#ff9800';
            case 'Aditivo': return '#4caf50';
            default: return '#6c757d';
        }
    };

    // ===== CONTAR POR CATEGORÍA =====
    const contarAceites = () => {
        const aceitesCategoria = aceites.filter(a =>
            a.tipoAceite === 'Sintético' ||
            a.tipoAceite === 'Semisintético' ||
            a.tipoAceite === 'Mineral'
        );
        const aditivosCategoria = aceites.filter(a => a.tipoAceite === 'Aditivo');
        return { aceites: aceitesCategoria.length, aditivos: aditivosCategoria.length };
    };

    const counts = contarAceites();

    if (!isAdmin) {
        return <div className="alert alert-danger">No tienes permisos para acceder a esta página</div>;
    }

    if (loading) {
        return (
            <div className="card text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando aceites...</p>
            </div>
        );
    }

    const aceitesFiltrados = getAceitesFiltrados();

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>💰 Precios de Aceites y Aditivos</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/modulo-administracion')}>
                    ← Volver
                </button>
            </div>

            <div className="alert alert-info">
                ℹ️ Los precios de aceites se actualizan en el catálogo de aceites y afectan los cortes de turno.
                <br />
                <small>Solo el administrador puede modificar estos precios.</small>
            </div>

            {mensaje && (
                <div className="alert alert-success">
                    {mensaje}
                </div>
            )}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* ===== FILTROS POR CATEGORÍA ===== */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div
                        className={`card h-100 text-center p-3 ${filtro === 'todos' ? 'border-primary border-3' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFiltro('todos')}
                    >
                        <div style={{ fontSize: '32px' }}>📦</div>
                        <h5 className="mb-0">Todos</h5>
                        <small className="text-muted">{aceites.length} productos</small>
                        {filtro === 'todos' && (
                            <span className="badge bg-primary mt-2">✓ Seleccionado</span>
                        )}
                    </div>
                </div>
                <div className="col-md-4">
                    <div
                        className={`card h-100 text-center p-3 ${filtro === 'aceites' ? 'border-primary border-3' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFiltro('aceites')}
                    >
                        <div style={{ fontSize: '32px' }}>🛢️</div>
                        <h5 className="mb-0">Aceites</h5>
                        <small className="text-muted">{counts.aceites} productos</small>
                        {filtro === 'aceites' && (
                            <span className="badge bg-primary mt-2">✓ Seleccionado</span>
                        )}
                    </div>
                </div>
                <div className="col-md-4">
                    <div
                        className={`card h-100 text-center p-3 ${filtro === 'aditivos' ? 'border-primary border-3' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFiltro('aditivos')}
                    >
                        <div style={{ fontSize: '32px' }}>🧴</div>
                        <h5 className="mb-0">Aditivos</h5>
                        <small className="text-muted">{counts.aditivos} productos</small>
                        {filtro === 'aditivos' && (
                            <span className="badge bg-primary mt-2">✓ Seleccionado</span>
                        )}
                    </div>
                </div>
            </div>

            {aceitesFiltrados.length === 0 ? (
                <div className="alert alert-warning">
                    {filtro === 'todos'
                        ? '⚠️ No hay aceites o aditivos registrados en el sistema.'
                        : `⚠️ No hay ${filtro === 'aceites' ? 'aceites' : 'aditivos'} registrados en el sistema.`
                    }
                </div>
            ) : (
                <div className="row">
                    {aceitesFiltrados.map(aceite => (
                        <div key={aceite.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100" style={{ borderTop: `4px solid ${getColorAceite(aceite.tipoAceite)}` }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <span style={{ fontSize: '28px' }}>{getIconoAceite(aceite.tipoAceite)}</span>
                                            {aceite.tipoAceite === 'Aditivo' && (
                                                <span className="badge bg-success ms-2">Aditivo</span>
                                            )}
                                        </div>
                                        <span className={`badge ${aceite.activo ? 'bg-success' : 'bg-secondary'}`}>
                                            {aceite.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                    <h5 className="mt-2">{aceite.nombre}</h5>
                                    <p className="text-muted small">
                                        <span className="badge bg-secondary">{aceite.codigo}</span>
                                        {aceite.marca && <span className="ms-2">Marca: {aceite.marca}</span>}
                                        {aceite.presentacion && <span className="ms-2">Presentación: {aceite.presentacion}</span>}
                                    </p>

                                    {editando === aceite.id ? (
                                        <>
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Nuevo Precio ($)</label>
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
                                                    onClick={() => handleActualizarPrecio(aceite.id)}
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
                                                <h3 className="text-success">${aceite.precioVenta?.toFixed(2) || '0.00'}</h3>
                                                <small className="text-muted">precio por unidad</small>
                                            </div>
                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() => {
                                                    setEditando(aceite.id);
                                                    setNuevoPrecio(aceite.precioVenta || 0);
                                                }}
                                            >
                                                ✏️ Cambiar Precio
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="card-footer text-muted text-center small">
                                    Stock: {aceite.stockActual || 0} unidades
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="card mt-4">
                <div className="card-header">
                    <h5 className="m-0">📋 Información importante</h5>
                </div>
                <div className="card-body">
                    <ul className="mb-0">
                        <li>Los precios se actualizan en <strong>tiempo real</strong> para todos los cortes de turno</li>
                        <li>Cada cambio de precio debe tener un <strong>motivo</strong> para trazabilidad</li>
                        <li>Los precios se obtienen del <strong>catálogo de aceites</strong></li>
                        <li>Los cortes de turno usan el precio <strong>vigente</strong> al momento del corte</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PreciosAceites;