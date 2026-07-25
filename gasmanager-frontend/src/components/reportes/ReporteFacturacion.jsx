import React, { useState, useEffect } from 'react';
import { reportesService, downloadBlob } from '../../api/reportes/auth';

const ReporteFacturacion = () => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportando, setExportando] = useState(false);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        const hoy = new Date();
        const hace30Dias = new Date();
        hace30Dias.setDate(hoy.getDate() - 30);
        setFechaFin(hoy.toISOString().split('T')[0]);
        setFechaInicio(hace30Dias.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        if (fechaInicio && fechaFin) {
            cargarFacturas();
        }
    }, [fechaInicio, fechaFin]);

    const cargarFacturas = async () => {
        setLoading(true);
        try {
            const inicio = fechaInicio ? new Date(fechaInicio).toISOString() : '';
            const fin = fechaFin ? new Date(fechaFin).toISOString() : '';
            const data = await reportesService.getReporteFacturacion(inicio, fin);
            setFacturas(data);
        } catch (error) {
            console.error('Error al cargar facturas:', error);
        }
        setLoading(false);
    };

    const handleExportarExcel = async () => {
        setExportando(true);
        try {
            const inicio = fechaInicio ? new Date(fechaInicio).toISOString() : '';
            const fin = fechaFin ? new Date(fechaFin).toISOString() : '';
            const blob = await reportesService.exportarFacturacionExcel(inicio, fin);
            downloadBlob(blob, `reporte_facturacion_${new Date().toISOString().split('T')[0]}.xlsx`);
            alert('Reporte exportado exitosamente');
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar a Excel');
        }
        setExportando(false);
    };

    const handleExportarPdf = async () => {
        setExportando(true);
        try {
            const inicio = fechaInicio ? new Date(fechaInicio).toISOString() : '';
            const fin = fechaFin ? new Date(fechaFin).toISOString() : '';
            const blob = await reportesService.exportarFacturacionPdf(inicio, fin);
            downloadBlob(blob, `reporte_facturacion_${new Date().toISOString().split('T')[0]}.pdf`);
            alert('Reporte exportado exitosamente');
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar a PDF');
        }
        setExportando(false);
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX');
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            EMITIDA: 'bg-success',
            CANCELADA: 'bg-danger',
            PENDIENTE_TIMBRADO: 'bg-warning text-dark',
            ERROR_TIMBRADO: 'bg-danger'
        };
        return <span className={`badge ${colores[estado] || 'bg-secondary'}`}>{estado}</span>;
    };

    if (loading) {
        return <div className="card">Cargando facturas...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Reporte de Facturación</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={handleExportarExcel} disabled={exportando}>
                        📊 Exportar Excel
                    </button>
                    <button className="btn btn-danger" onClick={handleExportarPdf} disabled={exportando}>
                        📄 Exportar PDF
                    </button>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-3">
                            <label className="form-label small">Fecha Inicio</label>
                            <input type="date" className="form-control" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Fecha Fin</label>
                            <input type="date" className="form-control" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn btn-primary" onClick={cargarFacturas}>Buscar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Folio</th>
                            <th>UUID</th>
                            <th>Cliente</th>
                            <th>RFC</th>
                            <th>Fecha Emisión</th>
                            <th>Subtotal</th>
                            <th>IVA</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                        </thead>
                        <tbody>
                        {facturas.map(factura => (
                            <tr key={factura.id}>
                                <td><code>{factura.folioFactura}</code></td>
                                <td><small>{factura.uuidCfdi || '-'}</small></td>
                                <td><strong>{factura.clienteNombre}</strong></td>
                                <td>{factura.clienteRfc}</td>
                                <td>{formatDate(factura.fechaEmision)}</td>
                                <td className="text-end">{formatMonto(factura.subtotal)}</td>
                                <td className="text-end">{formatMonto(factura.iva)}</td>
                                <td className="text-end fw-bold">{formatMonto(factura.total)}</td>
                                <td>{getEstadoBadge(factura.estado)}</td>
                            </tr>
                        ))}
                        {facturas.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center">No hay facturas en el período seleccionado</td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot>
                        <tr className="table-light">
                            <td colSpan="5" className="text-end fw-bold">Totales:</td>
                            <td className="text-end fw-bold">{formatMonto(facturas.reduce((sum, f) => sum + f.subtotal, 0))}</td>
                            <td className="text-end fw-bold">{formatMonto(facturas.reduce((sum, f) => sum + f.iva, 0))}</td>
                            <td className="text-end fw-bold text-success">{formatMonto(facturas.reduce((sum, f) => sum + f.total, 0))}</td>
                            <td></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReporteFacturacion;