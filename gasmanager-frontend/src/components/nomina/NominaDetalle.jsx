import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { nominasService } from '../../api/nomina/auth';
import { useAuth } from '../../contexts/AuthContext';

const NominaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [nomina, setNomina] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarNomina();
    }, [id]);

    const cargarNomina = async () => {
        setLoading(true);
        try {
            const data = await nominasService.obtenerPorId(id);
            setNomina(data);
        } catch (error) {
            console.error('Error al cargar nómina:', error);
            alert('Error al cargar nómina');
        }
        setLoading(false);
    };

    const handleMarcarPagada = async () => {
        if (window.confirm(`¿Marcar como pagada la nómina ${nomina.folioNomina}?`)) {
            try {
                await nominasService.marcarPagada(id);
                alert('Nómina marcada como pagada exitosamente');
                cargarNomina();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al marcar nómina como pagada');
            }
        }
    };

    const handleCancelar = async () => {
        const motivo = prompt('Motivo de cancelación:');
        if (motivo === null) return;

        if (window.confirm(`¿Estás seguro de cancelar la nómina ${nomina.folioNomina}?`)) {
            try {
                await nominasService.cancelar(id, motivo);
                alert('Nómina cancelada exitosamente');
                cargarNomina();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al cancelar nómina');
            }
        }
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            PROCESADA: 'bg-warning text-dark',
            PAGADA: 'bg-success',
            CANCELADA: 'bg-danger'
        };
        return <span className={`badge ${colores[estado] || 'bg-secondary'}`}>{estado}</span>;
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX');
    };

    if (loading) {
        return <div className="card">Cargando detalle de nómina...</div>;
    }

    if (!nomina) {
        return <div className="card">Nómina no encontrada</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/nominas')}>
                    ← Volver a Nóminas
                </button>
                <h2 className="m-0">Detalle de Nómina</h2>
                <div style={{ width: '100px' }}></div>
            </div>

            {/* Información general */}
            <div className="card mb-4">
                <div className="card-header bg-dark text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <span><strong>Folio:</strong> {nomina.folioNomina}</span>
                        {getEstadoBadge(nomina.estado)}
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Periodo</h5>
                            <p>
                                <strong>Inicio:</strong> {formatDate(nomina.periodoInicio)}<br />
                                <strong>Fin:</strong> {formatDate(nomina.periodoFin)}<br />
                                <strong>Fecha de Pago:</strong> {formatDate(nomina.fechaPago)}<br />
                                <strong>Fecha de Procesamiento:</strong> {new Date(nomina.fechaProcesamiento).toLocaleString()}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <h5>Resumen</h5>
                            <p>
                                <strong>Total Empleados:</strong> {nomina.totalEmpleados}<br />
                                <strong>Total Sueldos:</strong> {formatMonto(nomina.totalSueldos)}<br />
                                <strong>Total Horas Extras:</strong> {formatMonto(nomina.totalHorasExtras)}<br />
                                <strong>Total Bonos:</strong> {formatMonto(nomina.totalBonos)}
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Total Gravado</small>
                                <h4 className="text-primary">{formatMonto(nomina.totalSueldos + nomina.totalHorasExtras + nomina.totalBonos)}</h4>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Total Deducciones</small>
                                <h4 className="text-danger">{formatMonto(nomina.totalDeducciones)}</h4>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <small className="text-muted">Total Neto a Pagar</small>
                                <h4 className="text-success">{formatMonto(nomina.totalNeto)}</h4>
                            </div>
                        </div>
                    </div>
                    {nomina.observaciones && (
                        <>
                            <hr />
                            <p><strong>Observaciones:</strong> {nomina.observaciones}</p>
                        </>
                    )}
                </div>
                {nomina.estado === 'PROCESADA' && (
                    <div className="card-footer">
                        <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={handleMarcarPagada}>
                                Marcar como Pagada
                            </button>
                            <button className="btn btn-danger" onClick={handleCancelar}>
                                Cancelar Nómina
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detalle por empleado */}
            <div className="card">
                <div className="card-header">
                    <h5 className="m-0">Detalle por Empleado</h5>
                </div>
                <div className="card-body">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Código</th>
                                <th>Días</th>
                                <th>Sueldo Base</th>
                                <th>Horas Extras</th>
                                <th>Bonos</th>
                                <th>Faltas</th>
                                <th>Total Gravado</th>
                                <th>ISR</th>
                                <th>Deducciones</th>
                                <th>Neto a Pagar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {nomina.detalles?.map((detalle, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <strong>{detalle.empleadoNombre}</strong><br/>
                                        <small className="text-muted">{detalle.empleadoCodigo}</small>
                                    </td>
                                    <td>{detalle.empleadoCodigo}</td>
                                    <td className="text-end">{detalle.diasTrabajados}</td>
                                    <td className="text-end">{formatMonto(detalle.sueldoBase)}</td>
                                    <td className="text-end">{formatMonto(detalle.horasExtrasMonto)}</td>
                                    <td className="text-end text-success">{formatMonto(detalle.bonos)}</td>
                                    <td className="text-end text-danger">{formatMonto(detalle.faltasDescuento)}</td>
                                    <td className="text-end fw-bold">{formatMonto(detalle.totalGravado)}</td>
                                    <td className="text-end text-danger">{formatMonto(detalle.isr)}</td>
                                    <td className="text-end text-danger">{formatMonto(detalle.totalDeducciones)}</td>
                                    <td className="text-end text-success fw-bold">{formatMonto(detalle.netoPagar)}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr className="table-light">
                                <td colSpan="7" className="text-end fw-bold">Totales:</td>
                                <td className="text-end fw-bold">{formatMonto(nomina.totalSueldos + nomina.totalHorasExtras + nomina.totalBonos)}</td>
                                <td className="text-end fw-bold text-danger">{formatMonto(nomina.totalImpuestos)}</td>
                                <td className="text-end fw-bold text-danger">{formatMonto(nomina.totalDeducciones)}</td>
                                <td className="text-end fw-bold text-success">{formatMonto(nomina.totalNeto)}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NominaDetalle;