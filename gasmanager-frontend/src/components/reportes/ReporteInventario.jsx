import React, { useState, useEffect } from 'react';
import { reportesService, downloadBlob } from '../../api/reportes/auth';

const ReporteInventario = () => {
    const [inventario, setInventario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportando, setExportando] = useState(false);

    useEffect(() => {
        cargarInventario();
    }, []);

    const cargarInventario = async () => {
        setLoading(true);
        try {
            const data = await reportesService.getReporteInventario();
            setInventario(data);
        } catch (error) {
            console.error('Error al cargar inventario:', error);
        }
        setLoading(false);
    };

    const handleExportarExcel = async () => {
        setExportando(true);
        try {
            const blob = await reportesService.exportarInventarioExcel();
            downloadBlob(blob, `reporte_inventario_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar a Excel');
        }
        setExportando(false);
    };

    const handleExportarPdf = async () => {
        setExportando(true);
        try {
            const blob = await reportesService.exportarInventarioPdf();
            downloadBlob(blob, `reporte_inventario_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar a PDF');
        }
        setExportando(false);
    };

    const formatNumero = (valor) => {
        if (!valor) return '0';
        return valor.toLocaleString();
    };

    const getPorcentajeBadge = (porcentaje) => {
        if (porcentaje >= 80) return <span className="badge bg-success">{porcentaje}%</span>;
        if (porcentaje >= 50) return <span className="badge bg-warning text-dark">{porcentaje}%</span>;
        return <span className="badge bg-danger">{porcentaje}%</span>;
    };

    if (loading) {
        return <div className="card">Cargando inventario...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Reporte de Inventario - Combustibles</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={handleExportarExcel} disabled={exportando}>
                        📊 Exportar Excel
                    </button>
                    <button className="btn btn-danger" onClick={handleExportarPdf} disabled={exportando}>
                        📄 Exportar PDF
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Nombre</th>
                            <th>Stock Actual (L)</th>
                            <th>Capacidad (L)</th>
                            <th>Porcentaje</th>
                            <th>Stock Mínimo</th>
                            <th>Estado</th>
                            <th>Última Lectura</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventario.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.tipoCombustible}</td>
                                <td><strong>{item.nombre}</strong></td>
                                <td className="text-end">{formatNumero(item.stockActual)}</td>
                                <td className="text-end">{formatNumero(item.capacidadTanque)}</td>
                                <td className="text-end">{getPorcentajeBadge(item.porcentajeOcupacion)}</td>
                                <td className="text-end">{formatNumero(item.stockMinimo)}</td>
                                <td>{item.activo ? <span className="badge bg-success">Activo</span> : <span className="badge bg-danger">Inactivo</span>}</td>
                                <td>{item.ultimaLectura ? new Date(item.ultimaLectura).toLocaleString() : '-'}</td>
                            </tr>
                        ))}
                        {inventario.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center">No hay datos de inventario</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReporteInventario;