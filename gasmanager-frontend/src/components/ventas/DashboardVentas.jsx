import React, { useState, useEffect } from 'react';
import { ventasService } from '../../api/ventas/auth';

const DashboardVentas = () => {
    const [estadisticas, setEstadisticas] = useState({
        ventasHoy: 0,
        totalHoy: 0,
        ventasPendientes: 0,
        ventasCompletadas: 0,
        ventasCanceladas: 0,
        totalVentas: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        setLoading(true);
        try {
            const data = await ventasService.obtenerEstadisticas();
            setEstadisticas(data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="card">Cargando estadísticas...</div>;
    }

    return (
        <div>
            <h2>Dashboard de Ventas</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Ventas Hoy</h4>
                    <div className="stat-number">{estadisticas.ventasHoy}</div>
                    <small>Total: ${estadisticas.totalHoy?.toFixed(2) || 0}</small>
                </div>

                <div className="stat-card">
                    <h4>Ventas Pendientes</h4>
                    <div className="stat-number" style={{ color: '#ffc107' }}>
                        {estadisticas.ventasPendientes}
                    </div>
                </div>

                <div className="stat-card">
                    <h4>Ventas Completadas</h4>
                    <div className="stat-number" style={{ color: '#28a745' }}>
                        {estadisticas.ventasCompletadas}
                    </div>
                </div>

                <div className="stat-card">
                    <h4>Ventas Canceladas</h4>
                    <div className="stat-number" style={{ color: '#dc3545' }}>
                        {estadisticas.ventasCanceladas}
                    </div>
                </div>

                <div className="stat-card">
                    <h4>Total Ventas</h4>
                    <div className="stat-number">{estadisticas.totalVentas}</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardVentas;