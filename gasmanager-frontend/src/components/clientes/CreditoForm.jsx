import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { creditosService, clientesService } from '../../api/clientes/auth';

const CreditoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState({
        clienteId: '',
        montoTotal: '',
        plazoMeses: '',
        tasaInteres: '',
        tasaMora: '1.00',
        fechaInicio: new Date().toISOString().split('T')[0],
        metodoPago: 'MENSUAL',
        diaPago: '',
        notas: ''
    });

    useEffect(() => {
        cargarClientes();
        if (id) {
            cargarCredito();
        }
    }, [id]);

    const cargarClientes = async () => {
        try {
            const data = await clientesService.listarActivos();
            setClientes(data);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
    };

    const cargarCredito = async () => {
        try {
            const data = await creditosService.obtenerPorId(id);
            setFormData({
                clienteId: data.clienteId,
                montoTotal: data.montoTotal,
                plazoMeses: data.plazoMeses || '',
                tasaInteres: data.tasaInteres || '',
                tasaMora: data.tasaMora || '1.00',
                fechaInicio: data.fechaInicio,
                metodoPago: data.metodoPago || 'MENSUAL',
                diaPago: data.diaPago || '',
                notas: data.notas || ''
            });
        } catch (error) {
            console.error('Error al cargar crédito:', error);
            alert('Error al cargar crédito');
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
            const creditoData = {
                clienteId: parseInt(formData.clienteId),
                montoTotal: parseFloat(formData.montoTotal),
                plazoMeses: formData.plazoMeses ? parseInt(formData.plazoMeses) : null,
                tasaInteres: formData.tasaInteres ? parseFloat(formData.tasaInteres) : null,
                tasaMora: formData.tasaMora ? parseFloat(formData.tasaMora) : 1.00,
                fechaInicio: formData.fechaInicio,
                metodoPago: formData.metodoPago,
                diaPago: formData.diaPago ? parseInt(formData.diaPago) : null,
                notas: formData.notas || null
            };

            if (id) {
                await creditosService.actualizar(id, creditoData);
                alert('✅ Crédito actualizado exitosamente');
            } else {
                await creditosService.crear(creditoData);
                alert('✅ Crédito creado exitosamente');
            }
            navigate('/creditos');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.errors || 'Error al guardar crédito';
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
                <h2>{id ? '✏️ Editar Crédito' : '📝 Nuevo Crédito'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Cliente *</label>
                        <select
                            className="form-select"
                            name="clienteId"
                            value={formData.clienteId}
                            onChange={handleChange}
                            required
                            disabled={!!id}
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map(cliente => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.razonSocial || cliente.nombreComercial} - {cliente.rfc || 'Sin RFC'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Monto Total *</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="form-control"
                                    name="montoTotal"
                                    value={formData.montoTotal}
                                    onChange={handleChange}
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Plazo (meses)</label>
                            <select
                                className="form-select"
                                name="plazoMeses"
                                value={formData.plazoMeses}
                                onChange={handleChange}
                            >
                                <option value="">Sin plazo definido</option>
                                <option value="1">1 mes</option>
                                <option value="2">2 meses</option>
                                <option value="3">3 meses</option>
                                <option value="4">4 meses</option>
                                <option value="5">5 meses</option>
                                <option value="6">6 meses</option>
                                <option value="9">9 meses</option>
                                <option value="12">12 meses</option>
                                <option value="18">18 meses</option>
                                <option value="24">24 meses</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tasa de Interés (%)</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="form-control"
                                    name="tasaInteres"
                                    value={formData.tasaInteres}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                />
                                <span className="input-group-text">%</span>
                            </div>
                            <small className="text-muted">Se aplica según el método de pago</small>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tasa de Mora (%)</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="form-control"
                                    name="tasaMora"
                                    value={formData.tasaMora}
                                    onChange={handleChange}
                                    placeholder="1.00"
                                />
                                <span className="input-group-text">% diario</span>
                            </div>
                            <small className="text-muted">Se aplica después de la fecha de vencimiento</small>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Fecha de Inicio *</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaInicio"
                                value={formData.fechaInicio}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Método de Pago</label>
                            <select
                                className="form-select"
                                name="metodoPago"
                                value={formData.metodoPago}
                                onChange={handleChange}
                            >
                                <option value="SEMANAL">Semanal</option>
                                <option value="QUINCENAL">Quincenal</option>
                                <option value="MENSUAL">Mensual</option>
                                <option value="PERSONALIZADO">Personalizado</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Día de Pago</label>
                            <select
                                className="form-select"
                                name="diaPago"
                                value={formData.diaPago}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione un día</option>
                                {[...Array(31).keys()].map(i => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            <small className="text-muted">Día del mes en que debe pagar</small>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Notas / Observaciones</label>
                        <textarea
                            className="form-control"
                            name="notas"
                            value={formData.notas}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Información adicional sobre el crédito..."
                        />
                    </div>

                    <div className="alert alert-info">
                        <small>
                            <strong>📌 Información:</strong>
                            <ul className="mb-0 mt-1">
                                <li>El interés se calcula automáticamente según el método de pago</li>
                                <li>La mora se aplica 1 día después de la fecha de vencimiento</li>
                                <li>El saldo pendiente se actualiza con cada abono</li>
                            </ul>
                        </small>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : (id ? '💾 Actualizar Crédito' : '✅ Crear Crédito')}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/creditos')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreditoForm;