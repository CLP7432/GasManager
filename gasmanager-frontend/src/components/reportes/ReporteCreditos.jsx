import React, { useState, useEffect } from 'react';
import { reportesService, downloadBlob } from '../../api/reportes/auth';

const ReporteCreditos = () => {
    const [creditos, setCreditos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [exportando, setExportando] = useState(false);

    useEffect(() => {
        cargarCreditos();
    }, [estadoFiltro]);

    const cargarCreditos = async () => {
        setLoading(true);
        try {
            const data = await reportesService.getReporteCreditos(estadoFiltro);
            setCreditos(data);
        } catch (error) {
            console.error('Error al cargar créditos:', error);
        }
        setLoading(false);
    };

    const handleExportarExcel = async () => {
        setExportando(true);
        try {
            const blob = await reportesService.exportarCreditosExcel();
            downloadBlob(blob, `reporte_creditos_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar a Excel');
        }
        setExportando(false);
    };

    const handleExportarPdf = async () => {
        setExportando(true);
        try {
            const blob = await reportesService.exportarCreditosPdf();
            downloadBlob(blob, `reporte_creditos_${new Date().toISOString().split('T')[0]}.pdf`);
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
            ACTIVO: 'bg-success',
            PAGADO: 'bg-info',
            VENCIDO: 'bg-danger',
            CANCELADO: 'bg-secondary',
            EN_COBRANZA: 'bg-warning text-dark'
        };
        return <span className={`badge ${colores[estado] || 'bg-secondary'}`}>{estado}</span>;
    };

    if (loading) {
        return <div className="card">Cargando créditos...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Reporte de Créditos</h2>
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
                            <label className="form-label small">Filtrar por Estado</label>
                            <select className="form-select" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                                <option value="">Todos</option>
                                <option value="ACTIVO">Activos</option>
                                <option value="PAGADO">Pagados</option>
                                <option value="VENCIDO">Vencidos</option>
                                <option value="CANCELADO">Cancelados</option>
                                <option value="EN_COBRANZA">En Cobranza</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn btn-primary" onClick={cargarCreditos}>Buscar</button>
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
                            <th>Cliente</th>
                            <th>RFC</th>
                            <th>Monto Total</th>
                            <th>Pagado</th>
                            <th>Saldo</th>
                            <th>Fecha Inicio</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                        </tr>
                        </thead>
                        <tbody>
                        {creditos.map(credito => (
                            <tr key={credito.id}>
                                <td><code>{credito.folioCredito}</code></td>
                                <td><strong>{credito.clienteNombre}</strong></td>
                                <td>{credito.clienteRfc || '-'}</td>
                                <td className="text-end">{formatMonto(credito.montoTotal)}</td>
                                <td className="text-end text-success">{formatMonto(credito.montoPagado)}</td>
                                <td className="text-end fw-bold text-danger">{formatMonto(credito.saldoPendiente)}</td>
                                <td className="text-center">{formatDate(credito.fechaInicio)}</td>
                                <td className="text-center">{formatDate(credito.fechaVencimiento)}</td>
                                <td>{getEstadoBadge(credito.estado)}</td>
                            </tr>
                        ))}
                        {creditos.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center">No hay créditos registrados</td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot>
                        <tr className="table-light">
                            <td colSpan="3" className="text-end fw-bold">Totales:</td>
                            <td className="text-end fw-bold">{formatMonto(creditos.reduce((sum, c) => sum + c.montoTotal, 0))}</td>
                            <td className="text-end fw-bold">{formatMonto(creditos.reduce((sum, c) => sum + c.montoPagado, 0))}</td>
                            <td className="text-end fw-bold text-danger">{formatMonto(creditos.reduce((sum, c) => sum + c.saldoPendiente, 0))}</td>
                            <td colSpan="3"></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReporteCreditos;