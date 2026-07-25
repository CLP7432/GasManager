import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { creditosService } from '../../api/clientes/auth';
import { useAuth } from '../../contexts/AuthContext';

const CreditoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [credito, setCredito] = useState(null);
    const [abonos, setAbonos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAbonoModal, setShowAbonoModal] = useState(false);
    const [abonoData, setAbonoData] = useState({
        monto: '',
        fechaAbono: new Date().toISOString().split('T')[0],
        metodoPago: 'EFECTIVO',
        referenciaPago: '',
        notas: ''
    });
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        cargarCredito();
        cargarAbonos();
    }, [id]);

    const cargarCredito = async () => {
        try {
            const data = await creditosService.obtenerPorId(id);
            setCredito(data);
        } catch (error) {
            console.error('Error al cargar crédito:', error);
            alert('Error al cargar crédito');
        }
    };

    const cargarAbonos = async () => {
        try {
            const data = await creditosService.listarAbonos(id);
            setAbonos(data);
        } catch (error) {
            console.error('Error al cargar abonos:', error);
        }
        setLoading(false);
    };

    const handleCancelarCredito = async () => {
        const motivo = prompt('Motivo de cancelación:');
        if (motivo === null) return;

        if (window.confirm('¿Estás seguro de cancelar este crédito?')) {
            try {
                await creditosService.cancelar(id, motivo);
                alert('Crédito cancelado exitosamente');
                cargarCredito();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al cancelar crédito');
            }
        }
    };

    const abrirModalAbono = () => {
        setAbonoData({
            monto: '',
            fechaAbono: new Date().toISOString().split('T')[0],
            metodoPago: 'EFECTIVO',
            referenciaPago: '',
            notas: ''
        });
        setShowAbonoModal(true);
    };

    const cerrarModal = () => {
        setShowAbonoModal(false);
    };

    const handleAbonoChange = (e) => {
        const { name, value } = e.target;
        setAbonoData(prev => ({ ...prev, [name]: value }));
    };

    const registrarAbono = async (e) => {
        e.preventDefault();
        if (!abonoData.monto || parseFloat(abonoData.monto) <= 0) {
            alert('Ingrese un monto válido');
            return;
        }

        if (parseFloat(abonoData.monto) > credito.saldoPendiente) {
            alert(`El monto del abono no puede exceder el saldo pendiente (${formatMonto(credito.saldoPendiente)})`);
            return;
        }

        setEnviando(true);
        try {
            await creditosService.registrarAbono(id, {
                monto: parseFloat(abonoData.monto),
                fechaAbono: abonoData.fechaAbono,
                metodoPago: abonoData.metodoPago,
                referenciaPago: abonoData.referenciaPago || null,
                notas: abonoData.notas || null
            });
            alert('✅ Abono registrado exitosamente');
            cerrarModal();
            cargarCredito();
            cargarAbonos();
        } catch (error) {
            alert(error.response?.data?.message || 'Error al registrar abono');
        }
        setEnviando(false);
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            ACTIVO: 'bg-success',
            PAGADO: 'bg-info',
            VENCIDO: 'bg-danger',
            CANCELADO: 'bg-secondary',
            EN_COBRANZA: 'bg-warning text-dark'
        };
        return <span className={`badge ${colores[estado] || 'bg-secondary'}`}>{estado}</span>;
    };

    const getMetodoPagoLabel = (metodo) => {
        const labels = {
            SEMANAL: 'Semanal',
            QUINCENAL: 'Quincenal',
            MENSUAL: 'Mensual',
            PERSONALIZADO: 'Personalizado'
        };
        return labels[metodo] || metodo;
    };

    const formatMonto = (monto) => {
        if (!monto && monto !== 0) return '$0.00';
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX');
    };

    if (loading) {
        return <div className="card">Cargando detalles del crédito...</div>;
    }

    if (!credito) {
        return <div className="card">Crédito no encontrado</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/creditos')}>
                    ← Volver a Créditos
                </button>
                <h2 className="m-0">Detalle de Crédito</h2>
                <div style={{ width: '100px' }}></div>
            </div>

            {/* ===== ALERTA DE CRÉDITO VENCIDO ===== */}
            {credito.estado === 'VENCIDO' && (
                <div className="alert alert-danger">
                    <strong>⚠️ CRÉDITO VENCIDO</strong> - {credito.diasMora || 0} días de atraso
                </div>
            )}

            {/* ===== INFORMACIÓN DEL CRÉDITO ===== */}
            <div className="card mb-4">
                <div className="card-header bg-dark text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <span><strong>Folio:</strong> {credito.folioCredito}</span>
                        {getEstadoBadge(credito.estado)}
                    </div>
                </div>
                <div className="card-body">
                    {/* Información del Cliente */}
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Información del Cliente</h5>
                            <p><strong>Cliente:</strong> {credito.clienteNombre}</p>
                            <p><strong>ID Cliente:</strong> {credito.clienteId}</p>
                        </div>
                        <div className="col-md-6">
                            <h5>Fechas</h5>
                            <p><strong>Fecha de Inicio:</strong> {formatDate(credito.fechaInicio)}</p>
                            <p><strong>Fecha de Vencimiento:</strong> {formatDate(credito.fechaVencimiento)}</p>
                            <p><strong>Último Pago:</strong> {formatDate(credito.fechaUltimoPago)}</p>
                            {credito.diasMora > 0 && (
                                <p className="text-danger"><strong>Días de Mora:</strong> {credito.diasMora}</p>
                            )}
                        </div>
                    </div>

                    <hr />

                    {/* ===== MONTOS ===== */}
                    <div className="row">
                        <div className="col-md-3">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Monto Original</small>
                                <h4 className="text-primary">{formatMonto(credito.montoTotal)}</h4>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Interés Acumulado</small>
                                <h4 className="text-warning">{formatMonto(credito.montoInteresAcumulado || 0)}</h4>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Cargo por Mora</small>
                                <h4 className="text-danger">{formatMonto(credito.montoMoraAcumulado || 0)}</h4>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Saldo Pendiente</small>
                                <h4 className="text-danger">{formatMonto(credito.saldoPendiente)}</h4>
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* ===== DETALLES ADICIONALES ===== */}
                    <div className="row">
                        <div className="col-md-4">
                            <p><strong>Plazo:</strong> {credito.plazoMeses ? `${credito.plazoMeses} meses` : 'No definido'}</p>
                        </div>
                        <div className="col-md-4">
                            <p><strong>Tasa de Interés:</strong> {credito.tasaInteres ? `${credito.tasaInteres}%` : '0%'}</p>
                        </div>
                        <div className="col-md-4">
                            <p><strong>Tasa de Mora:</strong> {credito.tasaMora ? `${credito.tasaMora}% diario` : '0%'}</p>
                        </div>
                        <div className="col-md-4">
                            <p><strong>Método de Pago:</strong> {getMetodoPagoLabel(credito.metodoPago)}</p>
                        </div>
                        {credito.diaPago && (
                            <div className="col-md-4">
                                <p><strong>Día de Pago:</strong> {credito.diaPago}</p>
                            </div>
                        )}
                        {credito.notas && (
                            <div className="col-12">
                                <p><strong>Notas:</strong> {credito.notas}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== BOTONES DE ACCIÓN ===== */}
                <div className="card-footer">
                    {(credito.estado === 'ACTIVO' || credito.estado === 'VENCIDO') && (
                        <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={abrirModalAbono}>
                                Registrar Abono
                            </button>
                            {credito.estado === 'ACTIVO' && (
                                <button className="btn btn-danger" onClick={handleCancelarCredito}>
                                    Cancelar Crédito
                                </button>
                            )}
                            {credito.estado === 'VENCIDO' && (
                                <button className="btn btn-warning" onClick={abrirModalAbono}>
                                    Pagar Crédito Vencido
                                </button>
                            )}
                        </div>
                    )}
                    {credito.estado === 'PAGADO' && (
                        <span className="text-success fw-bold">✅ Este crédito ya está pagado</span>
                    )}
                    {credito.estado === 'CANCELADO' && (
                        <span className="text-secondary fw-bold">❌ Este crédito fue cancelado</span>
                    )}
                </div>
            </div>

            {/* ===== HISTORIAL DE ABONOS ===== */}
            <div className="card">
                <div className="card-header">
                    <h5 className="m-0">Historial de Abonos</h5>
                </div>
                <div className="card-body">
                    {abonos.length === 0 ? (
                        <p className="text-muted text-center">No hay abonos registrados</p>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Folio</th>
                                    <th>Fecha</th>
                                    <th>Monto</th>
                                    <th>Método de Pago</th>
                                    <th>Referencia</th>
                                    <th>Notas</th>
                                    <th>Registrado</th>
                                </tr>
                                </thead>
                                <tbody>
                                {abonos.map(abono => (
                                    <tr key={abono.id}>
                                        <td><code>{abono.folioAbono}</code></td>
                                        <td>{formatDate(abono.fechaAbono)}</td>
                                        <td className="text-success fw-bold">{formatMonto(abono.monto)}</td>
                                        <td>
                                            <span className="badge bg-info">
                                                {abono.metodoPago}
                                            </span>
                                        </td>
                                        <td>{abono.referenciaPago || '-'}</td>
                                        <td>{abono.notas || '-'}</td>
                                        <td><small>{new Date(abono.createdAt).toLocaleString()}</small></td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr className="table-light">
                                    <td colSpan="2" className="text-end fw-bold">Total Abonado:</td>
                                    <td className="text-success fw-bold">{formatMonto(credito.montoPagado)}</td>
                                    <td colSpan="4"></td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== MODAL PARA REGISTRAR ABONO ===== */}
            {showAbonoModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Registrar Abono</h5>
                                <button type="button" className="btn-close" onClick={cerrarModal}></button>
                            </div>
                            <form onSubmit={registrarAbono}>
                                <div className="modal-body">
                                    <p><strong>Crédito:</strong> {credito.folioCredito}</p>
                                    <p><strong>Cliente:</strong> {credito.clienteNombre}</p>
                                    <p><strong>Saldo pendiente:</strong> <span className="text-danger fw-bold">{formatMonto(credito.saldoPendiente)}</span></p>
                                    <hr />
                                    <div className="mb-3">
                                        <label className="form-label">Monto del abono *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={credito.saldoPendiente}
                                            className="form-control"
                                            name="monto"
                                            value={abonoData.monto}
                                            onChange={handleAbonoChange}
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha del abono *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="fechaAbono"
                                            value={abonoData.fechaAbono}
                                            onChange={handleAbonoChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Método de pago *</label>
                                        <select
                                            className="form-select"
                                            name="metodoPago"
                                            value={abonoData.metodoPago}
                                            onChange={handleAbonoChange}
                                            required
                                        >
                                            <option value="EFECTIVO">Efectivo</option>
                                            <option value="TRANSFERENCIA">Transferencia</option>
                                            <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                                            <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                                            <option value="CHEQUE">Cheque</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Referencia de pago</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="referenciaPago"
                                            value={abonoData.referenciaPago}
                                            onChange={handleAbonoChange}
                                            placeholder="Número de referencia, folio, etc."
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Notas</label>
                                        <textarea
                                            className="form-control"
                                            name="notas"
                                            value={abonoData.notas}
                                            onChange={handleAbonoChange}
                                            rows="2"
                                            placeholder="Observaciones (opcional)"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={enviando}>
                                        {enviando ? 'Registrando...' : 'Registrar Abono'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditoDetalle;