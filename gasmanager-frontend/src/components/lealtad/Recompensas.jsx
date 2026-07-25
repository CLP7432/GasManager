import React, { useState, useEffect } from 'react';
import { recompensasService } from '../../api/lealtad/recompensasConfig.js';

const Recompensas = () => {
    const [recompensas, setRecompensas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');

    const cargarRecompensas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await recompensasService.listar();
            setRecompensas(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Error al cargar las recompensas');
            setRecompensas([]);
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        Promise.resolve().then(cargarRecompensas);
    }, []);

    const crearRecompensa = async (e) => {
        e.preventDefault();
        try {
            await recompensasService.crear({
                nombre,
                descripcion,
                costoPuntos: costo,
                activo: true
            });
            setNombre('');
            setDescripcion('');
            setCosto('');
            cargarRecompensas();
        } catch (err) {
            setError('Error al crear recompensa');
            console.error(err);
        }
    };

    const eliminarRecompensa = async (id) => {
        try {
            await recompensasService.eliminar(id);
            cargarRecompensas();
        } catch (err) {
            setError('Error al eliminar recompensa');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="card p-4">Cargando recompensas...</div>;
    }

    return (
        <div>
            <h2>Catalogo de Recompensas</h2>

            <div className="card mb-4">
                <div className="table-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Costo (puntos)</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={descripcion}
                                    onChange={e => setDescripcion(e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={costo}
                                    onChange={e => setCosto(e.target.value)}
                                    min="1"
                                    required
                                />
                            </td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={crearRecompensa}
                                >
                                    Crear
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Costo (puntos)</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recompensas.map(r => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td><strong>{r.nombre}</strong></td>
                                <td>{r.descripcion || '-'}</td>
                                <td>
                                    <span className="badge bg-primary">{r.costoPuntos} pts</span>
                                </td>
                                <td>
                                    <span className={`badge ${r.activo ? 'bg-success' : 'bg-secondary'}`}>
                                        {r.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => eliminarRecompensa(r.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {recompensas.length === 0 && !error && (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No hay recompensas activas en la base de datos
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

export default Recompensas;
