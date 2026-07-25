import React, { useState, useEffect, useCallback } from 'react';
import { recompensasService, extractApiError } from '../../api/lealtad/auth.js';

const GestionRecompensas = () => {
    const [recompensas, setRecompensas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    const cargarRecompensas = useCallback(async () => {
        setLoading(true);
        setMensaje(null);
        try {
            const data = await recompensasService.listar();
            setRecompensas(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setMensaje({ tipo: 'error', texto: extractApiError(err, 'Error al cargar recompensas') });
            setRecompensas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargarRecompensas(); }, [cargarRecompensas]);

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h2>Catalogo de Recompensas</h2>
                <p style={{ color: '#666', marginTop: '10px' }}>
                    Administra recompensas directamente en la base de datos del microservicio de lealtad.
                </p>
            </div>
            {mensaje && (
                <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'}`} role="alert">
                    {mensaje.texto}
                </div>
            )}
            <div className="mb-4">
                <button className="btn btn-secondary" onClick={cargarRecompensas} disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar catalogo'}
                </button>
            </div>
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr><th>ID</th><th>Nombre</th><th>Descripcion</th><th>Costo (puntos)</th><th>Estado</th></tr>
                        </thead>
                        <tbody>
                            {recompensas.map(recompensa => (
                                <tr key={recompensa.id}>
                                    <td>{recompensa.id}</td>
                                    <td><strong>{recompensa.nombre}</strong></td>
                                    <td>{recompensa.descripcion || '-'}</td>
                                    <td><span className="badge bg-primary">{recompensa.costoPuntos} pts</span></td>
                                    <td>
                                        <span className={`badge ${recompensa.estado === 'ACTIVO' ? 'bg-success' : 'bg-secondary'}`}>
                                            {recompensa.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recompensas.length === 0 && !loading && (
                                <tr><td colSpan="5" className="text-center">No hay recompensas activas en la base de datos</td></tr>
                            )}
                            {loading && (
                                <tr><td colSpan="5" className="text-center">Cargando recompensas...</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GestionRecompensas;
