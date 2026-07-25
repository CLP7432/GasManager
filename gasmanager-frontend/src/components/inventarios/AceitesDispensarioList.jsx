import React, { useState, useEffect } from 'react';
import { aceitesInventarioService } from '../../api/inventarios/auth';

const AceitesDispensarioList = () => {
    const [loading, setLoading] = useState(true);
    const [dispensarios, setDispensarios] = useState([]);
    const [aceites, setAceites] = useState([]);
    const [dispensarioSeleccionado, setDispensarioSeleccionado] = useState('');

    useEffect(() => {
        cargarDispensarios();
        cargarAceites();
    }, []);

    const cargarDispensarios = async () => {
        try {
            const response = await fetch('/api/dispensarios/activos');
            if (response.ok) {
                const data = await response.json();
                setDispensarios(Array.isArray(data) ? data : []);
                if (data.length > 0) {
                    setDispensarioSeleccionado(data[0].id);
                }
            }
        } catch (error) {
            console.error('Error cargando dispensarios:', error);
            setDispensarios([]);
        }
    };

    const cargarAceites = async () => {
        setLoading(true);
        try {
            const data = await aceitesInventarioService.obtenerResumenStock();
            setAceites(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error cargando aceites:', error);
            setAceites([]);
        }
        setLoading(false);
    };

    const cargarPorDispensario = async (dispensarioId) => {
        setLoading(true);
        try {
            const data = await aceitesInventarioService.listarStockDispensario(dispensarioId);
            setAceites(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error cargando aceites:', error);
            setAceites([]);
        }
        setLoading(false);
    };

    const handleDispensarioChange = (e) => {
        const id = parseInt(e.target.value);
        setDispensarioSeleccionado(id);
        cargarPorDispensario(id);
    };

    const getStockBadge = (stockActual, stockMinimo) => {
        if (stockActual <= 0) {
            return <span className="badge badge-danger">⚠️ SIN STOCK</span>;
        } else if (stockActual <= stockMinimo) {
            return <span className="badge badge-warning">⚠️ STOCK BAJO</span>;
        } else {
            return <span className="badge badge-success">✅ OK</span>;
        }
    };

    if (loading) {
        return <div className="card">Cargando stock de dispensarios...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>⛽ Stock por Dispensario</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label>Dispensario:</label>
                    <select
                        value={dispensarioSeleccionado}
                        onChange={handleDispensarioChange}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        {dispensarios.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Stock Actual</th>
                            <th>Stock Mínimo</th>
                            <th>Stock Máximo</th>
                            <th>Estado</th>
                            <th>Precio Venta</th>
                        </tr>
                        </thead>
                        <tbody>
                        {aceites && aceites.length > 0 ? (
                            aceites.map(aceite => (
                                <tr key={aceite.id}>
                                    <td><code>{aceite.codigo}</code></td>
                                    <td><strong>{aceite.nombre}</strong></td>
                                    <td style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                        {aceite.stockActual}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{aceite.stockMinimo}</td>
                                    <td style={{ textAlign: 'center' }}>{aceite.stockMaximo}</td>
                                    <td>{getStockBadge(aceite.stockActual, aceite.stockMinimo)}</td>
                                    <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                                        ${aceite.precioVenta?.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>
                                    No hay aceites en este dispensario
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AceitesDispensarioList;