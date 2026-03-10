import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

export default function PermisoList() {

    const { auth } = useAuth();
    const [permisos, setPermisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPermisos();
    }, []);

    const fetchPermisos = async () => {
        try {
            const response = await api.get('/permisos', {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setPermisos(response.data);
        } catch (err) {
            console.error("Error cargando permisos:", err);
            setError(err.response?.data?.message || "Error al cargar permisos");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando permisos...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Lista de Permisos</h2>
                    <div>
                        <button className="btn btn-success me-2" onClick={() => alert('Abrir modal de creación')}>
                            Nuevo Permiso
                        </button>
                        <button className="btn btn-outline-secondary me-2" onClick={fetchPermisos}>
                            Actualizar
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => navigate('/dashboard')}>
                            Volver al Dashboard
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Activo</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {permisos.map(permiso => (
                                <tr key={permiso.idPermiso}>
                                    <td>{permiso.idPermiso}</td>
                                    <td>
                                        <code>{permiso.codigoPermiso}</code>
                                    </td>
                                    <td>{permiso.nombrePermiso}</td>
                                    <td>{permiso.descripcion || 'Sin descripción'}</td>
                                    <td>
                                        {permiso.activo ? '✅' : '❌'}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => alert('Eliminar permiso')}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}