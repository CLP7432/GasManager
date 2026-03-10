import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

export default function UsuarioForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();

    const [loading, setLoading] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [error, setError] = useState(null);
    const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        password: '',
        rol: { idRol: '' },
        estado: 'ACTIVO'
    });

    const esEdicion = !!id;

    useEffect(() => {
        cargarRoles();
        if (esEdicion) {
            cargarUsuario();
        }
    }, [id]);

    const cargarRoles = async () => {
        try {
            const response = await api.get('/roles/activos', {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setRoles(response.data);
        } catch (err) {
            console.error("Error cargando roles:", err);
            // Fallback mejorado con ROLE_ADMIN
            setRoles([
                { idRol: 1, nombreRol: 'ROLE_ADMIN' },
                { idRol: 2, nombreRol: 'ADMINISTRADOR' },
                { idRol: 3, nombreRol: 'SUPERVISOR' },
                { idRol: 4, nombreRol: 'DESPACHADOR' },
                { idRol: 5, nombreRol: 'CONTADOR' }
            ]);
        } finally {
            setLoadingRoles(false);
        }
    };

    const cargarUsuario = async () => {
        try {
            const response = await api.get(`/usuarios/${id}`, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            const usuario = response.data;
            setFormData({
                nombre: usuario.nombre || '',
                correo: usuario.correo || '',
                password: '', // No cargamos password por seguridad
                rol: usuario.rol || { idRol: '' },
                estado: usuario.estado || 'ACTIVO'
            });
        } catch (err) {
            console.error("Error cargando usuario:", err);
            setError('Error al cargar usuario: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'rol') {
            setFormData({
                ...formData,
                rol: { idRol: parseInt(value) }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validaciones básicas
        if (!formData.nombre.trim()) {
            setError('El nombre es requerido');
            setLoading(false);
            return;
        }
        if (!formData.correo.trim()) {
            setError('El correo es requerido');
            setLoading(false);
            return;
        }
        if (!esEdicion && !formData.password) {
            setError('La contraseña es requerida para nuevo usuario');
            setLoading(false);
            return;
        }
        if (!formData.rol.idRol) {
            setError('Debe seleccionar un rol');
            setLoading(false);
            return;
        }

        try {
            if (esEdicion) {
                // Actualizar usuario (sin password si está vacío)
                const datosActualizacion = { ...formData };
                if (!datosActualizacion.password) {
                    delete datosActualizacion.password;
                }
                await api.put(`/usuarios/${id}`, datosActualizacion, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                alert('Usuario actualizado exitosamente');
            } else {
                // Crear nuevo usuario
                await api.post('/usuarios', formData, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                alert('Usuario creado exitosamente');
            }

            navigate('/admin/usuarios');
        } catch (err) {
            console.error("Error guardando usuario:", err);
            const errorMsg = err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al guardar usuario';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (loadingRoles) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando formulario...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">
                        {esEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h2>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/admin/usuarios')}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>

                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Nombre *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                    {esEdicion && (
                                        <small className="text-muted">
                                            Cambiar el correo puede afectar el inicio de sesión
                                        </small>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        {esEdicion ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required={!esEdicion}
                                        disabled={loading}
                                        placeholder={esEdicion ? "••••••••" : ""}
                                        minLength="6"
                                    />
                                    <small className="text-muted">
                                        Mínimo 6 caracteres
                                    </small>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Rol *</label>
                                    <select
                                        className="form-select"
                                        name="rol"
                                        value={formData.rol.idRol || ''}
                                        onChange={handleChange}
                                        required
                                        disabled={loading || roles.length === 0}
                                    >
                                        <option value="">Seleccionar rol...</option>
                                        {roles.map(rol => (
                                            <option key={rol.idRol} value={rol.idRol}>
                                                {rol.nombreRol}
                                            </option>
                                        ))}
                                    </select>
                                    {roles.length === 0 && (
                                        <small className="text-danger">
                                            No hay roles disponibles. Contacte al administrador.
                                        </small>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-select"
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <option value="ACTIVO">Activo</option>
                                        <option value="INACTIVO">Inactivo</option>
                                        <option value="BLOQUEADO">Bloqueado</option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary me-2"
                                        disabled={loading || roles.length === 0}
                                    >
                                        {loading ? 'Guardando...' : 'Guardar Usuario'}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/admin/usuarios')}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}