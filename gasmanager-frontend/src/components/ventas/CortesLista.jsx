import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cortesService, turnosService } from '../../api/ventas/auth';
import { useAuth } from '../../contexts/AuthContext';

const CortesLista = () => {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [cortes, setCortes] = useState([]);
    const [turnosDisponibles, setTurnosDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState('');
    const [generando, setGenerando] = useState(false);

    useEffect(() => {
        cargarCortes();
        cargarTurnosDisponibles();
    }, [estadoFiltro]);

    const cargarCortes = async () => {
        setLoading(true);
        try {
            let data;
            if (estadoFiltro) {
                data = await cortesService.listarPorEstado(estadoFiltro);
            } else {
                data = await cortesService.listar();
            }
            setCortes(data);
        } catch (error) {
            console.error('Error al cargar cortes:', error);
        }
        setLoading(false);
    };

    const cargarTurnosDisponibles = async () => {
        try {
            // Obtener todos los turnos cerrados
            const turnosCerrados = await turnosService.listarPorEstado('CERRADO');

            // Obtener los cortes existentes para saber qué turnos ya tienen corte
            const cortesExistentes = await cortesService.listar();
            const turnosConCorte = new Set(cortesExistentes.map(c => c.turnoId));

            // Filtrar solo turnos que NO tienen corte
            const disponibles = turnosCerrados.filter(t => !turnosConCorte.has(t.id));
            setTurnosDisponibles(disponibles);
        } catch (error) {
            console.error('Error al cargar turnos:', error);
        }
    };

    const handleGenerarCorte = async (e) => {
        e.preventDefault();
        setGenerando(true);
        try {
            await cortesService.generarDesdeTurno(turnoSeleccionado);
            alert('✅ Corte generado exitosamente');
            setTurnoSeleccionado('');
            setMostrarForm(false);
            cargarCortes();
            cargarTurnosDisponibles();
        } catch (error) {
            const mensaje = error.response?.data?.message || 'Error al generar corte';
            alert(`❌ ${mensaje}`);
        }
        setGenerando(false);
    };

    const handleValidarCorte = async (id) => {
        if (window.confirm('¿Validar este corte? El supervisor confirma que los datos son correctos.')) {
            try {
                await cortesService.validar(id, user?.idUsuario, user?.nombre);
                alert('✅ Corte validado exitosamente');
                cargarCortes();
            } catch (error) {
                alert('❌ Error al validar corte');
            }
        }
    };

    const handleCerrarCorte = async (id) => {
        if (window.confirm('¿Cerrar este corte? Esta acción finaliza el proceso.')) {
            try {
                await cortesService.cerrar(id);
                alert('✅ Corte cerrado exitosamente');
                cargarCortes();
            } catch (error) {
                alert('❌ Error al cerrar corte');
            }
        }
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            PENDIENTE: 'badge bg-warning text-dark',
            VALIDADO: 'badge bg-info text-white',
            CERRADO: 'badge bg-success text-white',
            RECHAZADO: 'badge bg-danger text-white',
            CON_DIFERENCIAS: 'badge bg-secondary text-white'
        };
        const textos = {
            PENDIENTE: '⏳ PENDIENTE',
            VALIDADO: '✓ VALIDADO',
            CERRADO: '✅ CERRADO',
            RECHAZADO: '❌ RECHAZADO',
            CON_DIFERENCIAS: '⚠️ CON DIFERENCIAS'
        };
        return <span className={colores[estado] || 'badge bg-secondary'} style={{ padding: '6px 12px' }}>{textos[estado] || estado}</span>;
    };

    if (loading) {
        return <div className="card">Cargando cortes...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Cortes de Turno</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
                        {mostrarForm ? 'Cancelar' : '+ Generar Corte'}
                    </button>
                )}
            </div>

            {mostrarForm && isAdmin && (
                <div className="card mb-4">
                    <h3>Generar Corte desde Turno</h3>
                    {turnosDisponibles.length === 0 ? (
                        <div className="alert alert-warning">
                            ⚠️ No hay turnos cerrados disponibles para generar corte. Todos los turnos cerrados ya tienen corte asociado.
                        </div>
                    ) : (
                        <form onSubmit={handleGenerarCorte}>
                            <div className="form-group mb-3">
                                <label>Seleccionar Turno *</label>
                                <select
                                    className="form-select"
                                    value={turnoSeleccionado}
                                    onChange={(e) => setTurnoSeleccionado(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un turno cerrado</option>
                                    {turnosDisponibles.map(turno => (
                                        <option key={turno.id} value={turno.id}>
                                            {turno.codigoTurno} - {turno.nombre} ({new Date(turno.fechaTurno).toLocaleDateString()}) - ${turno.totalVentas?.toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                                <small className="text-muted">Solo se muestran turnos que aún no tienen corte</small>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={generando}>
                                {generando ? 'Generando...' : 'Generar Corte'}
                            </button>
                        </form>
                    )}
                </div>
            )}

            <div className="card">
                <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label>Filtrar por estado: </label>
                    <select className="form-select" style={{ width: 'auto' }} value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="PENDIENTE">Pendientes</option>
                        <option value="VALIDADO">Validados</option>
                        <option value="CERRADO">Cerrados</option>
                    </select>
                    <button onClick={cargarCortes} className="btn btn-secondary">Actualizar</button>
                </div>

                {cortes.length === 0 ? (
                    <p className="text-center py-4">No hay cortes registrados</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead className="table-dark">
                            <tr>
                                <th>Código</th>
                                <th>Turno</th>
                                <th>Despachador</th>
                                <th>Fecha Corte</th>
                                <th>Total Ventas</th>
                                <th>Efectivo a Entregar</th>
                                <th>Diferencia</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cortes.map(corte => (
                                <tr key={corte.id}>
                                    <td><code className="fw-bold">{corte.codigoCorte}</code></td>
                                    <td>{corte.turnoNombre || corte.turnoId}</td>
                                    <td>{corte.despachadorNombre || '-'}</td>
                                    <td>{new Date(corte.createdAt).toLocaleString()}</td>
                                    <td className="text-end fw-bold">${corte.totalVentaCombustiblesYAceites?.toFixed(2) || '0.00'}</td>
                                    <td className="text-end text-success fw-bold">${corte.efectivoQueDebeEntregar?.toFixed(2) || '0.00'}</td>
                                    <td className={`text-end fw-bold ${corte.diferencia < 0 ? 'text-danger' : corte.diferencia > 0 ? 'text-success' : 'text-secondary'}`}>
                                        ${corte.diferencia?.toFixed(2) || '0.00'}
                                    </td>
                                    <td>{getEstadoBadge(corte.estado)}</td>
                                    <td>
                                        <div className="btn-group btn-group-sm" role="group">
                                            {corte.estado === 'PENDIENTE' && isAdmin && (
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleValidarCorte(corte.id)}
                                                    title="Validar corte"
                                                >
                                                    ✓ Validar
                                                </button>
                                            )}
                                            {corte.estado === 'VALIDADO' && isAdmin && (
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleCerrarCorte(corte.id)}
                                                    title="Cerrar corte"
                                                >
                                                    🔒 Cerrar
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => navigate(`/cortes/${corte.id}`)}
                                                title="Ver detalle"
                                            >
                                                👁 Ver
                                            </button>
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
    );
};

export default CortesLista;