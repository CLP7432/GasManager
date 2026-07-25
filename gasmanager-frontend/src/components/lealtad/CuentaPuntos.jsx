import React, { useState, useEffect } from 'react';
import { puntosService, extractApiError } from '../../api/lealtad/auth.js';
import { ventasService } from '../../api/ventas/auth.js';

const CuentaPuntos = () => {
    const [ventas, setVentas] = useState([]);
    const [ventaId, setVentaId] = useState('');
    const [saldo, setSaldo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        try {
            const data = await ventasService.listar(0, 100);
            const ventasData = Array.isArray(data.ventas) ? data.ventas : Array.isArray(data) ? data : [];
            setVentas(ventasData);
        } catch (err) {
            console.error('Error al cargar ventas:', err);
        }
    };

    const consultarSaldo = async (id = ventaId) => {
        if (!id) return;
        setLoading(true);
        setError(null);
        setSaldo(null);
        try {
            const data = await puntosService.consultarSaldo(id);
            setSaldo(data.saldoPuntos);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Esta venta aun no tiene cuenta de puntos. Registra una transaccion de lealtad primero.');
            } else {
                setError(extractApiError(err, 'Error al consultar el saldo de puntos'));
            }
        }
        setLoading(false);
    };

    const handleVentaChange = (e) => {
        const id = e.target.value;
        setVentaId(id);
        if (id) {
            consultarSaldo(id);
        } else {
            setSaldo(null);
            setError(null);
        }
    };

    const ventaSeleccionada = ventas.find(v => v.id === parseInt(ventaId));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Consulta de Puntos</h2>
            </div>

            <p style={{ color: '#666', marginBottom: '20px' }}>
                Consulta el saldo de puntos acumulados por una venta registrada en el sistema.
            </p>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2 align-items-end">
                        <div className="col-md-8">
                            <label className="form-label">Venta</label>
                            <select
                                className="form-select"
                                value={ventaId}
                                onChange={handleVentaChange}
                            >
                                <option value="">Seleccionar venta...</option>
                                {ventas.map(venta => (
                                    <option key={venta.id} value={venta.id}>
                                        {venta.folio ? `${venta.folio}` : `Venta ${venta.id}`} - ${venta.total?.toFixed?.(2) ?? venta.total}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <button
                                className="btn btn-primary w-100"
                                onClick={() => consultarSaldo()}
                                disabled={!ventaId || loading}
                            >
                                {loading ? 'Consultando...' : 'Consultar Saldo'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-warning" role="alert">{error}</div>
            )}

            {saldo !== null && !error && (
                <div className="card" style={{ borderTop: '4px solid #e83e8c' }}>
                    <div className="card-body text-center" style={{ padding: '40px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>&#11088;</div>
                        <h3 style={{ color: '#333', marginBottom: '10px' }}>
                            {ventaSeleccionada?.folio || `Venta #${ventaId}`}
                        </h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Saldo de puntos de lealtad</p>
                        <div style={{
                            fontSize: '56px',
                            fontWeight: 'bold',
                            color: '#e83e8c',
                            marginBottom: '10px'
                        }}>
                            {saldo}
                        </div>
                        <span className="badge bg-primary" style={{ fontSize: '14px' }}>puntos disponibles</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CuentaPuntos;
