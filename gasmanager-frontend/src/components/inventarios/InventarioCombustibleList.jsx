import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventarioCombustibleService } from '../../api/inventarios/auth';
import { useAuth } from '../../contexts/AuthContext';

const InventarioCombustibleList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [inventario, setInventario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stockBajo, setStockBajo] = useState([]);

    useEffect(() => {
        cargarInventario();
        cargarStockBajo();
    }, []);

    const cargarInventario = async () => {
        setLoading(true);
        try {
            const data = await inventarioCombustibleService.listar();
            setInventario(data);
        } catch (error) {
            console.error('Error al cargar inventario:', error);
        }
        setLoading(false);
    };

    const cargarStockBajo = async () => {
        try {
            const data = await inventarioCombustibleService.stockBajo();
            setStockBajo(data);
        } catch (error) {
            console.error('Error al cargar stock bajo:', error);
        }
    };

    const getPorcentajeColor = (porcentaje) => {
        if (porcentaje < 20) return '#dc3545';
        if (porcentaje < 50) return '#ffc107';
        return '#28a745';
    };

    const isStockBajo = (tipo) => {
        return stockBajo.some(item => item.tipoCombustible === tipo);
    };

    if (loading) {
        return <div className="card">Cargando inventario de combustibles...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Inventario de Combustibles</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/cargas-pipa/nueva')}>
                        + Registrar Carga de Pipa
                    </button>
                )}
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Nombre</th>
                            <th>Stock Actual (L)</th>
                            <th>Capacidad (L)</th>
                            <th>% Ocupación</th>
                            <th>Stock Mínimo (L)</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventario.map(item => {
                            const porcentaje = item.porcentajeOcupacion || 0;
                            const bajo = isStockBajo(item.tipoCombustible);
                            return (
                                <tr key={item.id}>
                                    <td><strong>{item.tipoCombustible}</strong></td>
                                    <td>{item.nombre}</td>
                                    <td style={{ fontWeight: 'bold' }}>
                                        {item.stockActual?.toLocaleString()} L
                                    </td>
                                    <td>{item.capacidadTanque?.toLocaleString()} L</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '100px',
                                                height: '10px',
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: '5px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${porcentaje}%`,
                                                    height: '100%',
                                                    backgroundColor: getPorcentajeColor(porcentaje)
                                                }}></div>
                                            </div>
                                            <span>{porcentaje}%</span>
                                        </div>
                                    </td>
                                    <td>{item.stockMinimo?.toLocaleString()} L</td>
                                    <td>
                                        {bajo ? (
                                            <span className="badge badge-danger">⚠️ Stock Bajo</span>
                                        ) : (
                                            <span className="badge badge-success">Normal</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            style={{ padding: '4px 8px', fontSize: '12px' }}
                                            onClick={() => navigate(`/cargas-pipa/tipo/${item.tipoCombustible}`)}
                                        >
                                            Ver Cargas
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventarioCombustibleList;