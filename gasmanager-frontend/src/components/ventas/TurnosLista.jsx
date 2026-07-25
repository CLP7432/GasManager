import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { turnosService } from '../../api/ventas/auth';
import { useAuth } from '../../contexts/AuthContext';

const TurnosLista = () => {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [nuevoTurno, setNuevoTurno] = useState({
        nombre: '',
        fechaTurno: new Date().toISOString().slice(0, 16),
        horaInicio: new Date().toLocaleTimeString().slice(0, 5),
        supervisorId: user?.idUsuario,
        supervisorNombre: user?.nombre
    });

    useEffect(() => {
        cargarTurnos();
    }, [estadoFiltro]);

    const cargarTurnos = async () => {
        setLoading(true);
        try {
            let data;
            if (estadoFiltro) {
                data = await turnosService.listarPorEstado(estadoFiltro);
            } else {
                data = await turnosService.listar();
            }
            setTurnos(data);
        } catch (error) {
            console.error('Error al cargar turnos:', error);
        }
        setLoading(false);
    };

    const handleCrearTurno = async (e) => {
        e.preventDefault();
        try {
            await turnosService.crear(nuevoTurno);
            alert('Turno creado exitosamente');
            setNuevoTurno({
                nombre: '',
                fechaTurno: new Date().toISOString().slice(0, 16),
                horaInicio: new Date().toLocaleTimeString().slice(0, 5),
                supervisorId: user?.idUsuario,
                supervisorNombre: user?.nombre
            });
            setMostrarForm(false);
            cargarTurnos();
        } catch (error) {
            alert(error.response?.data?.message || 'Error al crear turno');
        }
    };

    const handleCerrarTurno = async (id) => {
        if (window.confirm('¿Estás seguro de cerrar este turno?')) {
            try {
                await turnosService.cerrar(id);
                cargarTurnos();
                alert('✅ Turno cerrado exitosamente');
            } catch (error) {
                alert('Error al cerrar turno');
            }
        }
    };

    // ===== IR A CORTES =====
    const irACortes = () => {
        navigate('/cortes');
    };

    // ===== BADGE DE ESTADO CORREGIDO =====
    const getEstadoBadge = (estado) => {
        const config = {
            ABIERTO: {
                class: 'badge bg-success',
                text: '🟢 ABIERTO',
                color: 'white'
            },
            CERRADO: {
                class: 'badge bg-secondary',
                text: '🔒 CERRADO',
                color: 'white'
            },
            CONCILIADO: {
                class: 'badge bg-info',
                text: '📊 CONCILIADO',
                color: 'white'
            },
            AUDITADO: {
                class: 'badge bg-primary',
                text: '✅ AUDITADO',
                color: 'white'
            },
            PENDIENTE_VALIDACION: {
                class: 'badge bg-warning text-dark',
                text: '⏳ PENDIENTE VALIDACIÓN',
                color: 'black'
            },
            CANCELADO: {
                class: 'badge bg-danger',
                text: '❌ CANCELADO',
                color: 'white'
            }
        };

        const estadoConfig = config[estado] || { class: 'badge bg-secondary', text: estado, color: 'white' };

        return (
            <span className={estadoConfig.class} style={{ padding: '6px 12px', fontSize: '13px', color: estadoConfig.color }}>
                {estadoConfig.text}
            </span>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Turnos</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={irACortes}>
                        📊 Ir a Cortes de Turno
                    </button>
                    {isAdmin && (
                        <button className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
                            {mostrarForm ? 'Cancelar' : '+ Nuevo Turno'}
                        </button>
                    )}
                </div>
            </div>

            {mostrarForm && isAdmin && (
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">📝 Abrir Nuevo Turno</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleCrearTurno}>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Nombre del Turno *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nuevoTurno.nombre}
                                        onChange={(e) => setNuevoTurno({ ...nuevoTurno, nombre: e.target.value })}
                                        required
                                        placeholder="Ej: Turno Matutino"
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Fecha del Turno *</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={nuevoTurno.fechaTurno}
                                        onChange={(e) => setNuevoTurno({ ...nuevoTurno, fechaTurno: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Hora de Inicio *</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={nuevoTurno.horaInicio}
                                        onChange={(e) => setNuevoTurno({ ...nuevoTurno, horaInicio: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">
                                    🚀 Abrir Turno
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setMostrarForm(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header bg-light">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <label className="fw-bold mb-0">Filtrar por estado: </label>
                        <select
                            className="form-select"
                            style={{ width: 'auto', display: 'inline-block' }}
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="ABIERTO">🟢 Abiertos</option>
                            <option value="CERRADO">🔒 Cerrados</option>
                            <option value="CONCILIADO">📊 Conciliados</option>
                            <option value="AUDITADO">✅ Auditados</option>
                            <option value="PENDIENTE_VALIDACION">⏳ Pendientes de Validación</option>
                            <option value="CANCELADO">❌ Cancelados</option>
                        </select>
                        <button onClick={cargarTurnos} className="btn btn-secondary">
                            🔄 Actualizar
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando turnos...</p>
                        </div>
                    ) : turnos.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-muted">No hay turnos registrados</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Fecha</th>
                                    <th>Hora Inicio</th>
                                    <th>Supervisor</th>
                                    <th>Ventas</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {turnos.map(turno => (
                                    <tr key={turno.id}>
                                        <td>{turno.id}</td>
                                        <td><strong>{turno.codigoTurno}</strong></td>
                                        <td>{turno.nombre}</td>
                                        <td>{new Date(turno.fechaTurno).toLocaleDateString()}</td>
                                        <td>{turno.horaInicio}</td>
                                        <td>{turno.supervisorNombre || turno.supervisorId}</td>
                                        <td className="text-center">{turno.numeroVentas || 0}</td>
                                        <td className="text-end fw-bold">${turno.totalVentas?.toFixed(2) || '0.00'}</td>
                                        <td>{getEstadoBadge(turno.estado)}</td>
                                        <td>
                                            <div className="btn-group btn-group-sm" role="group">
                                                {turno.estado === 'ABIERTO' && (
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleCerrarTurno(turno.id)}
                                                        title="Cerrar turno"
                                                    >
                                                        🔒 Cerrar
                                                    </button>
                                                )}
                                                {turno.estado === 'CERRADO' && (
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={irACortes}
                                                        title="Ir a Cortes de Turno"
                                                    >
                                                        📊 Corte
                                                    </button>
                                                )}
                                                {turno.estado === 'ABIERTO' && (
                                                    <button
                                                        className="btn btn-info"
                                                        onClick={() => navigate(`/monitor-dispensarios`)}
                                                        title="Ir al Punto de Venta"
                                                    >
                                                        ⛽ Vender
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TurnosLista;