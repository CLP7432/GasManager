import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

export default function UsuariosList() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await api.get('/usuarios', {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            setUsuarios(response.data);
        } catch (err) {
            console.error("Error:", err);
            setError(err.response?.data?.message || "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const verDetalleUsuario = (usuarioId) => {
        navigate(`/admin/usuarios/${usuarioId}`);
    };

    const editarUsuario = (usuarioId) => {
        navigate(`/admin/usuarios/${usuarioId}/editar`);
    };

    // Función para determinar si es un rol de administrador
    const esRolAdmin = (rolNombre) => {
        return ['ROLE_ADMIN', 'ADMINISTRADOR'].includes(rolNombre);
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando usuarios...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Lista de Usuarios</h2>
                    <div>
                        <button
                            className="btn btn-success me-2"
                            onClick={() => navigate('/admin/usuarios/nuevo')}
                        >
                            Nuevo Usuario
                        </button>
                        <button
                            className="btn btn-outline-secondary me-2"
                            onClick={fetchUsuarios}
                        >
                            Actualizar
                        </button>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/dashboard')}
                        >
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
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Activo</th>
                                <th>Último Acceso</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usuarios.map(usuario => (
                                <tr key={usuario.idUsuario}>
                                    <td>{usuario.idUsuario}</td>
                                    <td>{usuario.nombre || 'Sin nombre'}</td>
                                    <td>{usuario.correo}</td>
                                    <td>
                                        <span className={`badge ${esRolAdmin(usuario.rol?.nombreRol) ? 'bg-danger' : 'bg-primary'}`}>
                                            {usuario.rol?.nombreRol || 'Sin rol'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${usuario.estado === 'ACTIVO' ? 'bg-success' : 'bg-warning'}`}>
                                            {usuario.estado || 'DESCONOCIDO'}
                                        </span>
                                    </td>
                                    <td>
                                        {usuario.activo ? '✅' : '❌'}
                                    </td>
                                    <td>
                                        {usuario.ultimoAcceso
                                            ? new Date(usuario.ultimoAcceso).toLocaleString()
                                            : 'Nunca'}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info me-1"
                                            onClick={() => verDetalleUsuario(usuario.idUsuario)}
                                        >
                                            Detalles
                                        </button>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => editarUsuario(usuario.idUsuario)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {usuarios.length === 0 && !loading && (
                        <div className="alert alert-info">
                            No hay usuarios registrados en el sistema.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}