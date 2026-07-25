import React, { useState, useEffect } from 'react';
import { reportesService, downloadBlob } from '../../api/reportes/auth';

const ReporteLealtad = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportando, setExportando] = useState(false);

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        setLoading(true);
        try {
            const data = await reportesService.getReporteLealtad();
            setClientes(data);
        } catch (error) {
            console.error('Error al cargar reporte de lealtad:', error);
        }
        setLoading(false);
    };

    const handleExportarExcel = async () => {
        setExportando(true);
        try {
            const blob = await reportesService.exportarLealtadExcel();
            downloadBlob(blob, `reporte_lealtad_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar a Excel');
        }
        setExportando(false);
    };

    const handleExportarPdf = async () => {
        setExportando(true);
        try {
            const blob = await reportesService.exportarLealtadPdf();
            downloadBlob(blob, `reporte_lealtad_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar a PDF');
        }
        setExportando(false);
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    if (loading) {
        return <div className="card">Cargando datos de clientes...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Reporte de Programa de Lealtad</h2>
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
                            <th>ID Cliente</th>
                            <th>Cliente</th>
                            <th>RFC</th>
                            <th>Compras</th>
                            <th>Total Gastado</th>
                            <th>Puntos Acumulados</th>
                            <th>Puntos Canjeados</th>
                            <th>Puntos Disponibles</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.clienteId}>
                                <td>{cliente.clienteId}</td>
                                <td><strong>{cliente.clienteNombre}</strong></td>
                                <td>{cliente.clienteRfc || '-'}</td>
                                <td className="text-end">{cliente.numeroCompras || 0}</td>
                                <td className="text-end">{formatMonto(cliente.totalCompras)}</td>
                                <td className="text-end fw-bold text-primary">{cliente.puntosAcumulados || 0}</td>
                                <td className="text-end">{cliente.puntosCanjeados || 0}</td>
                                <td className="text-end fw-bold text-success">{cliente.puntosDisponibles || 0}</td>
                            </tr>
                        ))}
                        {clientes.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center">No hay datos de clientes con lealtad</td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot>
                        <tr className="table-light">
                            <td colSpan="4" className="text-end fw-bold">Resumen General:</td>
                            <td className="text-end fw-bold">{formatMonto(clientes.reduce((sum, c) => sum + c.totalCompras, 0))}</td>
                            <td className="text-end fw-bold text-primary">{clientes.reduce((sum, c) => sum + (c.puntosAcumulados || 0), 0)}</td>
                            <td className="text-end">{clientes.reduce((sum, c) => sum + (c.puntosCanjeados || 0), 0)}</td>
                            <td className="text-end fw-bold text-success">{clientes.reduce((sum, c) => sum + (c.puntosDisponibles || 0), 0)}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReporteLealtad;