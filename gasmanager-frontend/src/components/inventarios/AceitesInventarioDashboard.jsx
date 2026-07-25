import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aceitesInventarioService } from '../../api/inventarios/auth';

const AceitesInventarioDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBodega: 0,
        stockBajo: 0,
        stockCritico: 0,
        transferencias: 0,
        compras: 0
    });

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        setLoading(true);
        try {
            let bodega = [];
            let stockBajo = [];
            let transferencias = [];
            let compras = [];

            try {
                const bodegaData = await aceitesInventarioService.listarBodega();
                bodega = Array.isArray(bodegaData) ? bodegaData : [];
            } catch (e) {
                console.error('Error cargando bodega:', e);
            }

            try {
                const stockBajoData = await aceitesInventarioService.listarStockBajoBodega();
                stockBajo = Array.isArray(stockBajoData) ? stockBajoData : [];
            } catch (e) {
                console.error('Error cargando stock bajo:', e);
            }

            try {
                const transferenciasData = await aceitesInventarioService.listarTransferencias();
                transferencias = Array.isArray(transferenciasData) ? transferenciasData : [];
            } catch (e) {
                console.error('Error cargando transferencias:', e);
            }

            try {
                const comprasData = await aceitesInventarioService.listarCompras();
                compras = Array.isArray(comprasData) ? comprasData : [];
            } catch (e) {
                console.error('Error cargando compras:', e);
            }

            // 🔥 CORREGIDO: Contar UNIDADES totales, no productos
            // Stock Bajo: Suma de unidades de productos con stock bajo
            const stockBajoUnidades = stockBajo.reduce((sum, item) => sum + (item.stockActual || 0), 0);

            // Stock Crítico: Suma de unidades de productos con stock crítico
            const stockCriticoUnidades = stockBajo
                .filter(item => item.stockCritico)
                .reduce((sum, item) => sum + (item.stockActual || 0), 0);

            setStats({
                totalBodega: bodega.reduce((sum, item) => sum + (item.stockActual || 0), 0),
                stockBajo: stockBajoUnidades,
                stockCritico: stockCriticoUnidades,
                transferencias: transferencias.length,
                compras: compras.length
            });
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
        setLoading(false);
    };

    const submodulos = [
        { name: 'Inventario en Bodega', icon: '🏠', path: '/inventario-aceites/bodega', color: '#28a745' },
        { name: 'Stock por Dispensario', icon: '⛽', path: '/inventario-aceites/dispensarios', color: '#17a2b8' },
        { name: 'Registrar Compra', icon: '📦', path: '/inventario-aceites/compras/nueva', color: '#fd7e14' },
        { name: 'Surtir a Dispensario', icon: '🔄', path: '/inventario-aceites/surtir', color: '#6f42c1' },
        { name: 'Historial de Movimientos', icon: '📋', path: '/inventario-aceites/transferencias', color: '#20c997' }
    ];

    if (loading) {
        return <div className="card">Cargando estadísticas...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🛢️ Inventario de Aceites y Aditivos</h2>
                <button className="btn btn-secondary" onClick={cargarEstadisticas}>
                    Actualizar
                </button>
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                marginBottom: '30px'
            }}>
                <div className="card" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#e8f5e9' }}>
                    <small className="text-muted">Stock Bodega</small>
                    <h3 style={{ color: '#28a745' }}>{stats.totalBodega}</h3>
                    <small>unidades</small>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fff3e0' }}>
                    <small className="text-muted">Stock Bajo</small>
                    <h3 style={{ color: '#ff9800' }}>{stats.stockBajo}</h3>
                    <small>unidades</small>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#ffebee' }}>
                    <small className="text-muted">Stock Crítico</small>
                    <h3 style={{ color: '#f44336' }}>{stats.stockCritico}</h3>
                    <small>unidades</small>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#e3f2fd' }}>
                    <small className="text-muted">Transferencias</small>
                    <h3 style={{ color: '#2196f3' }}>{stats.transferencias}</h3>
                    <small>movimientos</small>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f3e5f5' }}>
                    <small className="text-muted">Compras</small>
                    <h3 style={{ color: '#9c27b0' }}>{stats.compras}</h3>
                    <small>registradas</small>
                </div>
            </div>

            {/* Submódulos */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
            }}>
                {submodulos.map((modulo, index) => (
                    <div
                        key={index}
                        className="card"
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            padding: '20px',
                            borderTop: `4px solid ${modulo.color}`,
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onClick={() => navigate(modulo.path)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                            {modulo.icon}
                        </div>
                        <h5>{modulo.name}</h5>
                        <span style={{ fontSize: '12px', color: modulo.color }}>Ir →</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AceitesInventarioDashboard;