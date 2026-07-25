import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aceitesInventarioService, aceiteService } from '../../api/inventarios/auth';

const CompraAceiteForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [aceites, setAceites] = useState([]);
    const [formData, setFormData] = useState({
        aceiteId: '',
        proveedor: '',
        cantidad: '',
        precioUnitario: '',
        factura: '',
        observaciones: ''
    });
    const [preview, setPreview] = useState({
        subtotal: 0,
        iva: 0,
        total: 0
    });

    useEffect(() => {
        cargarAceites();
    }, []);

    const cargarAceites = async () => {
        try {
            const data = await aceiteService.listarActivos();
            setAceites(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error cargando aceites:', error);
            setAceites([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'cantidad' || name === 'precioUnitario') {
            const cantidad = parseFloat(name === 'cantidad' ? value : formData.cantidad) || 0;
            const precio = parseFloat(name === 'precioUnitario' ? value : formData.precioUnitario) || 0;
            const subtotal = cantidad * precio;
            const iva = subtotal * 0.16;
            setPreview({
                subtotal: subtotal,
                iva: iva,
                total: subtotal + iva
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.aceiteId || !formData.cantidad || !formData.precioUnitario) {
            alert('Complete todos los campos obligatorios');
            return;
        }

        setLoading(true);
        try {
            const data = {
                aceiteId: parseInt(formData.aceiteId),
                proveedor: formData.proveedor || 'Proveedor sin especificar',
                cantidad: parseInt(formData.cantidad),
                precioUnitario: parseFloat(formData.precioUnitario),
                factura: formData.factura || '',
                observaciones: formData.observaciones || ''
            };

            await aceitesInventarioService.registrarCompra(data);
            alert('✅ Compra registrada exitosamente');
            navigate('/inventario-aceites');
        } catch (error) {
            alert('❌ Error al registrar compra: ' + (error.response?.data?.message || error.message));
        }
        setLoading(false);
    };

    return (
        <div className="card">
            <h2>📦 Registrar Compra de Aceites</h2>
            <p className="text-muted">Registre la entrada de aceites a bodega</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Aceite *</label>
                    <select
                        name="aceiteId"
                        value={formData.aceiteId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un aceite</option>
                        {aceites.map(aceite => (
                            <option key={aceite.id} value={aceite.id}>
                                {aceite.codigo} - {aceite.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Proveedor</label>
                    <input
                        type="text"
                        name="proveedor"
                        value={formData.proveedor}
                        onChange={handleChange}
                        placeholder="Nombre del proveedor"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                        <label>Cantidad *</label>
                        <input
                            type="number"
                            min="1"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            required
                            placeholder="0"
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio Unitario *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            name="precioUnitario"
                            value={formData.precioUnitario}
                            onChange={handleChange}
                            required
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Factura</label>
                    <input
                        type="text"
                        name="factura"
                        value={formData.factura}
                        onChange={handleChange}
                        placeholder="Número de factura"
                    />
                </div>

                <div className="form-group">
                    <label>Observaciones</label>
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Observaciones adicionales..."
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                {/* Preview */}
                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <h4>📊 Resumen de la Compra</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                        <div>
                            <small className="text-muted">Subtotal</small>
                            <p style={{ fontWeight: 'bold' }}>${preview.subtotal.toFixed(2)}</p>
                        </div>
                        <div>
                            <small className="text-muted">IVA (16%)</small>
                            <p style={{ fontWeight: 'bold' }}>${preview.iva.toFixed(2)}</p>
                        </div>
                        <div>
                            <small className="text-muted">Total</small>
                            <p style={{ fontWeight: 'bold', color: '#28a745', fontSize: '1.2rem' }}>
                                ${preview.total.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Registrando...' : '✅ Registrar Compra'}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate('/inventario-aceites')}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompraAceiteForm;