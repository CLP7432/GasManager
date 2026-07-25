import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { empleadosService } from '../../api/nomina/auth';
import { useAuth } from '../../contexts/AuthContext';

const EmpleadoList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        cargarEmpleados();
    }, [filtro]);

    const cargarEmpleados = async () => {
        setLoading(true);
        try {
            let data;
            if (filtro === 'activos') {
                data = await empleadosService.listarActivos();
            } else {
                data = await empleadosService.listar();
            }
            setEmpleados(data);
        } catch (error) {
            console.error('Error al cargar empleados:', error);
        }
        setLoading(false);
    };

    const handleDesactivar = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de dar de baja a ${nombre}?`)) {
            try {
                await empleadosService.desactivar(id, new Date().toISOString().split('T')[0], 'Baja voluntaria');
                alert('Empleado dado de baja exitosamente');
                cargarEmpleados();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al desactivar empleado');
            }
        }
    };

    const handleReactivar = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de reactivar a ${nombre}?`)) {
            try {
                await empleadosService.reactivar(id);
                alert('Empleado reactivado exitosamente');
                cargarEmpleados();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al reactivar empleado');
            }
        }
    };

    const getEstadoBadge = (activo) => {
        return activo ?
            <span className="badge bg-success">Activo</span> :
            <span className="badge bg-danger">Inactivo</span>;
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    if (loading) {
        return <div className="card">Cargando empleados...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Empleados</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/empleados/nuevo')}>
                        + Nuevo Empleado
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
                        <div className="col-md-6">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por nombre, RFC o NSS..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="btn btn-outline-secondary">Buscar</button>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-secondary w-100" onClick={cargarEmpleados}>
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
                            <th>Código</th>
                            <th>Nombre Completo</th>
                            <th>RFC</th>
                            <th>Puesto</th>
                            <th>Departamento</th>
                            <th>Salario Diario</th>
                            <th>Salario Mensual</th>
                            <th>Estado</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {empleados.map(empleado => (
                            <tr key={empleado.id}>
                                <td>{empleado.id}</td>
                                <td><code>{empleado.codigoEmpleado}</code></td>
                                <td><strong>{empleado.nombre} {empleado.apellidoPaterno} {empleado.apellidoMaterno || ''}</strong></td>
                                <td>{empleado.rfc || '-'}</td>
                                <td>{empleado.puestoNombre || '-'}</td>
                                <td>{empleado.departamentoNombre || '-'}</td>
                                <td>{formatMonto(empleado.salarioDiario)}</td>
                                <td>{formatMonto(empleado.salarioMensual)}</td>
                                <td>{getEstadoBadge(empleado.activo)}</td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-1"
                                            onClick={() => navigate(`/empleados/editar/${empleado.id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-info btn-sm me-1"
                                            onClick={() => navigate(`/incidencias?empleadoId=${empleado.id}`)}
                                        >
                                            Incidencias
                                        </button>
                                        {empleado.activo ? (
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleDesactivar(empleado.id, empleado.nombre)}
                                            >
                                                Dar de Baja
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleReactivar(empleado.id, empleado.nombre)}
                                            >
                                                Reactivar
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {empleados.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 10 : 9} className="text-center">
                                    No hay empleados registrados
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

export default EmpleadoList;