import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ReiniciarInventarioAceites = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [confirmacion, setConfirmacion] = useState('');
    const [opcion, setOpcion] = useState('solo-stock');

    const handleReiniciar = async () => {
        if (confirmacion !== 'REINICIAR') {
            alert('Escriba "REINICIAR" para confirmar');
            return;
        }

        const mensaje = opcion === 'completo'
            ? '⚠️ ¿ESTÁ SEGURO? Esta acción ELIMINARÁ TODOS los historiales de compras y transferencias, y pondrá en CERO todos los stocks. No se puede deshacer.'
            : '⚠️ ¿ESTÁ SEGURO? Esta acción pondrá en CERO todos los stocks de aceites en bodega y dispensarios. No se puede deshacer.';

        if (!window.confirm(mensaje)) {
            return;
        }

        setLoading(true);
        try {
            const endpoint = opcion === 'completo'
                ? '/api/inventario-aceites/reiniciar-completo'
                : '/api/inventario-aceites/reiniciar';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                alert('✅ ' + (data.mensaje || 'Inventario reiniciado correctamente'));
                navigate('/inventario-aceites');
            } else {
                alert('❌ Error: ' + (data.message || data.error || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error reiniciando inventario:', error);
            alert('❌ Error al reiniciar inventario: ' + error.message);
        }
        setLoading(false);
    };

    if (!isAdmin) {
        return <div className="alert alert-danger">No tienes permisos para acceder</div>;
    }

    return (
        <div className="card">
            <h2>🛢️ Reiniciar Inventario de Aceites</h2>
            <p className="text-muted">Seleccione el tipo de reinicio que desea realizar</p>

            <div className="row g-3 mb-4">
                {/* ===== OPCIÓN 1: SOLO STOCK ===== */}
                <div className="col-md-6">
                    <div
                        className={`card h-100 ${opcion === 'solo-stock' ? 'border-primary border-3' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setOpcion('solo-stock')}
                    >
                        <div className="card-body text-center">
                            <div style={{ fontSize: '48px' }}>📦</div>
                            <h4 className="card-title">Solo Reiniciar Stock</h4>
                            <p className="card-text text-muted">
                                Pone en <strong>CERO</strong> todos los stocks de aceites en bodega y dispensarios.
                            </p>
                            <ul className="text-start small">
                                <li className="text-success">✅ Conserva historial de compras</li>
                                <li className="text-success">✅ Conserva historial de transferencias</li>
                                <li className="text-warning">⚠️ Stock en bodega → 0</li>
                                <li className="text-warning">⚠️ Stock en dispensarios → 0</li>
                            </ul>
                            {opcion === 'solo-stock' && (
                                <span className="badge bg-primary" style={{ fontSize: '14px' }}>✓ SELECCIONADO</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== OPCIÓN 2: REINICIO COMPLETO ===== */}
                <div className="col-md-6">
                    <div
                        className={`card h-100 ${opcion === 'completo' ? 'border-danger border-3' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setOpcion('completo')}
                    >
                        <div className="card-body text-center">
                            <div style={{ fontSize: '48px' }}>🔥</div>
                            <h4 className="card-title text-danger">Reinicio COMPLETO</h4>
                            <p className="card-text text-muted">
                                <strong>ELIMINA</strong> todos los historiales y pone en <strong>CERO</strong> todos los stocks.
                            </p>
                            <ul className="text-start small">
                                <li className="text-danger">❌ Elimina TODAS las compras</li>
                                <li className="text-danger">❌ Elimina TODAS las transferencias</li>
                                <li className="text-warning">⚠️ Stock en bodega → 0</li>
                                <li className="text-warning">⚠️ Stock en dispensarios → 0</li>
                            </ul>
                            {opcion === 'completo' && (
                                <span className="badge bg-danger" style={{ fontSize: '14px' }}>✓ SELECCIONADO</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {opcion === 'completo' && (
                <div className="alert alert-danger">
                    <strong>🔥 ADVERTENCIA DE REINICIO COMPLETO:</strong>
                    <ul className="mt-2 mb-0">
                        <li>Se eliminarán TODAS las <strong>compras</strong> registradas</li>
                        <li>Se eliminarán TODAS las <strong>transferencias</strong> realizadas</li>
                        <li>Se pondrá en <strong>CERO</strong> el stock en bodega y dispensarios</li>
                        <li className="text-success">✅ Se conservarán los catálogos de aceites</li>
                        <li className="text-danger">⚠️ Esta acción NO se puede deshacer</li>
                    </ul>
                </div>
            )}

            {opcion === 'solo-stock' && (
                <div className="alert alert-info">
                    <strong>ℹ️ Reinicio de Stock:</strong>
                    <ul className="mt-2 mb-0">
                        <li>Los stocks en bodega y dispensarios se pondrán en <strong>CERO</strong></li>
                        <li>Se conservarán TODOS los historiales de <strong>compras</strong> y <strong>transferencias</strong></li>
                        <li>Los catálogos de aceites y sus precios se conservan</li>
                    </ul>
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">
                    Escriba <strong className="text-danger">REINICIAR</strong> para confirmar:
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={confirmacion}
                    onChange={(e) => setConfirmacion(e.target.value)}
                    placeholder="REINICIAR"
                    style={{ maxWidth: '300px' }}
                />
            </div>

            <div className="d-flex gap-2">
                <button
                    className={`btn ${opcion === 'completo' ? 'btn-danger' : 'btn-warning'}`}
                    onClick={handleReiniciar}
                    disabled={loading || confirmacion !== 'REINICIAR'}
                    style={{ fontWeight: 'bold' }}
                >
                    {loading ? 'Reiniciando...' : opcion === 'completo' ? '🔥 Ejecutar Reinicio COMPLETO' : '📦 Ejecutar Reinicio de Stock'}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/modulo-administracion')}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default ReiniciarInventarioAceites;