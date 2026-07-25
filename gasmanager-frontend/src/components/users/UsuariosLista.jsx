import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService, rolService } from '../../api/users/auth';
import { useAuth } from '../../contexts/AuthContext';

const UsuariosLista = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [roles, setRoles] = useState([]);
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: '',
        correo: '',
        password: '',
        rolId: '2'
    });
    const { isAdmin } = useAuth();

    useEffect(() => {
        cargarUsuarios();
        cargarRoles();
    }, [filtro]);

    const cargarRoles = async () => {
        try {
            const data = await rolService.listarActivos();
            setRoles(data);
        } catch (error) {
            console.error('Error al cargar roles:', error);
        }
    };

    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            let data;
            if (filtro === 'activos') {
                data = await usuarioService.listarActivos();
            } else if (filtro === 'bloqueados') {
                data = await usuarioService.listarBloqueados();
            } else {
                data = await usuarioService.listar();
            }
            setUsuarios(data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
        setLoading(false);
    };

    const handleDesactivar = async (id) => {
        if (window.confirm('¿Estás seguro de desactivar este usuario?')) {
            try {
                await usuarioService.desactivar(id);
                cargarUsuarios();
            } catch (error) {
                alert('Error al desactivar usuario');
            }
        }
    };

    const handleCrearUsuario = async (e) => {
        e.preventDefault();
        try {
            const usuarioData = {
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo,
                password: nuevoUsuario.password,
                rol: { idRol: parseInt(nuevoUsuario.rolId) }
            };
            await usuarioService.crear(usuarioData);
            alert('Usuario creado exitosamente');
            setNuevoUsuario({ nombre: '', correo: '', password: '', rolId: '2' });
            setMostrarForm(false);
            cargarUsuarios();
        } catch (error) {
            alert(error.response?.data?.message || 'Error al crear usuario');
        }
    };

    const getEstadoBadge = (usuario) => {
        if (usuario.bloqueado) return <span className="badge badge-danger">Bloqueado</span>;
        if (!usuario.activo) return <span className="badge badge-warning">Inactivo</span>;
        return <span className="badge badge-success">Activo</span>;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Usuarios</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
                        {mostrarForm ? 'Cancelar' : '+ Nuevo Usuario'}
                    </button>
                )}
            </div>

            {mostrarForm && isAdmin && (
                <div className="card">
                    <h3>Crear Nuevo Usuario</h3>
                    <form onSubmit={handleCrearUsuario}>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={nuevoUsuario.nombre}
                                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Correo</label>
                            <input
                                type="email"
                                value={nuevoUsuario.correo}
                                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                value={nuevoUsuario.password}
                                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="form-group">
                            <label>Rol</label>
                            <select
                                value={nuevoUsuario.rolId}
                                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rolId: e.target.value })}
                                required
                            >
                                {roles.map(rol => (
                                    <option key={rol.idRol} value={rol.idRol}>
                                        {rol.nombreRol}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </div>
            )}

            <div className="card">
                <div style={{ marginBottom: '15px' }}>
                    <label>Filtrar: </label>
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value)} style={{ marginLeft: '10px', padding: '5px' }}>
                        <option value="todos">Todos</option>
                        <option value="activos">Activos</option>
                        <option value="bloqueados">Bloqueados</option>
                    </select>
                    <button onClick={cargarUsuarios} style={{ marginLeft: '10px', padding: '5px 10px' }}>Actualizar</button>
                </div>

                {loading ? (
                    <p>Cargando usuarios...</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Intentos</th>
                                {isAdmin && <th>Acciones</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {usuarios.map(usuario => (
                                <tr key={usuario.idUsuario}>
                                    <td>{usuario.idUsuario}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.correo}</td>
                                    <td>{usuario.rol?.nombreRol || 'Sin rol'}</td>
                                    <td>{getEstadoBadge(usuario)}</td>
                                    <td>{usuario.intentosFallidos}</td>
                                    {isAdmin && (
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }}
                                                onClick={() => navigate(`/usuarios/editar/${usuario.idUsuario}`)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '4px 8px', fontSize: '12px' }}
                                                onClick={() => handleDesactivar(usuario.idUsuario)}
                                                disabled={!usuario.activo}
                                            >
                                                Desactivar
                                            </button>
                                        </td>
                                    )}
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

export default UsuariosLista;