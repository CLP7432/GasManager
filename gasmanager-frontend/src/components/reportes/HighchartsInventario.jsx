import React, { useEffect, useRef } from 'react';
import { reportesService } from '../../api/reportes/auth';

const HighchartsInventario = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        cargarInventario();
    }, []);

    const cargarInventario = async () => {
        try {
            const datos = await reportesService.getInventarioCombustible();

            if (!datos || datos.length === 0) {
                mostrarSinDatos();
                return;
            }

            const categories = datos.map(item => item.label);
            const values = datos.map(item => item.value);

            const chartOptions = {
                chart: { type: 'bar' },
                title: { text: 'Nivel de Inventario - Combustibles' },
                subtitle: { text: 'Porcentaje de ocupación de tanques' },
                xAxis: { categories: categories, title: { text: 'Tipo de Combustible' } },
                yAxis: { title: { text: 'Porcentaje (%)' }, max: 100 },
                series: [{
                    name: 'Ocupación',
                    data: values,
                    dataLabels: { enabled: true, format: '{point.y}%' },
                    color: '#28a745'
                }],
                tooltip: { pointFormat: '<b>{point.y}%</b>' },
                plotOptions: {
                    bar: {
                        dataLabels: { enabled: true },
                        colorByPoint: true,
                        colors: ['#28a745', '#17a2b8', '#ffc107']
                    }
                }
            };

            if (chartRef.current) {
                Highcharts.chart(chartRef.current, chartOptions);
            }
        } catch (error) {
            console.error('Error cargando inventario:', error);
            mostrarSinDatos();
        }
    };

    const mostrarSinDatos = () => {
        if (chartRef.current) {
            Highcharts.chart(chartRef.current, {
                title: { text: 'Sin datos disponibles' },
                subtitle: { text: 'No hay información de inventario' },
                series: []
            });
        }
    };

    return (
        <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
                <h5 className="m-0">Nivel de Inventario - Combustibles</h5>
            </div>
            <div className="card-body">
                <div ref={chartRef} style={{ height: '350px', width: '100%' }}></div>
            </div>
        </div>
    );
};

export default HighchartsInventario;