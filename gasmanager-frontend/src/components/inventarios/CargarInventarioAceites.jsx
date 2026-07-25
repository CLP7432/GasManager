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
    const [resumen, setResumen] = useState(null);

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
        // 🔥 Validar que haya al menos un aceite con stock > 0
        const itemsACargar = aceites.filter(a => (inventario[a.id] || 0) > 0);

        if (itemsACargar.length === 0) {
            setError('❌ No hay aceites con stock para cargar. Asigne stock a al menos un aceite.');
            return;
        }

        setLoading(true);
        setMensaje(null);
        setError(null);
        setResumen(null);

        try {
            // 1. Reiniciar todo a cero primero
            await fetch('/api/inventario-aceites/reiniciar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            // 2. Actualizar cada aceite en bodega
            let cargados = 0;
            let totalUnidades = 0;
            const detalles = [];

            for (const aceite of itemsACargar) {
                const cantidad = inventario[aceite.id] || 0;
                if (cantidad > 0) {
                    await fetch(`/api/inventario-aceites/bodega/${aceite.id}/stock?nuevoStock=${cantidad}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    cargados++;
                    totalUnidades += cantidad;
                    detalles.push(`${aceite.codigo}: ${cantidad} unidades`);
                }
            }

            setResumen({
                cargados,
                totalUnidades,
                detalles
            });

            setMensaje(`✅ Inventario cargado exitosamente. Se actualizaron ${cargados} aceites con ${totalUnidades} unidades en bodega.`);
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
        setResumen(null);

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
                setError('❌ No hay stock en bodega para surtir. Primero cargue stock en bodega.');
                setLoading(false);
                return;
            }

            await aceitesInventarioService.surtirDispensario({
                dispensarioId: parseInt(dispensarioId),
                observaciones: 'Carga inicial de inventario',
                items: items
            });

            const totalUnidades = items.reduce((sum, item) => sum + item.cantidad, 0);
            setResumen({
                cargados: items.length,
                totalUnidades,
                detalles: items.map(i => `${i.codigo}: ${i.cantidad} unidades`),
                dispensarioNombre: dispensarios.find(d => d.id === parseInt(dispensarioId))?.nombre || ''
            });

            setMensaje(`✅ ${items.length} aceites surtidos al dispensario ${dispensarios.find(d => d.id === parseInt(dispensarioId))?.nombre || ''} (${totalUnidades} unidades totales)`);
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

    // Contar cuántos aceites tienen stock configurado
    const itemsConStock = aceites.filter(a => (inventario[a.id] || 0) > 0);

    return (
        <div className="card">
            <h2>📦 Cargar Inventario Inicial de Aceites</h2>
            <p className="text-muted">Configure el stock inicial de cada aceite en bodega</p>

            {mensaje && (
                <div className="alert alert-success">
                    {mensaje}
                    {resumen && (
                        <div className="mt-2">
                            <strong>Resumen:</strong>
                            <ul className="mb-0">
                                <li>Aceites cargados: {resumen.cargados}</li>
                                <li>Unidades totales: {resumen.totalUnidades}</li>
                                {resumen.detalles && resumen.detalles.length <= 10 && (
                                    resumen.detalles.map((d, i) => <li key={i}>{d}</li>)
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="alert alert-info">
                <strong>ℹ️ Información:</strong>
                <ul className="mt-2 mb-0">
                    <li>Aceites configurados: <strong>{aceites.length}</strong></li>
                    <li>Aceites con stock: <strong>{itemsConStock.length}</strong></li>
                    <li>Unidades totales a cargar: <strong>{itemsConStock.reduce((sum, a) => sum + (inventario[a.id] || 0), 0)}</strong></li>
                </ul>
            </div>

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
                            disabled={loading || itemsConStock.length === 0}
                        >
                            {loading ? 'Cargando...' : `📦 Cargar ${itemsConStock.length} aceites a Bodega`}
                        </button>
                        {itemsConStock.length === 0 && (
                            <small className="text-warning mt-1">⚠️ Asigne stock a al menos un aceite</small>
                        )}
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