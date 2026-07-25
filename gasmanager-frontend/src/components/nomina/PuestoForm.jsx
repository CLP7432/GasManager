import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { puestosService } from '../../api/nomina/auth';

const PuestoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        salarioBase: '',
        riesgoPuesto: 'MEDIO'
    });

    useEffect(() => {
        if (id) {
            cargarPuesto();
        }
    }, [id]);

    const cargarPuesto = async () => {
        try {
            const data = await puestosService.obtenerPorId(id);
            setFormData({
                nombre: data.nombre || '',
                descripcion: data.descripcion || '',
                salarioBase: data.salarioBase || '',
                riesgoPuesto: data.riesgoPuesto || 'MEDIO'
            });
        } catch (error) {
            console.error('Error al cargar puesto:', error);
            alert('Error al cargar puesto');
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
            const puestoData = {
                nombre: formData.nombre,
                descripcion: formData.descripcion || null,
                salarioBase: parseFloat(formData.salarioBase),
                riesgoPuesto: formData.riesgoPuesto
            };

            if (id) {
                await puestosService.actualizar(id, puestoData);
                alert('Puesto actualizado exitosamente');
            } else {
                await puestosService.crear(puestoData);
                alert('Puesto creado exitosamente');
            }
            navigate('/puestos');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.errors || 'Error al guardar puesto';
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
                <h2>{id ? 'Editar Puesto' : 'Nuevo Puesto'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre del Puesto *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Despachador, Supervisor, Gerente"
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
                            placeholder="Descripción de las funciones del puesto"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Salario Base Mensual *</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                className="form-control"
                                name="salarioBase"
                                value={formData.salarioBase}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                            />
                        </div>
                        <small className="text-muted">El salario diario se calculará automáticamente (Base ÷ 30)</small>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Nivel de Riesgo</label>
                        <select
                            className="form-select"
                            name="riesgoPuesto"
                            value={formData.riesgoPuesto}
                            onChange={handleChange}
                        >
                            <option value="BAJO">Bajo</option>
                            <option value="MEDIO">Medio</option>
                            <option value="ALTO">Alto</option>
                        </select>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/puestos')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PuestoForm;