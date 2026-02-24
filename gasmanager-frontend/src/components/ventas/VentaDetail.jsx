// src/components/ventas/VentaDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const VentaDetail = () => {
    const { id } = useParams();

    return (
        <div className="container mt-5">
            <h1>Detalle de Venta #{id}</h1>
            <p>Componente en desarrollo...</p>
            <div className="alert alert-success">
                <strong>Nota:</strong> Mostrará todos los detalles de una venta específica
            </div>
        </div>
    );
};

export default VentaDetail;