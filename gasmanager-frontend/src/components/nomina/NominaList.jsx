import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nominasService } from '../../api/nomina/auth';
import { useAuth } from '../../contexts/AuthContext';

const NominaList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [nominas, setNominas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState('');

    useEffect(() => {
        cargarNominas();
    }, [estadoFiltro]);

    const cargarNominas = async () => {
        setLoading(true);
        try {
            let data;
            if (estadoFiltro) {
                data = await nominasService.listarPorEstado(estadoFiltro);
            } else {
                data = await nominasService.listar();
            }
            setNominas(data);
        } catch (error) {
            console.error('Error al cargar nóminas:', error);
        }
        setLoading(false);
    };

    const handleMarcarPagada = async (id, folio) => {
        if (window.confirm(`¿Marcar como pagada la nómina ${folio}?`)) {
            try {
                await nominasService.marcarPagada(id);
                alert('Nómina marcada como pagada exitosamente');
                cargarNominas();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al marcar nómina como pagada');
            }
        }
    };

    const handleCancelar = async (id, folio) => {
        const motivo = prompt('Motivo de cancelación:');
        if (motivo === null) return;

        if (window.confirm(`¿Estás seguro de cancelar la nómina ${folio}?`)) {
            try {
                await nominasService.cancelar(id, motivo);
                alert('Nómina cancelada exitosamente');
                cargarNominas();
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
        return <div className="card">Cargando nóminas...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Historial de Nóminas</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/nominas/procesar')}>
                        + Procesar Nómina
                    </button>
                )}
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={estadoFiltro}
                                onChange={(e) => setEstadoFiltro(e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                <option value="PROCESADA">Procesadas</option>
                                <option value="PAGADA">Pagadas</option>
                                <option value="CANCELADA">Canceladas</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-secondary w-100" onClick={cargarNominas}>
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Folio</th>
                            <th>Periodo</th>
                            <th>Fecha Pago</th>
                            <th>Empleados</th>
                            <th>Total Sueldos</th>
                            <th>Total Deducciones</th>
                            <th>Total Neto</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {nominas.map(nomina => (
                            <tr key={nomina.id}>
                                <td>{nomina.id}</td>
                                <td><code>{nomina.folioNomina}</code></td>
                                <td>
                                    {formatDate(nomina.periodoInicio)}<br/>
                                    <small>→</small><br/>
                                    {formatDate(nomina.periodoFin)}
                                </td>
                                <td>{formatDate(nomina.fechaPago)}</td>
                                <td>{nomina.totalEmpleados}</td>
                                <td className="text-end">{formatMonto(nomina.totalSueldos)}</td>
                                <td className="text-end text-danger">{formatMonto(nomina.totalDeducciones)}</td>
                                <td className="text-end text-success fw-bold">{formatMonto(nomina.totalNeto)}</td>
                                <td>{getEstadoBadge(nomina.estado)}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-1"
                                        onClick={() => navigate(`/nominas/${nomina.id}`)}
                                    >
                                        Ver Detalle
                                    </button>
                                    {nomina.estado === 'PROCESADA' && (
                                        <button
                                            className="btn btn-success btn-sm me-1"
                                            onClick={() => handleMarcarPagada(nomina.id, nomina.folioNomina)}
                                        >
                                            Marcar Pagada
                                        </button>
                                    )}
                                    {nomina.estado !== 'CANCELADA' && nomina.estado !== 'PAGADA' && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleCancelar(nomina.id, nomina.folioNomina)}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {nominas.length === 0 && (
                            <tr>
                                <td colSpan="10" className="text-center">
                                    No hay nóminas procesadas
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NominaList;