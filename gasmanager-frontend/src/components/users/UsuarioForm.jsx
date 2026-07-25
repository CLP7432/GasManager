import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usuarioService, rolService } from '../../api/users/auth';

const UsuarioForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        password: '',
        rolId: ''
    });

    useEffect(() => {
        cargarRoles();
        if (id) {
            cargarUsuario();
        }
    }, [id]);

    const cargarRoles = async () => {
        try {
            const data = await rolService.listarActivos();
            setRoles(data);
        } catch (error) {
            console.error('Error al cargar roles:', error);
        }
    };

    const cargarUsuario = async () => {
        try {
            const data = await usuarioService.obtenerPorId(id);
            setFormData({
                nombre: data.nombre,
                correo: data.correo,
                password: '',
                rolId: data.rol?.idRol || ''
            });
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            alert('Error al cargar usuario');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const usuarioData = {
                nombre: formData.nombre,
                correo: formData.correo,
                password: formData.password,
                rol: { idRol: parseInt(formData.rolId) }
            };

            if (id) {
                await usuarioService.actualizar(id, usuarioData);
                alert('Usuario actualizado exitosamente');
            } else {
                await usuarioService.crear(usuarioData);
                alert('Usuario creado exitosamente');
            }
            navigate('/usuarios');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error al guardar usuario';
            alert(errorMsg);
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2>{id ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Nombre completo"
                        />
                    </div>

                    <div className="form-group">
                        <label>Correo Electrónico *</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                            disabled={!!id}
                            placeholder="usuario@ejemplo.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>{id ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!id}
                            minLength={6}
                            placeholder={id ? 'Dejar vacío para mantener actual' : 'Mínimo 6 caracteres'}
                        />
                    </div>

                    <div className="form-group">
                        <label>Rol *</label>
                        <select
                            name="rolId"
                            value={formData.rolId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un rol</option>
                            {roles.map(rol => (
                                <option key={rol.idRol} value={rol.idRol}>
                                    {rol.nombreRol}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" className="btn" onClick={() => navigate('/usuarios')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsuarioForm;