import React, { useState, useEffect } from 'react';
import { reportesService } from '../../api/reportes/auth';

const GraficaTopProductos = ({ limite = 5 }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, [limite]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await reportesService.getTopProductos(limite);
            console.log('Top productos:', data);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    return (
        <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
                <h5 className="m-0">Top {limite} Productos Más Vendidos</h5>
            </div>
            <div className="card-body">
                {loading ? (
                    <div className="text-center py-5">Cargando datos...</div>
                ) : (
                    <div className="text-center py-5 text-muted">
                        🏆 Gráfica de top productos próximamente disponible
                    </div>
                )}
            </div>
        </div>
    );
};

export default GraficaTopProductos;