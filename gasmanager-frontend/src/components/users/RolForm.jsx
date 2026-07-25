import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rolService, permisoService } from '../../api/users/auth';

const RolForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [permisos, setPermisos] = useState([]);
    const [formData, setFormData] = useState({
        nombreRol: '',
        descripcion: '',
        permisosIds: []
    });

    useEffect(() => {
        cargarPermisos();
        if (id) {
            cargarRol();
        }
    }, [id]);

    const cargarPermisos = async () => {
        try {
            const data = await permisoService.listar();
            setPermisos(data);
        } catch (error) {
            console.error('Error al cargar permisos:', error);
        }
    };

    const cargarRol = async () => {
        try {
            const data = await rolService.obtenerPorId(id);
            setFormData({
                nombreRol: data.nombreRol,
                descripcion: data.descripcion || '',
                permisosIds: data.permisos?.map(p => p.idPermiso) || []
            });
        } catch (error) {
            console.error('Error al cargar rol:', error);
            alert('Error al cargar rol');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermisoChange = (e) => {
        const permisoId = parseInt(e.target.value);
        setFormData(prev => {
            if (prev.permisosIds.includes(permisoId)) {
                return { ...prev, permisosIds: prev.permisosIds.filter(id => id !== permisoId) };
            } else {
                return { ...prev, permisosIds: [...prev.permisosIds, permisoId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const rolData = {
                nombreRol: formData.nombreRol,
                descripcion: formData.descripcion,
                permisos: formData.permisosIds.map(id => ({ idPermiso: id }))
            };

            if (id) {
                await rolService.actualizar(id, rolData);
                alert('Rol actualizado exitosamente');
            } else {
                await rolService.crear(rolData);
                alert('Rol creado exitosamente');
            }
            navigate('/roles');
        } catch (error) {
            alert(error.response?.data?.message || 'Error al guardar rol');
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2>{id ? 'Editar Rol' : 'Nuevo Rol'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre del Rol *</label>
                        <input
                            type="text"
                            name="nombreRol"
                            value={formData.nombreRol}
                            onChange={handleChange}
                            required
                            placeholder="Ej: ADMIN, USUARIO, AUDITOR"
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción del rol"
                        />
                    </div>

                    <div className="form-group">
                        <label>Permisos</label>
                        <div className="checkbox-list">
                            {permisos.map(permiso => (
                                <div key={permiso.idPermiso} className="checkbox-item">
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={permiso.idPermiso}
                                            checked={formData.permisosIds.includes(permiso.idPermiso)}
                                            onChange={handlePermisoChange}
                                        />
                                        <span className="permiso-codigo">{permiso.codigoPermiso}</span>
                                        <span className="permiso-nombre">- {permiso.nombrePermiso}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" className="btn" onClick={() => navigate('/roles')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RolForm;