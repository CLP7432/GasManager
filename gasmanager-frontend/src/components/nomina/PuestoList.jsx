import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { puestosService } from '../../api/nomina/auth';
import { useAuth } from '../../contexts/AuthContext';

const PuestoList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [puestos, setPuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        cargarPuestos();
    }, [filtro]);

    const cargarPuestos = async () => {
        setLoading(true);
        try {
            let data;
            if (filtro === 'activos') {
                data = await puestosService.listarActivos();
            } else {
                data = await puestosService.listar();
            }
            setPuestos(data);
        } catch (error) {
            console.error('Error al cargar puestos:', error);
        }
        setLoading(false);
    };

    const handleToggleActivo = async (id, activo, nombre) => {
        const accion = activo ? 'desactivar' : 'activar';
        if (window.confirm(`¿Estás seguro de ${accion} el puesto "${nombre}"?`)) {
            try {
                await puestosService.toggleActivo(id);
                cargarPuestos();
            } catch (error) {
                alert('Error al cambiar estado del puesto');
            }
        }
    };

    const handleEliminar = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de eliminar el puesto "${nombre}"?`)) {
            try {
                await puestosService.eliminar(id);
                cargarPuestos();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al eliminar puesto');
            }
        }
    };

    const getEstadoBadge = (activo) => {
        return activo ?
            <span className="badge bg-success">Activo</span> :
            <span className="badge bg-danger">Inactivo</span>;
    };

    const getRiesgoBadge = (riesgo) => {
        const colores = {
            BAJO: 'badge bg-success',
            MEDIO: 'badge bg-warning text-dark',
            ALTO: 'badge bg-danger'
        };
        return <span className={colores[riesgo] || 'badge bg-secondary'}>{riesgo || 'N/A'}</span>;
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    if (loading) {
        return <div className="card">Cargando puestos...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Puestos</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/puestos/nuevo')}>
                        + Nuevo Puesto
                    </button>
                )}
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="activos">Activos</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-secondary" onClick={cargarPuestos}>
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
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Salario Base</th>
                            <th>Salario Diario</th>
                            <th>Riesgo</th>
                            <th>Estado</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {puestos.map(puesto => (
                            <tr key={puesto.id}>
                                <td>{puesto.id}</td>
                                <td><strong>{puesto.nombre}</strong></td>
                                <td>{puesto.descripcion || '-'}</td>
                                <td>{formatMonto(puesto.salarioBase)}</td>
                                <td>{formatMonto(puesto.salarioDiario)}</td>
                                <td>{getRiesgoBadge(puesto.riesgoPuesto)}</td>
                                <td>{getEstadoBadge(puesto.activo)}</td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-1"
                                            onClick={() => navigate(`/puestos/editar/${puesto.id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={`btn ${puesto.activo ? 'btn-warning' : 'btn-success'} btn-sm me-1`}
                                            onClick={() => handleToggleActivo(puesto.id, puesto.activo, puesto.nombre)}
                                        >
                                            {puesto.activo ? 'Desactivar' : 'Activar'}
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleEliminar(puesto.id, puesto.nombre)}
                                            disabled={!puesto.activo}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {puestos.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 8 : 7} className="text-center">
                                    No hay puestos registrados
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

export default PuestoList;