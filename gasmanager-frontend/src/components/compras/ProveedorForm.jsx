import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proveedoresService } from '../../api/compras/auth';

const ProveedorForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        rfc: '',
        email: '',
        telefono: '',
        contacto: '',
        direccion: ''
    });

    useEffect(() => {
        if (id) {
            cargarProveedor();
        }
    }, [id]);

    const cargarProveedor = async () => {
        try {
            const data = await proveedoresService.obtenerPorId(id);
            setFormData({
                nombre: data.nombre || '',
                rfc: data.rfc || '',
                email: data.email || '',
                telefono: data.telefono || '',
                contacto: data.contacto || '',
                direccion: data.direccion || ''
            });
        } catch (error) {
            console.error('Error al cargar proveedor:', error);
            alert('Error al cargar proveedor');
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
            const proveedorData = {
                nombre: formData.nombre,
                rfc: formData.rfc || null,
                email: formData.email || null,
                telefono: formData.telefono || null,
                contacto: formData.contacto || null,
                direccion: formData.direccion || null
            };

            if (id) {
                await proveedoresService.actualizar(id, proveedorData);
                alert('Proveedor actualizado exitosamente');
            } else {
                await proveedoresService.crear(proveedorData);
                alert('Proveedor creado exitosamente');
            }
            navigate('/proveedores');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.errors || 'Error al guardar proveedor';
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
            <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <h2>{id ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre del Proveedor *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Razón social o nombre comercial"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">RFC</label>
                        <input
                            type="text"
                            className="form-control"
                            name="rfc"
                            value={formData.rfc}
                            onChange={handleChange}
                            placeholder="RFC del proveedor"
                            maxLength="13"
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="5551234567"
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="proveedor@ejemplo.com"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Persona de Contacto</label>
                        <input
                            type="text"
                            className="form-control"
                            name="contacto"
                            value={formData.contacto}
                            onChange={handleChange}
                            placeholder="Nombre del contacto principal"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <textarea
                            className="form-control"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Dirección completa del proveedor"
                        />
                    </div>

                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/proveedores')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProveedorForm;