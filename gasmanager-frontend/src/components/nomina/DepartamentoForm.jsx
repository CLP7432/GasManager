import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { departamentosService } from '../../api/nomina/auth';

const DepartamentoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    useEffect(() => {
        if (id) {
            cargarDepartamento();
        }
    }, [id]);

    const cargarDepartamento = async () => {
        try {
            const data = await departamentosService.obtenerPorId(id);
            setFormData({
                nombre: data.nombre || '',
                descripcion: data.descripcion || ''
            });
        } catch (error) {
            console.error('Error al cargar departamento:', error);
            alert('Error al cargar departamento');
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
            const departamentoData = {
                nombre: formData.nombre,
                descripcion: formData.descripcion || null
            };

            if (id) {
                await departamentosService.actualizar(id, departamentoData);
                alert('Departamento actualizado exitosamente');
            } else {
                await departamentosService.crear(departamentoData);
                alert('Departamento creado exitosamente');
            }
            navigate('/departamentos');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.errors || 'Error al guardar departamento';
            if (typeof errorMsg === 'object') {
                const firstError = Object.values(errorMsg)[0];
                alert(firstError);
            } else {
                alert(errorMsg);
            }
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2>{id ? 'Editar Departamento' : 'Nuevo Departamento'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre del Departamento *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Operaciones, Ventas, Administración"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Descripción del departamento"
                        />
                    </div>

                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/departamentos')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartamentoForm;