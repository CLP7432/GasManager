import React, { useEffect, useRef } from 'react';
import { reportesService } from '../../api/reportes/auth';

const HighchartsVentas = ({ tipo = 'diario', titulo }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        cargarGrafica();
    }, [tipo]);

    const cargarGrafica = async () => {
        try {
            let datos = [];
            let tituloGrafica = '';
            let tipoGrafica = 'column';

            if (tipo === 'diario') {
                datos = await reportesService.getVentasPorDia(7);
                tituloGrafica = 'Ventas por Día (Últimos 7 días)';
                tipoGrafica = 'column';
            } else if (tipo === 'mensual') {
                datos = await reportesService.getVentasPorMes(6);
                tituloGrafica = 'Ventas por Mes';
                tipoGrafica = 'line';
            } else if (tipo === 'producto') {
                datos = await reportesService.getVentasPorProducto();
                tituloGrafica = 'Ventas por Producto';
                tipoGrafica = 'pie';
            } else if (tipo === 'metodoPago') {
                datos = await reportesService.getVentasPorMetodoPago();
                tituloGrafica = 'Ventas por Método de Pago';
                tipoGrafica = 'pie';
            }

            if (!datos || datos.length === 0) {
                mostrarSinDatos();
                return;
            }

            const categories = datos.map(item => item.label);
            const values = datos.map(item => item.value);

            let chartOptions = {};

            if (tipoGrafica === 'pie') {
                chartOptions = {
                    chart: { type: 'pie' },
                    title: { text: tituloGrafica },
                    series: [{
                        name: 'Monto',
                        data: datos.map(item => ({ name: item.label, y: item.value })),
                        dataLabels: { enabled: true, format: '{point.name}: ${point.y:,.2f}' }
                    }],
                    tooltip: { pointFormat: '{point.name}: <b>${point.y:,.2f}</b>' }
                };
            } else if (tipoGrafica === 'line') {
                chartOptions = {
                    chart: { type: 'line' },
                    title: { text: tituloGrafica },
                    xAxis: { categories: categories },
                    yAxis: { title: { text: 'Monto (MXN)' } },
                    series: [{
                        name: 'Ventas',
                        data: values,
                        color: '#667eea'
                    }],
                    tooltip: { valuePrefix: '$' }
                };
            } else {
                chartOptions = {
                    chart: { type: 'column' },
                    title: { text: tituloGrafica },
                    xAxis: { categories: categories },
                    yAxis: { title: { text: 'Monto (MXN)' } },
                    series: [{
                        name: 'Ventas',
                        data: values,
                        color: '#28a745'
                    }],
                    tooltip: { valuePrefix: '$' }
                };
            }

            if (chartRef.current) {
                Highcharts.chart(chartRef.current, chartOptions);
            }
        } catch (error) {
            console.error('Error cargando gráfica:', error);
            mostrarSinDatos();
        }
    };

    const mostrarSinDatos = () => {
        if (chartRef.current) {
            Highcharts.chart(chartRef.current, {
                title: { text: 'Sin datos disponibles' },
                subtitle: { text: 'No hay información para mostrar' },
                series: []
            });
        }
    };

    return (
        <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
                <h5 className="m-0">{titulo || 'Gráfica de Ventas'}</h5>
            </div>
            <div className="card-body">
                <div ref={chartRef} style={{ height: '350px', width: '100%' }}></div>
            </div>
        </div>
    );
};

export default HighchartsVentas;