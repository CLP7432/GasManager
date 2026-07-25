import React, { useState, useEffect } from 'react';
import { reportesService, downloadBlob } from '../../api/reportes/auth';

const ReporteNomina = () => {
    const [nominas, setNominas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportando, setExportando] = useState(false);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        const hoy = new Date();
        const hace90Dias = new Date();
        hace90Dias.setDate(hoy.getDate() - 90);
        setFechaFin(hoy.toISOString().split('T')[0]);
        setFechaInicio(hace90Dias.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        if (fechaInicio && fechaFin) {
            cargarNominas();
        }
    }, [fechaInicio, fechaFin]);

    const cargarNominas = async () => {
        setLoading(true);
        try {
            const inicio = fechaInicio ? new Date(fechaInicio).toISOString() : '';
            const fin = fechaFin ? new Date(fechaFin).toISOString() : '';
            const data = await reportesService.getReporteNomina(inicio, fin);
            setNominas(data);
        } catch (error) {
            console.error('Error al cargar nóminas:', error);
        }
        setLoading(false);
    };

    const handleExportarExcel = async () => {
        setExportando(true);
        try {
            const inicio = fechaInicio ? new Date(fechaInicio).toISOString() : '';
            const fin = fechaFin ? new Date(fechaFin).toISOString() : '';
            const blob = await reportesService.exportarNominaExcel(inicio, fin);
            downloadBlob(blob, `reporte_nomina_${new Date().toISOString().split('T')[0]}.xlsx`);
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
            const blob = await reportesService.exportarNominaPdf(inicio, fin);
            downloadBlob(blob, `reporte_nomina_${new Date().toISOString().split('T')[0]}.pdf`);
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

    if (loading) {
        return <div className="card">Cargando nóminas...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Reporte de Nómina</h2>
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
                            <label className="form-label small">Periodo Inicio</label>
                            <input type="date" className="form-control" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Periodo Fin</label>
                            <input type="date" className="form-control" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn btn-primary" onClick={cargarNominas}>Buscar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Empleado</th>
                            <th>Período</th>
                            <th>Sueldo Base</th>
                            <th>Horas Extras</th>
                            <th>Bonos</th>
                            <th>Faltas</th>
                            <th>ISR</th>
                            <th>Deducciones</th>
                            <th>Neto a Pagar</th>
                        </tr>
                        </thead>
                        <tbody>
                        {nominas.map(nomina => (
                            <tr key={nomina.id}>
                                <td>
                                    <strong>{nomina.empleadoNombre}</strong><br />
                                    <small className="text-muted">{nomina.empleadoCodigo}</small>
                                </td>
                                <td>
                                    {formatDate(nomina.periodoInicio)}<br />
                                    <small>al {formatDate(nomina.periodoFin)}</small>
                                </td>
                                <td className="text-end">{formatMonto(nomina.sueldoBase)}</td>
                                <td className="text-end">{formatMonto(nomina.horasExtrasMonto)}</td>
                                <td className="text-end text-success">{formatMonto(nomina.bonos)}</td>
                                <td className="text-end text-danger">{formatMonto(nomina.faltasDescuento)}</td>
                                <td className="text-end">{formatMonto(nomina.isr)}</td>
                                <td className="text-end">{formatMonto(nomina.totalDeducciones)}</td>
                                <td className="text-end fw-bold text-success">{formatMonto(nomina.netoPagar)}</td>
                            </tr>
                        ))}
                        {nominas.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center">No hay registros de nómina en el período seleccionado</td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot>
                        <tr className="table-light">
                            <td colSpan="2" className="text-end fw-bold">Totales Generales:</td>
                            <td className="text-end fw-bold">{formatMonto(nominas.reduce((sum, n) => sum + n.sueldoBase, 0))}</td>
                            <td className="text-end fw-bold">{formatMonto(nominas.reduce((sum, n) => sum + n.horasExtrasMonto, 0))}</td>
                            <td className="text-end fw-bold">{formatMonto(nominas.reduce((sum, n) => sum + n.bonos, 0))}</td>
                            <td className="text-end fw-bold">{formatMonto(nominas.reduce((sum, n) => sum + n.faltasDescuento, 0))}</td>
                            <td className="text-end fw-bold">{formatMonto(nominas.reduce((sum, n) => sum + n.isr, 0))}</td>
                            <td className="text-end fw-bold">{formatMonto(nominas.reduce((sum, n) => sum + n.totalDeducciones, 0))}</td>
                            <td className="text-end fw-bold text-success">{formatMonto(nominas.reduce((sum, n) => sum + n.netoPagar, 0))}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReporteNomina;