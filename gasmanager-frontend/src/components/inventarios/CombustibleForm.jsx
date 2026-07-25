import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { combustibleService } from '../../api/inventarios/auth';

const CombustibleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tipo: '',
        nombre: '',
        descripcion: '',
        precioActual: ''
    });

    useEffect(() => {
        if (id) {
            cargarCombustible();
        }
    }, [id]);

    const cargarCombustible = async () => {
        try {
            const data = await combustibleService.obtenerPorId(id);
            setFormData({
                tipo: data.tipo,
                nombre: data.nombre,
                descripcion: data.descripcion || '',
                precioActual: data.precioActual
            });
        } catch (error) {
            console.error('Error al cargar combustible:', error);
            alert('Error al cargar combustible');
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
            const combustibleData = {
                tipo: formData.tipo,
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precioActual: parseFloat(formData.precioActual)
            };

            if (id) {
                await combustibleService.actualizarPrecio(id, {
                    nuevoPrecio: parseFloat(formData.precioActual),
                    motivoCambio: 'Actualización desde formulario'
                });
                alert('Combustible actualizado exitosamente');
            } else {
                await combustibleService.crear(combustibleData);
                alert('Combustible creado exitosamente');
            }
            navigate('/combustibles');
        } catch (error) {
            alert(error.response?.data?.message || 'Error al guardar combustible');
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2>{id ? 'Editar Combustible' : 'Nuevo Combustible'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tipo *</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            required
                            disabled={!!id}
                        >
                            <option value="">Seleccione un tipo</option>
                            <option value="MAGNA">Magna</option>
                            <option value="PREMIUM">Premium</option>
                            <option value="DIESEL">Diesel</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Nombre *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Nombre del combustible"
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Descripción (opcional)"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Precio Actual *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            name="precioActual"
                            value={formData.precioActual}
                            onChange={handleChange}
                            required
                            placeholder="0.00"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" className="btn" onClick={() => navigate('/combustibles')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CombustibleForm;