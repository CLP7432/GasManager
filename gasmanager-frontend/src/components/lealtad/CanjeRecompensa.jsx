import React, { useState, useEffect } from 'react';
import { canjesService, recompensasService, puntosService, extractApiError } from '../../api/lealtad/auth.js';
import { ventasService } from '../../api/ventas/auth.js';

const CanjeRecompensa = () => {
    const [ventas, setVentas] = useState([]);
    const [recompensas, setRecompensas] = useState([]);
    const [canjes, setCanjes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDatos, setLoadingDatos] = useState(true);
    const [loadingHistorial, setLoadingHistorial] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [saldoActual, setSaldoActual] = useState(null);
    const [form, setForm] = useState({ ventaId: '', recompensaId: '' });

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        setLoadingDatos(true);
        setMensaje(null);
        try {
            const [ventasData, recompensasData] = await Promise.all([
                ventasService.listar(0, 100),
                recompensasService.listar()
            ]);
            const ventasList = Array.isArray(ventasData.ventas) ? ventasData.ventas : Array.isArray(ventasData) ? ventasData : [];
            setVentas(ventasList);
            setRecompensas(Array.isArray(recompensasData) ? recompensasData : []);
        } catch (error) {
            setMensaje({ tipo: 'error', texto: extractApiError(error, 'Error al cargar ventas o recompensas') });
        }
        setLoadingDatos(false);
    };

    const cargarHistorial = async (ventaId) => {
        if (!ventaId) { setCanjes([]); return; }
        setLoadingHistorial(true);
        try {
            const data = await canjesService.listarPorVenta(ventaId);
            setCanjes(data);
        } catch { setCanjes([]); }
        setLoadingHistorial(false);
    };

    const consultarSaldo = async (ventaId) => {
        if (!ventaId) { setSaldoActual(null); return; }
        try {
            const data = await puntosService.consultarSaldo(ventaId);
            setSaldoActual(data.saldoPuntos);
        } catch { setSaldoActual(0); }
    };

    const handleVentaChange = (e) => {
        const vid = e.target.value;
        setForm(prev => ({ ...prev, ventaId: vid, recompensaId: '' }));
        consultarSaldo(vid);
        cargarHistorial(vid);
    };

    const recompensaSeleccionada = recompensas.find(r => r.id === parseInt(form.recompensaId));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);
        setLoading(true);
        try {
            const resultado = await canjesService.registrar(parseInt(form.ventaId), parseInt(form.recompensaId));
            setMensaje({ tipo: 'success', texto: `Canje realizado. Se usaron ${resultado.puntosUsados} puntos. Estado: ${resultado.estado}` });
            setForm(prev => ({ ...prev, recompensaId: '' }));
            consultarSaldo(form.ventaId);
            cargarHistorial(form.ventaId);
        } catch (error) {
            setMensaje({ tipo: 'error', texto: extractApiError(error, 'Error al realizar el canje') });
        }
        setLoading(false);
    };

    const getEstadoBadge = (estado) => {
        const estilos = { PENDIENTE: 'bg-warning text-dark', APROBADO: 'bg-success', CANCELADO: 'bg-danger' };
        return <span className={`badge ${estilos[estado] || 'bg-secondary'}`}>{estado}</span>;
    };

    const getNombreRecompensa = (recompensaId) => {
        const r = recompensas.find(r => r.id === recompensaId);
        return r ? r.nombre : `Recompensa #${recompensaId}`;
    };

    const formatFecha = (fecha) => {
        if (!fecha) return '-';
        return new Date(fecha).toLocaleString('es-MX');
    };

    if (loadingDatos) return <div className="card p-4">Cargando datos del backend...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Canje de Recompensas</h2>
            </div>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                Canjea puntos obtenidos por una venta registrada en el sistema.
            </p>
            {mensaje && (
                <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'}`} role="alert">
                    {mensaje.texto}
                </div>
            )}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">Nuevo Canje</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Venta *</label>
                                <select className="form-select" name="ventaId" value={form.ventaId} onChange={handleVentaChange} required>
                                    <option value="">Seleccionar venta...</option>
                                    {ventas.map(venta => (
                                        <option key={venta.id} value={venta.id}>
                                            {venta.folio ? `${venta.folio}` : `Venta ${venta.id}`} - ${venta.total?.toFixed?.(2) ?? venta.total}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Recompensa *</label>
                                <select className="form-select" name="recompensaId" value={form.recompensaId}
                                    onChange={(e) => setForm(prev => ({ ...prev, recompensaId: e.target.value }))}
                                    required disabled={!form.ventaId || recompensas.length === 0}>
                                    <option value="">Seleccionar recompensa...</option>
                                    {recompensas.map(recompensa => (
                                        <option key={recompensa.id} value={recompensa.id}>
                                            {recompensa.nombre} - {recompensa.costoPuntos} pts
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {recompensas.length === 0 && (
                            <div className="alert alert-warning mt-3 mb-0">No hay recompensas activas en la base de datos.</div>
                        )}
                        {form.ventaId && saldoActual !== null && (
                            <div className="mt-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                <strong>Saldo actual:</strong> {saldoActual} pts
                                {recompensaSeleccionada && (
                                    <span style={{ marginLeft: '15px', color: saldoActual >= recompensaSeleccionada.costoPuntos ? '#28a745' : '#dc3545' }}>
                                        {saldoActual >= recompensaSeleccionada.costoPuntos ? 'Saldo suficiente' : 'Saldo insuficiente'}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="mt-4">
                            <button type="submit" className="btn btn-primary"
                                disabled={loading || !form.ventaId || !form.recompensaId || recompensas.length === 0}>
                                {loading ? 'Procesando...' : 'Canjear Recompensa'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {form.ventaId && (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title mb-3">Historial de Canjes</h5>
                        {loadingHistorial ? <p>Cargando historial...</p> : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr><th>Recompensa</th><th>Puntos Usados</th><th>Fecha</th><th>Estado</th></tr>
                                    </thead>
                                    <tbody>
                                        {canjes.map((canje, index) => (
                                            <tr key={index}>
                                                <td>{getNombreRecompensa(canje.recompensaId)}</td>
                                                <td><span className="badge bg-primary">{canje.puntosUsados} pts</span></td>
                                                <td>{formatFecha(canje.fechaCanje)}</td>
                                                <td>{getEstadoBadge(canje.estado)}</td>
                                            </tr>
                                        ))}
                                        {canjes.length === 0 && (
                                            <tr><td colSpan="4" className="text-center">No hay canjes registrados para esta venta</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CanjeRecompensa;
