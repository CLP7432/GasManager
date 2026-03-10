import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

export default function RolesList() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await api.get('/roles', {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setRoles(response.data);
        } catch (err) {
            console.error("Error cargando roles:", err);
            setError(err.response?.data?.message || "Error al cargar roles");
        } finally {
            setLoading(false);
        }
    };

    const verDetalleRol = (rolId) => {
        navigate(`/admin/roles/${rolId}`);
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando roles...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Lista de Roles</h2>
                    <div>
                        <button
                            className="btn btn-success me-2"
                            onClick={() => alert('Crear nuevo rol')}
                        >
                            Nuevo Rol
                        </button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={fetchRoles}
                        >
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
                                <th>Nombre del Rol</th>
                                <th>Descripción</th>
                                <th>Activo</th>
                                <th>Permisos</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {roles.map(rol => (
                                <tr key={rol.idRol}>
                                    <td>{rol.idRol}</td>
                                    <td>
                                        <strong>{rol.nombreRol}</strong>
                                    </td>
                                    <td>{rol.descripcion || 'Sin descripción'}</td>
                                    <td>
                                        {rol.activo ? '✅' : '❌'}
                                    </td>
                                    <td>
                                        <span className="badge bg-info">
                                            {rol.permisos?.length || 0} permisos
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info me-1"
                                            onClick={() => verDetalleRol(rol.idRol)}
                                        >
                                            Ver Permisos
                                        </button>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => alert('Editar rol')}
                                        >
                                            Editar
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