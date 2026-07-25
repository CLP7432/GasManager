import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import DashboardEstadisticas from '../../components/reportes/DashboardEstadisticas';
import HighchartsVentas from '../../components/reportes/HighchartsVentas';
import HighchartsInventario from '../../components/reportes/HighchartsInventario';
import { reportesService, downloadBlob } from '../../api/reportes/auth';

const NuevoDashboardPage = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [exportando, setExportando] = useState(false);

    useEffect(() => {
        const hoy = new Date();
        const hace30Dias = new Date();
        hace30Dias.setDate(hoy.getDate() - 30);

        setFechaFin(hoy.toISOString().split('T')[0]);
        setFechaInicio(hace30Dias.toISOString().split('T')[0]);
    }, []);

    const handleExportarExcel = async () => {
        setExportando(true);
        try {
            const blob = await reportesService.exportarVentasExcel(fechaInicio, fechaFin);
            downloadBlob(blob, `reporte_ventas_${new Date().toISOString().split('T')[0]}.xlsx`);
            alert('Reporte exportado exitosamente');
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar el reporte');
        }
        setExportando(false);
    };

    const handleExportarPdf = async () => {
        setExportando(true);
        try {
            const blob = await reportesService.exportarVentasPdf(fechaInicio, fechaFin);
            downloadBlob(blob, `reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`);
            alert('Reporte exportado exitosamente');
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar el reporte');
        }
        setExportando(false);
    };

    return (
        <Layout>
            <div>
                <div className="welcome-header" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '15px',
                    padding: '30px',
                    marginBottom: '30px',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h1 style={{ marginBottom: '10px', fontSize: '28px' }}>
                                📊 Dashboard de Gestión
                            </h1>
                            <p style={{ opacity: 0.9, marginBottom: 0 }}>
                                Estadísticas y gráficas en tiempo real de tu negocio
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <div>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                                />
                            </div>
                            <div>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                                />
                            </div>
                            <button
                                className="btn btn-light btn-sm"
                                onClick={handleExportarExcel}
                                disabled={exportando}
                            >
                                📊 Exportar Excel
                            </button>
                            <button
                                className="btn btn-light btn-sm"
                                onClick={handleExportarPdf}
                                disabled={exportando}
                            >
                                📄 Exportar PDF
                            </button>
                        </div>
                    </div>
                </div>

                <DashboardEstadisticas />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <HighchartsVentas tipo="diario" titulo="Ventas - Últimos 7 Días" />
                    <HighchartsVentas tipo="producto" titulo="Ventas por Producto" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <HighchartsVentas tipo="metodoPago" titulo="Ventas por Método de Pago" />
                    <HighchartsVentas tipo="mensual" titulo="Ventas - Últimos 6 Meses" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <HighchartsInventario />
                    <HighchartsVentas tipo="diario" titulo="Top Productos" />
                </div>
            </div>
        </Layout>
    );
};

export default NuevoDashboardPage;