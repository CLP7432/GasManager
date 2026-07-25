import React, { useState, useEffect } from 'react';
import { aceitesInventarioService } from '../../api/inventarios/auth';

const AceitesTransferenciasList = () => {
    const [loading, setLoading] = useState(true);
    const [transferencias, setTransferencias] = useState([]);
    const [compras, setCompras] = useState([]);
    const [tab, setTab] = useState('transferencias');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [transfData, comprasData] = await Promise.all([
                aceitesInventarioService.listarTransferencias(),
                aceitesInventarioService.listarCompras()
            ]);
            setTransferencias(Array.isArray(transfData) ? transfData : []);
            setCompras(Array.isArray(comprasData) ? comprasData : []);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setTransferencias([]);
            setCompras([]);
        }
        setLoading(false);
    };

    const getTipoBadge = (tipo) => {
        const colores = {
            TRANSFERENCIA: 'badge badge-primary',
            AJUSTE: 'badge badge-warning',
            DEVOLUCION: 'badge badge-danger'
        };
        return <span className={colores[tipo] || 'badge badge-secondary'}>{tipo}</span>;
    };

    if (loading) {
        return <div className="card">Cargando historial...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>📋 Historial de Movimientos</h2>
                <button className="btn btn-secondary" onClick={cargarDatos}>
                    Actualizar
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    className={`btn ${tab === 'transferencias' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setTab('transferencias')}
                >
                    Transferencias ({transferencias ? transferencias.length : 0})
                </button>
                <button
                    className={`btn ${tab === 'compras' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setTab('compras')}
                >
                    Compras ({compras ? compras.length : 0})
                </button>
            </div>

            {tab === 'transferencias' && (
                <div className="card">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Folio</th>
                                <th>Aceite</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Cantidad</th>
                                <th>Tipo</th>
                                <th>Fecha</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transferencias && transferencias.length > 0 ? (
                                transferencias.map(t => (
                                    <tr key={t.id}>
                                        <td><code>{t.folio}</code></td>
                                        <td>{t.aceiteNombre}</td>
                                        <td><span className="badge badge-secondary">{t.dispensarioOrigenNombre}</span></td>
                                        <td><span className="badge badge-success">{t.dispensarioDestinoNombre}</span></td>
                                        <td style={{ fontWeight: 'bold', textAlign: 'center' }}>{t.cantidad}</td>
                                        <td>{getTipoBadge(t.tipo)}</td>
                                        <td>{new Date(t.fechaMovimiento).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>
                                        No hay transferencias registradas
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'compras' && (
                <div className="card">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Folio</th>
                                <th>Aceite</th>
                                <th>Proveedor</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Total</th>
                                <th>Fecha</th>
                            </tr>
                            </thead>
                            <tbody>
                            {compras && compras.length > 0 ? (
                                compras.map(c => (
                                    <tr key={c.id}>
                                        <td><code>{c.folio}</code></td>
                                        <td>{c.aceiteNombre}</td>
                                        <td>{c.proveedor}</td>
                                        <td style={{ textAlign: 'center' }}>{c.cantidad}</td>
                                        <td style={{ textAlign: 'right' }}>${c.precioUnitario?.toFixed(2)}</td>
                                        <td style={{ fontWeight: 'bold', color: '#28a745', textAlign: 'right' }}>
                                            ${c.total?.toFixed(2)}
                                        </td>
                                        <td>{new Date(c.fechaCompra).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>
                                        No hay compras registradas
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AceitesTransferenciasList;