import React, { useState, useEffect } from 'react';
import { transaccionesService, programasService, extractApiError } from '../../api/lealtad/auth.js';
import { ventasService } from '../../api/ventas/auth.js';

const Transaccion = () => {
    const [ventas, setVentas] = useState([]);
    const [programaActivo, setProgramaActivo] = useState(null);
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingHistorial, setLoadingHistorial] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [form, setForm] = useState({ ventaId: '' });

    useEffect(() => {
        cargarVentas();
        cargarProgramaActivo();
    }, []);

    const cargarVentas = async () => {
        try {
            const data = await ventasService.listar(0, 100);
            const ventasData = Array.isArray(data.ventas) ? data.ventas : Array.isArray(data) ? data : [];
            setVentas(ventasData);
        } catch (error) {
            console.error('Error al cargar ventas:', error);
        }
    };

    const cargarProgramaActivo = async () => {
        try {
            const activo = await programasService.obtenerActivo();
            setProgramaActivo(activo);
        } catch {
            setProgramaActivo(null);
        }
    };

    const cargarHistorial = async (ventaId) => {
        if (!ventaId) {
            setTransacciones([]);
            return;
        }
        setLoadingHistorial(true);
        try {
            const data = await transaccionesService.listarPorVenta(ventaId);
            setTransacciones(data);
        } catch {
            setTransacciones([]);
        }
        setLoadingHistorial(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (name === 'ventaId') {
            cargarHistorial(value);
        }
    };

    const ventaSeleccionada = ventas.find(v => v.id === parseInt(form.ventaId));

    const formatFecha = (fecha) => {
        if (!fecha) return '-';
        return new Date(fecha).toLocaleString('es-MX');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);

        if (!programaActivo) {
            setMensaje({
                tipo: 'error',
                texto: 'No hay un programa de lealtad activo. Configura uno en Configuracion antes de registrar transacciones.'
            });
            return;
        }

        setLoading(true);

        try {
            const resultado = await transaccionesService.registrar(parseInt(form.ventaId));
            setMensaje({
                tipo: 'success',
                texto: `Transaccion registrada para la venta ${ventaSeleccionada?.folio || form.ventaId}. Se acreditaron ${resultado.puntosGenerados} puntos.`
            });
            cargarHistorial(form.ventaId);
        } catch (error) {
            setMensaje({
                tipo: 'error',
                texto: extractApiError(error, 'Error al registrar la transaccion')
            });
        }
        setLoading(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Registrar Transaccion</h2>
            </div>

            <p style={{ color: '#666', marginBottom: '20px' }}>
                Registra una venta existente para acumular puntos de lealtad. El calculo se realiza segun el programa activo en el backend.
            </p>

            {programaActivo ? (
                <div className="alert alert-info" role="alert">
                    Programa activo: <strong>{programaActivo.nombre}</strong> con <strong>{programaActivo.factorPuntos} puntos por litro</strong>.
                </div>
            ) : (
                <div className="alert alert-warning" role="alert">
                    No hay programa de lealtad activo. Ve a <strong>Configuracion</strong> para crear y activar uno.
                </div>
            )}

            {mensaje && (
                <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'}`} role="alert">
                    {mensaje.texto}
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label className="form-label">Venta *</label>
                                <select
                                    className="form-select"
                                    name="ventaId"
                                    value={form.ventaId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar venta...</option>
                                    {ventas.map(venta => (
                                        <option key={venta.id} value={venta.id}>
                                            {venta.folio ? `${venta.folio}` : `Venta ${venta.id}`} - ${venta.total?.toFixed?.(2) ?? venta.total}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {ventaSeleccionada && (
                            <div className="mt-3 p-3" style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0'
                            }}>
                                <strong>Detalle de la venta:</strong>
                                <p className="mb-1">Folio: {ventaSeleccionada.folio || ventaSeleccionada.id}</p>
                                <p className="mb-0">Total: ${ventaSeleccionada.total?.toFixed?.(2) ?? ventaSeleccionada.total}</p>
                            </div>
                        )}

                        <div className="mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || !form.ventaId || !programaActivo}
                            >
                                {loading ? 'Registrando...' : 'Registrar Transaccion'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {form.ventaId && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h5 className="card-title mb-3">Historial de Transacciones</h5>
                        {loadingHistorial ? (
                            <p>Cargando historial...</p>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Litros</th>
                                        <th>Monto</th>
                                        <th>Puntos Generados</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {transacciones.map((tx, index) => (
                                        <tr key={index}>
                                            <td>{formatFecha(tx.fecha)}</td>
                                            <td>{tx.litros?.toFixed?.(2) ?? tx.litros}</td>
                                            <td>${tx.monto?.toFixed?.(2) ?? tx.monto}</td>
                                            <td><span className="badge bg-success">{tx.puntosGenerados} pts</span></td>
                                        </tr>
                                    ))}
                                    {transacciones.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                No hay transacciones registradas para esta venta
                                            </td>
                                        </tr>
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

export default Transaccion;
