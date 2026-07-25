import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { permisoService } from '../../api/users/auth';
import { useAuth } from '../../contexts/AuthContext';

const PermisosLista = () => {
    const navigate = useNavigate();
    const [permisos, setPermisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    useEffect(() => {
        cargarPermisos();
    }, []);

    const cargarPermisos = async () => {
        setLoading(true);
        try {
            const data = await permisoService.listar();
            setPermisos(data);
        } catch (error) {
            console.error('Error al cargar permisos:', error);
        }
        setLoading(false);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este permiso?')) {
            try {
                await permisoService.eliminar(id);
                cargarPermisos();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al eliminar permiso');
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Permisos</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/permisos/nuevo')}>
                        + Nuevo Permiso
                    </button>
                )}
            </div>

            <div className="card">
                {loading ? (
                    <p>Cargando permisos...</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                {isAdmin && <th>Acciones</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {permisos.map(permiso => (
                                <tr key={permiso.idPermiso}>
                                    <td>{permiso.idPermiso}</td>
                                    <td><code>{permiso.codigoPermiso}</code></td>
                                    <td>{permiso.nombrePermiso}</td>
                                    <td>{permiso.descripcion}</td>
                                    <td>
                                            <span className={`badge ${permiso.activo ? 'badge-success' : 'badge-danger'}`}>
                                                {permiso.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }}
                                                onClick={() => navigate(`/permisos/editar/${permiso.idPermiso}`)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '4px 8px', fontSize: '12px' }}
                                                onClick={() => handleEliminar(permiso.idPermiso)}
                                                disabled={!permiso.activo}
                                            >
                                                Eliminar
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

export default PermisosLista;