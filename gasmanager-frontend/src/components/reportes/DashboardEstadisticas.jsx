import React, { useState, useEffect } from 'react';
import TarjetaEstadistica from './TarjetaEstadistica';
import { reportesService } from '../../api/reportes/auth';

const DashboardEstadisticas = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDashboard();
    }, []);

    const cargarDashboard = async () => {
        setLoading(true);
        try {
            const data = await reportesService.getDashboard();
            setDashboardData(data);
        } catch (error) {
            console.error('Error al cargar dashboard:', error);
        }
        setLoading(false);
    };

    const formatMonto = (monto) => {
        if (!monto && monto !== 0) return '$0.00';
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    return (
        <div style={{ marginBottom: '30px' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
            }}>
                <TarjetaEstadistica
                    titulo="Ventas Hoy"
                    valor={formatMonto(dashboardData?.ventasHoy)}
                    icono="💰"
                    color="#28a745"
                    loading={loading}
                />
                <TarjetaEstadistica
                    titulo="Ventas Semana"
                    valor={formatMonto(dashboardData?.ventasSemana)}
                    icono="📊"
                    color="#17a2b8"
                    loading={loading}
                />
                <TarjetaEstadistica
                    titulo="Ventas Mes"
                    valor={formatMonto(dashboardData?.ventasMes)}
                    icono="📈"
                    color="#ffc107"
                    loading={loading}
                />
                <TarjetaEstadistica
                    titulo="Total Ventas (Mes)"
                    valor={dashboardData?.totalVentasMes || 0}
                    icono="🔄"
                    color="#6c757d"
                    subtitulo="operaciones"
                    loading={loading}
                />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
            }}>
                <TarjetaEstadistica
                    titulo="Clientes Activos"
                    valor={dashboardData?.clientesActivos || 0}
                    icono="👥"
                    color="#20c997"
                    loading={loading}
                />
                <TarjetaEstadistica
                    titulo="Facturas Mes"
                    valor={dashboardData?.facturasEmitidasMes || 0}
                    icono="📄"
                    color="#fd7e14"
                    loading={loading}
                />
                <TarjetaEstadistica
                    titulo="Créditos Vencidos"
                    valor={formatMonto(dashboardData?.creditosVencidos)}
                    icono="⚠️"
                    color="#dc3545"
                    loading={loading}
                />
                <TarjetaEstadistica
                    titulo="Empleados Activos"
                    valor={dashboardData?.empleadosActivos || 0}
                    icono="👨‍💼"
                    color="#6f42c1"
                    loading={loading}
                />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px'
            }}>
                <TarjetaEstadistica
                    titulo="Stock Promedio Combustible"
                    valor={`${dashboardData?.stockCombustiblePromedio?.toLocaleString() || 0} L`}
                    icono="⛽"
                    color="#17a2b8"
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default DashboardEstadisticas;