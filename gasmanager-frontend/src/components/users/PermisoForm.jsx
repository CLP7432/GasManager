import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { permisoService } from '../../api/users/auth';

const PermisoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        codigoPermiso: '',
        nombrePermiso: '',
        descripcion: '',
        activo: true
    });

    useEffect(() => {
        if (id) {
            cargarPermiso();
        }
    }, [id]);

    const cargarPermiso = async () => {
        try {
            const data = await permisoService.obtenerPorId(id);
            setFormData({
                codigoPermiso: data.codigoPermiso,
                nombrePermiso: data.nombrePermiso,
                descripcion: data.descripcion || '',
                activo: data.activo
            });
        } catch (error) {
            console.error('Error al cargar permiso:', error);
            alert('Error al cargar permiso');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await permisoService.actualizar(id, formData);
                alert('Permiso actualizado exitosamente');
            } else {
                await permisoService.crear(formData);
                alert('Permiso creado exitosamente');
            }
            navigate('/permisos');
        } catch (error) {
            alert(error.response?.data?.message || 'Error al guardar permiso');
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2>{id ? 'Editar Permiso' : 'Nuevo Permiso'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Código del Permiso *</label>
                        <input
                            type="text"
                            name="codigoPermiso"
                            value={formData.codigoPermiso}
                            onChange={handleChange}
                            required
                            disabled={!!id}
                            placeholder="Ej: USUARIO_CREAR, ROL_LEER"
                        />
                        <small style={{ color: '#666' }}>Código único, no se puede modificar después</small>
                    </div>

                    <div className="form-group">
                        <label>Nombre *</label>
                        <input
                            type="text"
                            name="nombrePermiso"
                            value={formData.nombrePermiso}
                            onChange={handleChange}
                            required
                            placeholder="Nombre descriptivo del permiso"
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Descripción detallada del permiso"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                name="activo"
                                checked={formData.activo}
                                onChange={handleChange}
                            />
                            <span>Activo</span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" className="btn" onClick={() => navigate('/permisos')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PermisoForm;