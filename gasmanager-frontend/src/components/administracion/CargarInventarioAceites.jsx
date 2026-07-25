import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { aceiteService, aceitesInventarioService } from '../../api/inventarios/auth';

const CargarInventarioAceites = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [aceites, setAceites] = useState([]);
    const [inventario, setInventario] = useState({});
    const [dispensarioId, setDispensarioId] = useState('');
    const [dispensarios, setDispensarios] = useState([]);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const aceitesData = await aceiteService.listarActivos();
            setAceites(aceitesData);

            const bodegaData = await aceitesInventarioService.listarBodega();
            const inventarioMap = {};
            bodegaData.forEach(item => {
                inventarioMap[item.aceiteId] = item.stockActual || 0;
            });
            setInventario(inventarioMap);

            const response = await fetch('/api/dispensarios/activos');
            if (response.ok) {
                const data = await response.json();
                setDispensarios(data);
                if (data.length > 0) {
                    setDispensarioId(data[0].id);
                }
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            setError('Error al cargar los datos');
        }
    };

    const handleStockChange = (aceiteId, value) => {
        setInventario(prev => ({
            ...prev,
            [aceiteId]: parseInt(value) || 0
        }));
    };

    const handleCargarInventario = async () => {
        setLoading(true);
        setMensaje(null);
        setError(null);

        try {
            await fetch('/api/inventario-aceites/reiniciar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            for (const aceite of aceites) {
                const cantidad = inventario[aceite.id] || 0;
                if (cantidad > 0) {
                    await fetch(`/api/inventario-aceites/bodega/${aceite.id}/stock?nuevoStock=${cantidad}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }

            setMensaje('✅ Inventario cargado exitosamente. Se actualizaron los stocks en bodega.');
            await cargarDatos();

        } catch (error) {
            console.error('Error cargando inventario:', error);
            setError('❌ Error al cargar inventario: ' + (error.message || 'Error desconocido'));
        }
        setLoading(false);
    };

    const handleCargarADispensario = async () => {
        if (!dispensarioId) {
            setError('Seleccione un dispensario');
            return;
        }

        setLoading(true);
        setMensaje(null);
        setError(null);

        try {
            const bodegaData = await aceitesInventarioService.listarBodega();

            const items = bodegaData
                .filter(item => item.stockActual > 0)
                .map(item => ({
                    aceiteId: item.aceiteId,
                    codigo: item.codigo,
                    nombre: item.nombre,
                    cantidad: item.stockActual,
                    precioVenta: item.precioVenta || 0
                }));

            if (items.length === 0) {
                setError('No hay stock en bodega para surtir');
                setLoading(false);
                return;
            }

            await aceitesInventarioService.surtirDispensario({
                dispensarioId: parseInt(dispensarioId),
                observaciones: 'Carga inicial de inventario',
                items: items
            });

            setMensaje(`✅ Inventario cargado exitosamente al dispensario ${dispensarios.find(d => d.id === parseInt(dispensarioId))?.nombre || ''}`);
            await cargarDatos();

        } catch (error) {
            console.error('Error cargando a dispensario:', error);
            setError('❌ Error al cargar a dispensario: ' + (error.response?.data?.message || error.message));
        }
        setLoading(false);
    };

    if (!isAdmin) {
        return <div className="alert alert-danger">No tienes permisos para acceder</div>;
    }

    return (
        <div className="card">
            <h2>📦 Cargar Inventario Inicial de Aceites</h2>
            <p className="text-muted">Configure el stock inicial de cada aceite en bodega</p>

            {mensaje && (
                <div className="alert alert-success">
                    {mensaje}
                </div>
            )}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="table-dark">
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Stock Inicial (Unidades)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {aceites.map(aceite => (
                        <tr key={aceite.id}>
                            <td><code>{aceite.codigo}</code></td>
                            <td>{aceite.nombre}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    value={inventario[aceite.id] || 0}
                                    onChange={(e) => handleStockChange(aceite.id, e.target.value)}
                                    style={{ width: '120px' }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="row g-3 mt-3">
                <div className="col-md-6">
                    <div className="card p-3">
                        <h5>📦 Cargar a Bodega</h5>
                        <p className="text-muted small">Actualiza el stock en bodega con los valores configurados</p>
                        <button
                            className="btn btn-primary"
                            onClick={handleCargarInventario}
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : '📦 Cargar Inventario a Bodega'}
                        </button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3">
                        <h5>⛽ Surtir a Dispensario</h5>
                        <p className="text-muted small">Transfiere TODO el stock de bodega a un dispensario</p>
                        <div className="mb-2">
                            <select
                                className="form-select"
                                value={dispensarioId}
                                onChange={(e) => setDispensarioId(e.target.value)}
                            >
                                {dispensarios.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="btn btn-success"
                            onClick={handleCargarADispensario}
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : '⛽ Surtir a Dispensario'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/modulo-administracion')}
                >
                    ← Volver
                </button>
            </div>
        </div>
    );
};

export default CargarInventarioAceites;