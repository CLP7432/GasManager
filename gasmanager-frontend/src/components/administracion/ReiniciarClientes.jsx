import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ReiniciarClientes = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [confirmacion, setConfirmacion] = useState('');

    const handleReiniciar = async () => {
        if (confirmacion !== 'REINICIAR') {
            alert('Escriba "REINICIAR" para confirmar');
            return;
        }

        if (!window.confirm('⚠️ ¿ESTÁ SEGURO? Esta acción eliminará TODOS los clientes, créditos y abonos. No se puede deshacer.')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/admin-clientes/reiniciar-clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (response.ok) {
                alert('✅ ' + data.mensaje);
                navigate('/modulo-administracion');
            } else {
                alert('❌ Error: ' + data.error);
            }
        } catch (error) {
            alert('❌ Error al reiniciar clientes');
        }
        setLoading(false);
    };

    if (!isAdmin) {
        return <div className="alert alert-danger">No tienes permisos para acceder</div>;
    }

    return (
        <div className="card">
            <h2 className="text-danger">👥 Reiniciar Clientes y Créditos</h2>

            <div className="alert alert-warning">
                <strong>⚠️ ADVERTENCIA:</strong>
                <ul className="mt-2 mb-0">
                    <li>Se eliminarán TODOS los <strong>clientes</strong></li>
                    <li>Se eliminarán TODOS los <strong>créditos</strong></li>
                    <li>Se eliminarán TODOS los <strong>abonos</strong></li>
                    <li className="text-success">✅ Las tablas quedarán completamente vacías</li>
                </ul>
            </div>

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
                />
            </div>

            <div className="d-flex gap-2">
                <button
                    className="btn btn-danger"
                    onClick={handleReiniciar}
                    disabled={loading || confirmacion !== 'REINICIAR'}
                >
                    {loading ? 'Reiniciando...' : '👥 Reiniciar Clientes'}
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

export default ReiniciarClientes;