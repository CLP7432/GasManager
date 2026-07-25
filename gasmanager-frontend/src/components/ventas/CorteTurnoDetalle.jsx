import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cortesService } from '../../api/ventas/auth';
import { useAuth } from '../../contexts/AuthContext';

const CorteTurnoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [corte, setCorte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({
        totalEfectivo: 0,
        totalTarjeta: 0,
        totalTransferencia: 0,
        totalCredito: 0,
        observaciones: ''
    });

    useEffect(() => {
        cargarCorte();
    }, [id]);

    const cargarCorte = async () => {
        setLoading(true);
        try {
            const data = await cortesService.obtenerPorId(id);
            setCorte(data);
            setFormData({
                totalEfectivo: data.totalEfectivo || 0,
                totalTarjeta: data.totalTarjeta || 0,
                totalTransferencia: data.totalTransferencia || 0,
                totalCredito: data.totalCredito || 0,
                observaciones: data.observaciones || ''
            });
        } catch (error) {
            console.error('Error al cargar corte:', error);
            alert('Error al cargar el detalle del corte');
        }
        setLoading(false);
    };

    const handleValidarCorte = async () => {
        if (window.confirm('¿Validar este corte? El supervisor confirma que los datos son correctos.')) {
            try {
                await cortesService.validar(id, 1, 'ADMIN');
                alert('✅ Corte validado exitosamente');
                cargarCorte();
            } catch (error) {
                alert('❌ Error al validar corte');
            }
        }
    };

    const handleCerrarCorte = async () => {
        if (window.confirm('¿Cerrar este corte? Esta acción finaliza el proceso.')) {
            try {
                await cortesService.cerrar(id);
                alert('✅ Corte cerrado exitosamente');
                cargarCorte();
            } catch (error) {
                alert('❌ Error al cerrar corte');
            }
        }
    };

    const handleEditarCorte = () => {
        setEditando(true);
    };

    const handleCancelarEdicion = () => {
        setEditando(false);
        setFormData({
            totalEfectivo: corte.totalEfectivo || 0,
            totalTarjeta: corte.totalTarjeta || 0,
            totalTransferencia: corte.totalTransferencia || 0,
            totalCredito: corte.totalCredito || 0,
            observaciones: corte.observaciones || ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'observaciones' ? value : parseFloat(value) || 0
        }));
    };

    const handleGuardarEdicion = async () => {
        if (window.confirm('¿Guardar los cambios realizados en el corte?')) {
            try {
                // Aquí llamamos al endpoint de actualización
                const response = await fetch(`/api/cortes-detallado/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        totalEfectivo: formData.totalEfectivo,
                        totalTarjeta: formData.totalTarjeta,
                        totalTransferencia: formData.totalTransferencia,
                        totalCredito: formData.totalCredito,
                        observaciones: formData.observaciones
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el corte');
                }

                alert('✅ Corte actualizado exitosamente');
                setEditando(false);
                cargarCorte();
            } catch (error) {
                console.error('Error al actualizar corte:', error);
                alert('❌ Error al actualizar el corte: ' + error.message);
            }
        }
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            PENDIENTE: 'badge bg-warning text-dark',
            VALIDADO: 'badge bg-info text-white',
            CERRADO: 'badge bg-success text-white',
            RECHAZADO: 'badge bg-danger text-white',
            CON_DIFERENCIAS: 'badge bg-secondary text-white'
        };
        const textos = {
            PENDIENTE: '⏳ PENDIENTE',
            VALIDADO: '✓ VALIDADO',
            CERRADO: '✅ CERRADO',
            RECHAZADO: '❌ RECHAZADO',
            CON_DIFERENCIAS: '⚠️ CON DIFERENCIAS'
        };
        return <span className={colores[estado] || 'badge bg-secondary'} style={{ padding: '6px 12px' }}>{textos[estado] || estado}</span>;
    };

    const formatMonto = (monto) => {
        if (!monto && monto !== 0) return '$0.00';
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('es-MX');
    };

    // Calcular el efectivo que debe entregar
    const calcularEfectivoQueDebeEntregar = () => {
        if (!corte) return 0;
        const totalVentas = corte.totalVentaCombustiblesYAceites || 0;
        const tarjeta = formData.totalTarjeta || 0;
        const transferencia = formData.totalTransferencia || 0;
        const notasCredito = corte.totalNotasCredito || 0;
        const credito = formData.totalCredito || 0;
        return totalVentas - tarjeta - transferencia - notasCredito - credito;
    };

    const efectivoQueDebeEntregar = calcularEfectivoQueDebeEntregar();
    const diferencia = (formData.totalEfectivo || 0) - efectivoQueDebeEntregar;

    if (loading) {
        return (
            <div className="card text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando detalle del corte...</p>
            </div>
        );
    }

    if (!corte) {
        return (
            <div className="card">
                <div className="alert alert-danger">
                    <strong>❌ Corte no encontrado</strong>
                    <p>El corte que buscas no existe o ha sido eliminado.</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/cortes')}>
                    ← Volver a Cortes
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/cortes')}>
                    ← Volver a Cortes
                </button>
                <h2 className="m-0">Detalle de Corte</h2>
                <div style={{ width: '100px' }}></div>
            </div>

            {/* ===== ALERTA DE ESTADO ===== */}
            {corte.estado === 'PENDIENTE' && (
                <div className="alert alert-warning">
                    ⏳ Este corte está <strong>PENDIENTE</strong> de validación por el supervisor.
                </div>
            )}
            {corte.estado === 'VALIDADO' && (
                <div className="alert alert-info">
                    ✓ Este corte ha sido <strong>VALIDADO</strong> por el supervisor.
                </div>
            )}
            {corte.estado === 'CERRADO' && (
                <div className="alert alert-success">
                    ✅ Este corte ha sido <strong>CERRADO</strong> y finalizado.
                </div>
            )}
            {diferencia !== 0 && corte.estado === 'PENDIENTE' && (
                <div className="alert alert-danger">
                    ⚠️ <strong>Diferencia detectada:</strong> {formatMonto(diferencia)}
                    {diferencia < 0 ? ' (Falta efectivo)' : ' (Sobra efectivo)'}
                </div>
            )}

            {/* ===== INFORMACIÓN DEL CORTE ===== */}
            <div className="card mb-4">
                <div className="card-header bg-dark text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <span><strong>Código:</strong> {corte.codigoCorte}</span>
                        {getEstadoBadge(corte.estado)}
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Turno:</strong> {corte.turnoNombre || corte.turnoId}</p>
                            <p><strong>Despachador:</strong> {corte.despachadorNombre || '-'}</p>
                            <p><strong>Fecha de creación:</strong> {formatDate(corte.createdAt)}</p>
                        </div>
                        <div className="col-md-6">
                            {corte.validadoPor && (
                                <>
                                    <p><strong>Validado por:</strong> {corte.validadoNombre || corte.validadoPor}</p>
                                    <p><strong>Fecha de validación:</strong> {formatDate(corte.fechaValidacion)}</p>
                                </>
                            )}
                            <p><strong>Observaciones:</strong> {corte.observaciones || 'Sin observaciones'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== RESUMEN DE VENTAS ===== */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="m-0">⛽ Resumen de Ventas</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Magna</small>
                                <h4>{corte.magnaLitrosVendidos?.toFixed(3) || 0} L</h4>
                                <small className="text-success">{formatMonto(corte.magnaImporte)}</small>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Premium</small>
                                <h4>{corte.premiumLitrosVendidos?.toFixed(3) || 0} L</h4>
                                <small className="text-success">{formatMonto(corte.premiumImporte)}</small>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Diesel</small>
                                <h4>{corte.dieselLitrosVendidos?.toFixed(3) || 0} L</h4>
                                <small className="text-success">{formatMonto(corte.dieselImporte)}</small>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Total Litros:</strong> {corte.totalCombustiblesLitros?.toFixed(3) || 0} L</p>
                            <p><strong>Total Combustibles:</strong> {formatMonto(corte.totalCombustiblesImporte)}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Total Aceites:</strong> {formatMonto(corte.totalAceitesImporte)}</p>
                            <p><strong>Total Notas de Crédito:</strong> {formatMonto(corte.totalNotasCredito)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== RESUMEN DE PAGOS (EDITABLE) ===== */}
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="m-0">💰 Resumen de Pagos</h5>
                    {corte.estado === 'PENDIENTE' && !editando && (
                        <button className="btn btn-primary btn-sm" onClick={handleEditarCorte}>
                            ✏️ Editar
                        </button>
                    )}
                    {corte.estado === 'PENDIENTE' && editando && (
                        <div>
                            <button className="btn btn-success btn-sm me-2" onClick={handleGuardarEdicion}>
                                💾 Guardar
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={handleCancelarEdicion}>
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Total Ventas</small>
                                <h4 className="text-primary">{formatMonto(corte.totalVentaCombustiblesYAceites)}</h4>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Efectivo</small>
                                {editando ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control text-center"
                                        name="totalEfectivo"
                                        value={formData.totalEfectivo}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <h4 className="text-success">{formatMonto(corte.totalEfectivo)}</h4>
                                )}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Tarjeta</small>
                                {editando ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control text-center"
                                        name="totalTarjeta"
                                        value={formData.totalTarjeta}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <h4 className="text-info">{formatMonto(corte.totalTarjeta)}</h4>
                                )}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Transferencia</small>
                                {editando ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control text-center"
                                        name="totalTransferencia"
                                        value={formData.totalTransferencia}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <h4 className="text-warning">{formatMonto(corte.totalTransferencia)}</h4>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ===== EFECTIVO QUE DEBE ENTREGAR Y DIFERENCIA ===== */}
                    <hr />
                    <div className="row">
                        <div className="col-md-4">
                            <p><strong>Efectivo que debe entregar:</strong></p>
                            <h4 className="text-success">{formatMonto(efectivoQueDebeEntregar)}</h4>
                        </div>
                        <div className="col-md-4">
                            <p><strong>Diferencia:</strong></p>
                            <h4 className={diferencia < 0 ? 'text-danger' : diferencia > 0 ? 'text-success' : 'text-secondary'}>
                                {formatMonto(diferencia)}
                            </h4>
                            {diferencia !== 0 && (
                                <small className={diferencia < 0 ? 'text-danger' : 'text-success'}>
                                    {diferencia < 0 ? '⚠️ Falta efectivo' : '✅ Sobra efectivo'}
                                </small>
                            )}
                        </div>
                        <div className="col-md-4">
                            <p><strong>Total Crédito:</strong></p>
                            {editando ? (
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    name="totalCredito"
                                    value={formData.totalCredito}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <h4 className="text-secondary">{formatMonto(corte.totalCredito)}</h4>
                            )}
                        </div>
                    </div>

                    {/* ===== OBSERVACIONES EDITABLE ===== */}
                    {editando && (
                        <div className="row mt-3">
                            <div className="col-12">
                                <label className="form-label"><strong>Observaciones:</strong></label>
                                <textarea
                                    className="form-control"
                                    name="observaciones"
                                    value={formData.observaciones}
                                    onChange={handleInputChange}
                                    rows="2"
                                    placeholder="Agregar observaciones..."
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== NOTAS DE CRÉDITO ===== */}
            {corte.notasCredito && corte.notasCredito.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="m-0">📝 Notas de Crédito</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="table-dark">
                                <tr>
                                    <th>Folio</th>
                                    <th>Cliente</th>
                                    <th>Tipo</th>
                                    <th>Litros</th>
                                    <th>Monto</th>
                                    <th>Autorizado por</th>
                                </tr>
                                </thead>
                                <tbody>
                                {corte.notasCredito.map((nota, index) => (
                                    <tr key={index}>
                                        <td><code>{nota.folioNota}</code></td>
                                        <td>{nota.clienteNombre || '-'}</td>
                                        <td>{nota.tipoCombustible || '-'}</td>
                                        <td>{nota.litros?.toFixed(3) || 0} L</td>
                                        <td className="text-danger">{formatMonto(nota.monto)}</td>
                                        <td>{nota.autorizadoPor || '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr className="table-light">
                                    <td colSpan="4" className="text-end fw-bold">Total Notas de Crédito:</td>
                                    <td className="text-danger fw-bold">{formatMonto(corte.totalNotasCredito)}</td>
                                    <td></td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== DETALLES DE ACEITES ===== */}
            {corte.detallesAceites && corte.detallesAceites.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="m-0">🛢️ Detalle de Aceites</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="table-dark">
                                <tr>
                                    <th>Aceite</th>
                                    <th>Cantidad Inicial</th>
                                    <th>Cantidad Final</th>
                                    <th>Vendidos</th>
                                    <th>Precio Unitario</th>
                                    <th>Importe</th>
                                </tr>
                                </thead>
                                <tbody>
                                {corte.detallesAceites.map((detalle, index) => (
                                    <tr key={index}>
                                        <td>{detalle.aceiteNombre}</td>
                                        <td>{detalle.cantidadInicial || 0}</td>
                                        <td>{detalle.cantidadFinal || 0}</td>
                                        <td>{detalle.cantidadVendida || 0}</td>
                                        <td>{formatMonto(detalle.precioUnitario)}</td>
                                        <td className="text-success">{formatMonto(detalle.importe)}</td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr className="table-light">
                                    <td colSpan="5" className="text-end fw-bold">Total Aceites:</td>
                                    <td className="text-success fw-bold">{formatMonto(corte.totalAceitesImporte)}</td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== BOTONES DE ACCIÓN ===== */}
            <div className="card">
                <div className="card-body d-flex gap-2 flex-wrap">
                    {corte.estado === 'PENDIENTE' && isAdmin && (
                        <>
                            <button className="btn btn-success" onClick={handleValidarCorte}>
                                ✓ Validar Corte
                            </button>
                            <button className="btn btn-primary" onClick={handleEditarCorte}>
                                ✏️ Editar Corte
                            </button>
                        </>
                    )}
                    {corte.estado === 'VALIDADO' && isAdmin && (
                        <button className="btn btn-danger" onClick={handleCerrarCorte}>
                            🔒 Cerrar Corte
                        </button>
                    )}
                    <button className="btn btn-secondary" onClick={() => navigate('/cortes')}>
                        ← Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CorteTurnoDetalle;