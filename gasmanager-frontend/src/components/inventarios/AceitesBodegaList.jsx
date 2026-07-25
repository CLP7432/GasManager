import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aceitesInventarioService } from '../../api/inventarios/auth';

const AceitesBodegaList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [aceites, setAceites] = useState([]);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        cargarAceites();
    }, [filtro]);

    const cargarAceites = async () => {
        setLoading(true);
        try {
            let data;
            if (filtro === 'stock-bajo') {
                data = await aceitesInventarioService.listarStockBajoBodega();
            } else if (filtro === 'stock-critico') {
                data = await aceitesInventarioService.listarStockCriticoBodega();
            } else {
                data = await aceitesInventarioService.listarBodega();
            }
            // Asegurar que sea un array
            setAceites(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error cargando aceites:', error);
            setAceites([]);
            alert('Error al cargar el inventario de bodega');
        }
        setLoading(false);
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
        return <div className="card">Cargando inventario de bodega...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🏠 Inventario en Bodega</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="todos">Todos</option>
                        <option value="stock-bajo">Stock Bajo</option>
                        <option value="stock-critico">Stock Crítico</option>
                    </select>
                    <button className="btn btn-secondary" onClick={cargarAceites}>
                        Actualizar
                    </button>
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
                                    No hay aceites en bodega
                                </td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot>
                        <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                            <td colSpan="2" style={{ textAlign: 'right' }}>Totales:</td>
                            <td style={{ textAlign: 'center' }}>
                                {aceites && aceites.length > 0 ? aceites.reduce((sum, a) => sum + (a.stockActual || 0), 0) : 0}
                            </td>
                            <td colSpan="4"></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AceitesBodegaList;