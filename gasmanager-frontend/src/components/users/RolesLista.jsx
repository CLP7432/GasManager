import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rolService } from '../../api/users/auth';
import { useAuth } from '../../contexts/AuthContext';

const RolesLista = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    useEffect(() => {
        cargarRoles();
    }, []);

    const cargarRoles = async () => {
        setLoading(true);
        try {
            const data = await rolService.listar();
            setRoles(data);
        } catch (error) {
            console.error('Error al cargar roles:', error);
        }
        setLoading(false);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este rol?')) {
            try {
                await rolService.eliminar(id);
                cargarRoles();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al eliminar rol');
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Roles</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/roles/nuevo')}>
                        + Nuevo Rol
                    </button>
                )}
            </div>

            {loading ? (
                <div className="card">Cargando roles...</div>
            ) : (
                roles.map(rol => (
                    <div className="card" key={rol.idRol}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3>{rol.nombreRol}</h3>
                                <p>{rol.descripcion || 'Sin descripción'}</p>
                                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                    Creado: {new Date(rol.fechaCreacion).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <span className={`badge ${rol.activo ? 'badge-success' : 'badge-danger'}`}>
                                    {rol.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>

                        <div style={{ marginTop: '15px' }}>
                            <h4>Permisos Asignados:</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                {rol.permisos?.length > 0 ? (
                                    rol.permisos.map(permiso => (
                                        <span key={permiso.idPermiso} style={{
                                            backgroundColor: '#e9ecef',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            {permiso.codigoPermiso}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ color: '#666', fontSize: '12px' }}>Sin permisos asignados</span>
                                )}
                            </div>
                        </div>

                        {isAdmin && (
                            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                <button
                                    className="btn btn-primary"
                                    style={{ padding: '4px 12px', fontSize: '12px' }}
                                    onClick={() => navigate(`/roles/editar/${rol.idRol}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{ padding: '4px 12px', fontSize: '12px' }}
                                    onClick={() => handleEliminar(rol.idRol)}
                                    disabled={!rol.activo}
                                >
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default RolesLista;