import React, { useState, useEffect } from 'react';
import { reportesService } from '../../api/reportes/auth';

const GraficaFacturas = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const facturas = await reportesService.getReporteFacturacion();
            console.log('Facturas:', facturas);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    return (
        <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
                <h5 className="m-0">Facturación por Mes</h5>
            </div>
            <div className="card-body">
                {loading ? (
                    <div className="text-center py-5">Cargando datos...</div>
                ) : (
                    <div className="text-center py-5 text-muted">
                        📄 Gráfica de facturación próximamente disponible
                    </div>
                )}
            </div>
        </div>
    );
};

export default GraficaFacturas;