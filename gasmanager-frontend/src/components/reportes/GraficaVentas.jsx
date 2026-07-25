import React, { useState, useEffect } from 'react';
import { reportesService } from '../../api/reportes/auth';

const GraficaVentas = ({ tipo = 'diario', titulo }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, [tipo]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            // Aquí se cargarán los datos para la gráfica
            // Próximamente con Highcharts
            console.log('Cargando gráfica tipo:', tipo);
        } catch (error) {
            console.error('Error al cargar gráfica:', error);
        }
        setLoading(false);
    };

    return (
        <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
                <h5 className="m-0">{titulo || 'Gráfica de Ventas'}</h5>
            </div>
            <div className="card-body">
                {loading ? (
                    <div className="text-center py-5">Cargando datos...</div>
                ) : (
                    <div className="text-center py-5 text-muted">
                        📊 Gráfica próximamente disponible con Highcharts
                    </div>
                )}
            </div>
        </div>
    );
};

export default GraficaVentas;