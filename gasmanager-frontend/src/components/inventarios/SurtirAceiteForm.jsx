import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aceitesInventarioService, aceiteService } from '../../api/inventarios/auth';

const SurtirAceiteForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [aceites, setAceites] = useState([]);
    const [bodegaStock, setBodegaStock] = useState({});
    const [dispensarios, setDispensarios] = useState([]);
    const [formData, setFormData] = useState({
        dispensarioId: '',
        observaciones: '',
        items: [
            { aceiteId: '', cantidad: '', precioVenta: '' }
        ]
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            // Cargar aceites activos
            const aceitesData = await aceiteService.listarActivos();
            setAceites(Array.isArray(aceitesData) ? aceitesData : []);

            // Cargar stock en bodega
            const bodegaData = await aceitesInventarioService.listarBodega();
            const stockMap = {};
            if (Array.isArray(bodegaData)) {
                bodegaData.forEach(item => {
                    stockMap[item.aceiteId] = item.stockActual || 0;
                });
            }
            setBodegaStock(stockMap);

            // Cargar dispensarios
            const response = await fetch('/api/dispensarios/activos');
            if (response.ok) {
                const data = await response.json();
                setDispensarios(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            setAceites([]);
            setDispensarios([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { aceiteId: '', cantidad: '', precioVenta: '' }]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length === 1) {
            alert('Debe haber al menos un item');
            return;
        }
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.dispensarioId) {
            alert('Seleccione un dispensario');
            return;
        }

        const itemsValidos = formData.items.filter(item => item.aceiteId && item.cantidad && parseInt(item.cantidad) > 0);
        if (itemsValidos.length === 0) {
            alert('Agregue al menos un aceite con cantidad válida');
            return;
        }

        for (const item of itemsValidos) {
            const stockDisponible = bodegaStock[parseInt(item.aceiteId)] || 0;
            if (parseInt(item.cantidad) > stockDisponible) {
                const aceite = aceites.find(a => a.id === parseInt(item.aceiteId));
                alert(`Stock insuficiente para ${aceite?.nombre || 'aceite'}. Disponible: ${stockDisponible}`);
                return;
            }
        }

        setLoading(true);
        try {
            const data = {
                dispensarioId: parseInt(formData.dispensarioId),
                observaciones: formData.observaciones || 'Surtido a dispensario',
                items: itemsValidos.map(item => {
                    const aceite = aceites.find(a => a.id === parseInt(item.aceiteId));
                    return {
                        aceiteId: parseInt(item.aceiteId),
                        codigo: aceite?.codigo || '',
                        nombre: aceite?.nombre || '',
                        cantidad: parseInt(item.cantidad),
                        precioVenta: parseFloat(item.precioVenta) || aceite?.precioVenta || 0
                    };
                })
            };

            await aceitesInventarioService.surtirDispensario(data);
            alert('✅ Surtido realizado exitosamente');
            navigate('/inventario-aceites/transferencias');
        } catch (error) {
            alert('❌ Error al surtir: ' + (error.response?.data?.message || error.message));
        }
        setLoading(false);
    };

    return (
        <div className="card">
            <h2>🔄 Surtir a Dispensario</h2>
            <p className="text-muted">Transfiera aceites de bodega a un dispensario</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Dispensario *</label>
                    <select
                        name="dispensarioId"
                        value={formData.dispensarioId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un dispensario</option>
                        {dispensarios.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Observaciones</label>
                    <input
                        type="text"
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        placeholder="Motivo del surtido"
                    />
                </div>

                <hr />

                <h4>📦 Productos a surtir</h4>

                {formData.items.map((item, index) => {
                    const stockDisponible = bodegaStock[parseInt(item.aceiteId)] || 0;
                    return (
                        <div key={index} style={{
                            backgroundColor: '#f8f9fa',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '12px' }}>Aceite *</label>
                                    <select
                                        value={item.aceiteId}
                                        onChange={(e) => handleItemChange(index, 'aceiteId', e.target.value)}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="">Seleccionar</option>
                                        {aceites.map(a => {
                                            const stock = bodegaStock[a.id] || 0;
                                            return (
                                                <option key={a.id} value={a.id}>
                                                    {a.codigo} - {a.nombre} (Stock: {stock})
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '12px' }}>Cantidad *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.cantidad}
                                        onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                                        placeholder="0"
                                        style={{ width: '100%' }}
                                    />
                                    <small className="text-muted">Disponible: {stockDisponible}</small>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '12px' }}>Precio Venta</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.precioVenta}
                                        onChange={(e) => handleItemChange(index, 'precioVenta', e.target.value)}
                                        placeholder="0.00"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeItem(index)}
                                    style={{ marginBottom: '2px' }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    );
                })}

                <button type="button" className="btn btn-secondary" onClick={addItem} style={{ marginBottom: '20px' }}>
                    + Agregar aceite
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Procesando...' : '✅ Realizar Surtido'}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate('/inventario-aceites')}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SurtirAceiteForm;