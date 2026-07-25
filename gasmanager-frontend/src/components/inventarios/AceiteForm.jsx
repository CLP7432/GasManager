import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aceiteService } from '../../api/inventarios/auth';

const AceiteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        descripcion: '',
        marca: '',
        tipoAceite: '',
        presentacion: '',
        precioCompra: '',
        precioVenta: '',
        stockActual: 0,
        stockMinimo: 5,
        stockMaximo: 50,
        ubicacion: ''
    });

    useEffect(() => {
        if (id) {
            cargarAceite();
        }
    }, [id]);

    const cargarAceite = async () => {
        try {
            const data = await aceiteService.obtenerPorId(id);
            setFormData({
                codigo: data.codigo,
                nombre: data.nombre,
                descripcion: data.descripcion || '',
                marca: data.marca || '',
                tipoAceite: data.tipoAceite || '',
                presentacion: data.presentacion || '',
                precioCompra: data.precioCompra || '',
                precioVenta: data.precioVenta,
                stockActual: data.stockActual,
                stockMinimo: data.stockMinimo,
                stockMaximo: data.stockMaximo,
                ubicacion: data.ubicacion || ''
            });
        } catch (error) {
            console.error('Error al cargar aceite:', error);
            alert('Error al cargar aceite');
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
            const aceiteData = {
                codigo: formData.codigo,
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                marca: formData.marca,
                tipoAceite: formData.tipoAceite,
                presentacion: formData.presentacion,
                precioCompra: formData.precioCompra ? parseFloat(formData.precioCompra) : null,
                precioVenta: parseFloat(formData.precioVenta),
                stockActual: parseInt(formData.stockActual),
                stockMinimo: parseInt(formData.stockMinimo),
                stockMaximo: parseInt(formData.stockMaximo),
                ubicacion: formData.ubicacion
            };

            if (id) {
                await aceiteService.actualizar(id, aceiteData);
                alert('Aceite actualizado exitosamente');
            } else {
                await aceiteService.crear(aceiteData);
                alert('Aceite creado exitosamente');
            }
            navigate('/aceites');
        } catch (error) {
            alert(error.response?.data?.message || 'Error al guardar aceite');
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2>{id ? 'Editar Aceite' : 'Nuevo Aceite'}</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="form-group">
                            <label>Código *</label>
                            <input
                                type="text"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                required
                                placeholder="Ej: ACE-001"
                            />
                        </div>

                        <div className="form-group">
                            <label>Nombre *</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                placeholder="Nombre del aceite"
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="2"
                                placeholder="Descripción (opcional)"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Marca</label>
                            <input
                                type="text"
                                name="marca"
                                value={formData.marca}
                                onChange={handleChange}
                                placeholder="Ej: Mobil, Castrol"
                            />
                        </div>

                        <div className="form-group">
                            <label>Tipo de Aceite</label>
                            <input
                                type="text"
                                name="tipoAceite"
                                value={formData.tipoAceite}
                                onChange={handleChange}
                                placeholder="Ej: MOTOR, TRANSMISION"
                            />
                        </div>

                        <div className="form-group">
                            <label>Presentación</label>
                            <input
                                type="text"
                                name="presentacion"
                                value={formData.presentacion}
                                onChange={handleChange}
                                placeholder="Ej: 1L, 5L, 20L"
                            />
                        </div>

                        <div className="form-group">
                            <label>Ubicación</label>
                            <input
                                type="text"
                                name="ubicacion"
                                value={formData.ubicacion}
                                onChange={handleChange}
                                placeholder="Ej: Estante A1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Precio Compra</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="precioCompra"
                                value={formData.precioCompra}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="form-group">
                            <label>Precio Venta *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                name="precioVenta"
                                value={formData.precioVenta}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Actual</label>
                            <input
                                type="number"
                                min="0"
                                name="stockActual"
                                value={formData.stockActual}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Mínimo</label>
                            <input
                                type="number"
                                min="0"
                                name="stockMinimo"
                                value={formData.stockMinimo}
                                onChange={handleChange}
                                placeholder="5"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Máximo</label>
                            <input
                                type="number"
                                min="0"
                                name="stockMaximo"
                                value={formData.stockMaximo}
                                onChange={handleChange}
                                placeholder="50"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" className="btn" onClick={() => navigate('/aceites')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AceiteForm;