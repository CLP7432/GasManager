
import React, { useState, useEffect } from 'react';
import { auditoriaService } from '../../api/users/auth';
import { useAuth } from '../../contexts/AuthContext';

const AuditoriaLista = () => {
    const [auditorias, setAuditorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroUsuario, setFiltroUsuario] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const { user, isAdmin } = useAuth();

    useEffect(() => {
        cargarAuditorias();
    }, []);

    const cargarAuditorias = async () => {
        setLoading(true);
        try {
            let data;
            if (filtroUsuario) {
                data = await auditoriaService.listarPorUsuario(filtroUsuario);
            } else if (fechaInicio && fechaFin) {
                data = await auditoriaService.listarPorRango(fechaInicio, fechaFin);
            } else {
                data = await auditoriaService.listarTodas();
            }
            setAuditorias(data);
        } catch (error) {
            console.error('Error al cargar auditorías:', error);
        }
        setLoading(false);
    };

    const handleFiltrar = () => {
        cargarAuditorias();
    };

    const limpiarFiltros = () => {
        setFiltroUsuario('');
        setFechaInicio('');
        setFechaFin('');
        cargarAuditorias();
    };

    const getTipoBadge = (tipo) => {
        const colores = {
            CREAR: 'badge-success',
            ACTUALIZAR: 'badge-warning',
            ELIMINAR: 'badge-danger',
            LEER: 'badge-info',
            VALIDAR: 'badge-info'
        };
        return `badge ${colores[tipo] || 'badge-secondary'}`;
    };

    return (
        <div>
            <h2>Registro de Auditoría</h2>

            <div className="card" style={{ marginBottom: '20px' }}>
                <h3>Filtros</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {isAdmin && (
                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label>ID Usuario</label>
                            <input
                                type="number"
                                value={filtroUsuario}
                                onChange={(e) => setFiltroUsuario(e.target.value)}
                                placeholder="Filtrar por usuario"
                                style={{ width: '150px' }}
                            />
                        </div>
                    )}
                    <div className="form-group" style={{ marginBottom: '0' }}>
                        <label>Fecha Inicio</label>
                        <input
                            type="datetime-local"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            style={{ width: '200px' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0' }}>
                        <label>Fecha Fin</label>
                        <input
                            type="datetime-local"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            style={{ width: '200px' }}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleFiltrar}>
                        Filtrar
                    </button>
                    <button className="btn" onClick={limpiarFiltros}>
                        Limpiar
                    </button>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <p>Cargando auditorías...</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha/Hora</th>
                                <th>Usuario</th>
                                <th>Tipo</th>
                                <th>Módulo</th>
                                <th>Descripción</th>
                                <th>Origen</th>
                            </tr>
                            </thead>
                            <tbody>
                            {auditorias.map(aud => (
                                <tr key={aud.idAuditoria}>
                                    <td>{aud.idAuditoria}</td>
                                    <td>{new Date(aud.fechaHora).toLocaleString()}</td>
                                    <td>{aud.idUsuarioEjecutor || 'Sistema'}</td>
                                    <td>
                                            <span className={getTipoBadge(aud.tipoAcccion)}>
                                                {aud.tipoAcccion}
                                            </span>
                                    </td>
                                    <td>{aud.moduloAfectado || '-'}</td>
                                    <td style={{ maxWidth: '300px' }}>
                                        <details>
                                            <summary style={{ cursor: 'pointer' }}>
                                                {aud.descripcion?.substring(0, 50)}...
                                            </summary>
                                            {aud.datosAnteriores && (
                                                <div style={{ marginTop: '5px', fontSize: '11px', color: '#666' }}>
                                                    <strong>Datos anteriores:</strong>
                                                    <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0' }}>
                                                            {JSON.stringify(JSON.parse(aud.datosAnteriores || '{}'), null, 2)}
                                                        </pre>
                                                </div>
                                            )}
                                            {aud.datosNuevos && (
                                                <div style={{ marginTop: '5px', fontSize: '11px', color: '#666' }}>
                                                    <strong>Datos nuevos:</strong>
                                                    <pre style={{ whiteSpace: 'pre-wrap', margin: '5px 0' }}>
                                                            {JSON.stringify(JSON.parse(aud.datosNuevos || '{}'), null, 2)}
                                                        </pre>
                                                </div>
                                            )}
                                        </details>
                                    </td>
                                    <td>{aud.origen || '-'}</td>
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

export default AuditoriaLista;