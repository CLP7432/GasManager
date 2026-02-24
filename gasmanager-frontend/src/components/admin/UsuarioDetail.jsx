import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

export default function UsuarioDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarUsuario();
    }, [id]);

    const cargarUsuario = async () => {
        try {
            const response = await api.get(`/usuarios/${id}`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setUsuario(response.data);
        } catch (err) {
            console.error("Error cargando usuario:", err);
            setError(err.response?.data?.message || "Error al cargar usuario");
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = () => {
        navigate(`/admin/usuarios/${id}/editar`);
    };

    const handleDesactivar = async () => {
        if (!window.confirm('¿Estás seguro de desactivar este usuario?')) {
            return;
        }

        try {
            await api.delete(`/usuarios/${id}`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            alert('Usuario desactivado exitosamente');
            navigate('/admin/usuarios');
        } catch (err) {
            console.error("Error desactivando usuario:", err);
            alert('Error al desactivar usuario');
        }
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando usuario...</p>
            </div>
        );
    }

    if (error || !usuario) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error || 'Usuario no encontrado'}
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/usuarios')}
                >
                    Volver a la lista
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Detalle del Usuario</h2>
                    <div>
                        <button
                            className="btn btn-outline-secondary me-2"
                            onClick={() => navigate('/admin/usuarios')}
                        >
                            Volver a la lista
                        </button>
                        <button
                            className="btn btn-primary me-2"
                            onClick={handleEditar}
                        >
                            Editar Usuario
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleDesactivar}
                            disabled={!usuario.activo}
                        >
                            {usuario.activo ? 'Desactivar Usuario' : 'Usuario Inactivo'}
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Información Básica</h5>
                            <table className="table">
                                <tbody>
                                <tr>
                                    <th>ID:</th>
                                    <td>{usuario.idUsuario}</td>
                                </tr>
                                <tr>
                                    <th>Nombre:</th>
                                    <td>{usuario.nombre || 'No especificado'}</td>
                                </tr>
                                <tr>
                                    <th>Correo:</th>
                                    <td>{usuario.correo}</td>
                                </tr>
                                <tr>
                                    <th>Rol:</th>
                                    <td>
                                            <span className={`badge ${usuario.rol?.nombreRol === 'ADMINISTRADOR' ? 'bg-danger' : 'bg-primary'}`}>
                                                {usuario.rol?.nombreRol || 'Sin rol asignado'}
                                            </span>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="col-md-6">
                            <h5>Estado y Seguridad</h5>
                            <table className="table">
                                <tbody>
                                <tr>
                                    <th>Estado:</th>
                                    <td>
                                            <span className={`badge ${usuario.estado === 'ACTIVO' ? 'bg-success' : 'bg-warning'}`}>
                                                {usuario.estado || 'DESCONOCIDO'}
                                            </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Activo:</th>
                                    <td>{usuario.activo ? '✅ Sí' : '❌ No'}</td>
                                </tr>
                                <tr>
                                    <th>Bloqueado:</th>
                                    <td>{usuario.bloqueado ? '✅ Sí' : '❌ No'}</td>
                                </tr>
                                <tr>
                                    <th>Intentos fallidos:</th>
                                    <td>{usuario.intentosFallidos}</td>
                                </tr>
                                <tr>
                                    <th>Fecha creación:</th>
                                    <td>{new Date(usuario.fechaCreacion).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th>Último acceso:</th>
                                    <td>
                                        {usuario.ultimoAcceso
                                            ? new Date(usuario.ultimoAcceso).toLocaleString()
                                            : 'Nunca'}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}