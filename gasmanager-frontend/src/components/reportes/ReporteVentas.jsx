import React, { useState, useEffect } from 'react';
import { reportesService, downloadBlob } from '../../api/reportes/auth';

const ReporteVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportando, setExportando] = useState(false);
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        estado: '',
        metodoPago: ''
    });

    useEffect(() => {
        const hoy = new Date();
        const hace30Dias = new Date();
        hace30Dias.setDate(hoy.getDate() - 30);

        // Formato: yyyy-MM-dd (que es lo que espera el backend)
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };

        setFiltros({
            fechaInicio: formatDate(hace30Dias),
            fechaFin: formatDate(hoy),
            estado: '',
            metodoPago: ''
        });
    }, []);

    useEffect(() => {
        if (filtros.fechaInicio && filtros.fechaFin) {
            cargarVentas();
        }
    }, [filtros]);

    const cargarVentas = async () => {
        setLoading(true);
        try {
            const data = await reportesService.getReporteVentas(filtros);
            setVentas(data);
        } catch (error) {
            console.error('Error al cargar ventas:', error);
        }
        setLoading(false);
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleExportarExcel = async () => {
        setExportando(true);
        try {
            // Enviar solo la fecha en formato yyyy-MM-dd (sin hora)
            const inicio = filtros.fechaInicio || '';
            const fin = filtros.fechaFin || '';

            console.log('Exportando Excel - Fechas:', { inicio, fin });

            const blob = await reportesService.exportarVentasExcel(inicio, fin);
            downloadBlob(blob, `reporte_ventas_${new Date().toISOString().split('T')[0]}.xlsx`);
            alert('Reporte exportado exitosamente');
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar el reporte: ' + (error.response?.data?.message || error.message));
        }
        setExportando(false);
    };

    const handleExportarPdf = async () => {
        setExportando(true);
        try {
            const inicio = filtros.fechaInicio || '';
            const fin = filtros.fechaFin || '';

            console.log('Exportando PDF - Fechas:', { inicio, fin });

            const blob = await reportesService.exportarVentasPdf(inicio, fin);
            downloadBlob(blob, `reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`);
            alert('Reporte exportado exitosamente');
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar el reporte: ' + (error.response?.data?.message || error.message));
        }
        setExportando(false);
    };

    const formatMonto = (monto) => {
        if (!monto && monto !== 0) return '$0.00';
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX');
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            COMPLETADA: 'bg-success',
            PENDIENTE: 'bg-warning text-dark',
            CANCELADA: 'bg-danger',
            FACTURADA: 'bg-info'
        };
        return <span className={`badge ${colores[estado] || 'bg-secondary'}`}>{estado}</span>;
    };

    if (loading) {
        return <div className="card">Cargando ventas...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Reporte de Ventas</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={handleExportarExcel} disabled={exportando}>
                        {exportando ? 'Exportando...' : '📊 Exportar Excel'}
                    </button>
                    <button className="btn btn-danger" onClick={handleExportarPdf} disabled={exportando}>
                        {exportando ? 'Exportando...' : '📄 Exportar PDF'}
                    </button>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-3">
                            <label className="form-label small">Fecha Inicio</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaInicio"
                                value={filtros.fechaInicio}
                                onChange={handleFiltroChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Fecha Fin</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaFin"
                                value={filtros.fechaFin}
                                onChange={handleFiltroChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small">Estado</label>
                            <select className="form-select" name="estado" value={filtros.estado} onChange={handleFiltroChange}>
                                <option value="">Todos</option>
                                <option value="COMPLETADA">Completadas</option>
                                <option value="PENDIENTE">Pendientes</option>
                                <option value="CANCELADA">Canceladas</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small">Método Pago</label>
                            <select className="form-select" name="metodoPago" value={filtros.metodoPago} onChange={handleFiltroChange}>
                                <option value="">Todos</option>
                                <option value="EFECTIVO">Efectivo</option>
                                <option value="TARJETA_CREDITO">Tarjeta</option>
                                <option value="TRANSFERENCIA">Transferencia</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn btn-primary w-100" onClick={cargarVentas}>
                                Buscar
                            </button>
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
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Método</th>
                            <th>Subtotal</th>
                            <th>IVA</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Turno</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ventas.map(venta => (
                            <tr key={venta.id}>
                                <td><code>{venta.folio}</code></td>
                                <td>{formatDate(venta.fechaHora)}</td>
                                <td>{venta.clienteNombre || 'Mostrador'}</td>
                                <td>{venta.metodoPago}</td>
                                <td className="text-end">{formatMonto(venta.subtotal)}</td>
                                <td className="text-end">{formatMonto(venta.iva)}</td>
                                <td className="text-end fw-bold">{formatMonto(venta.total)}</td>
                                <td>{getEstadoBadge(venta.estado)}</td>
                                <td>{venta.turnoNombre || '-'}</td>
                            </tr>
                        ))}
                        {ventas.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center">No hay ventas en el período seleccionado</td>
                            </tr>
                        )}
                        </tbody>
                        {ventas.length > 0 && (
                            <tfoot>
                            <tr className="table-light">
                                <td colSpan="6" className="text-end fw-bold">Total General:</td>
                                <td className="text-end fw-bold text-success">
                                    {formatMonto(ventas.reduce((sum, v) => sum + (v.total || 0), 0))}
                                </td>
                                <td colSpan="2"></td>
                            </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReporteVentas;