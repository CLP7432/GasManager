import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { departamentosService } from '../../api/nomina/auth';
import { useAuth } from '../../contexts/AuthContext';

const DepartamentoList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        cargarDepartamentos();
    }, [filtro]);

    const cargarDepartamentos = async () => {
        setLoading(true);
        try {
            let data;
            if (filtro === 'activos') {
                data = await departamentosService.listarActivos();
            } else {
                data = await departamentosService.listar();
            }
            setDepartamentos(data);
        } catch (error) {
            console.error('Error al cargar departamentos:', error);
        }
        setLoading(false);
    };

    const handleToggleActivo = async (id, activo, nombre) => {
        const accion = activo ? 'desactivar' : 'activar';
        if (window.confirm(`¿Estás seguro de ${accion} el departamento "${nombre}"?`)) {
            try {
                await departamentosService.toggleActivo(id);
                cargarDepartamentos();
            } catch (error) {
                alert('Error al cambiar estado del departamento');
            }
        }
    };

    const handleEliminar = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de eliminar el departamento "${nombre}"?`)) {
            try {
                await departamentosService.eliminar(id);
                cargarDepartamentos();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al eliminar departamento');
            }
        }
    };

    const getEstadoBadge = (activo) => {
        return activo ?
            <span className="badge bg-success">Activo</span> :
            <span className="badge bg-danger">Inactivo</span>;
    };

    if (loading) {
        return <div className="card">Cargando departamentos...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Departamentos</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/departamentos/nuevo')}>
                        + Nuevo Departamento
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
                            <button className="btn btn-secondary" onClick={cargarDepartamentos}>
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
                            <th>Estado</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {departamentos.map(departamento => (
                            <tr key={departamento.id}>
                                <td>{departamento.id}</td>
                                <td><strong>{departamento.nombre}</strong></td>
                                <td>{departamento.descripcion || '-'}</td>
                                <td>{getEstadoBadge(departamento.activo)}</td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-1"
                                            onClick={() => navigate(`/departamentos/editar/${departamento.id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className={`btn ${departamento.activo ? 'btn-warning' : 'btn-success'} btn-sm me-1`}
                                            onClick={() => handleToggleActivo(departamento.id, departamento.activo, departamento.nombre)}
                                        >
                                            {departamento.activo ? 'Desactivar' : 'Activar'}
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleEliminar(departamento.id, departamento.nombre)}
                                            disabled={!departamento.activo}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {departamentos.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} className="text-center">
                                    No hay departamentos registrados
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

export default DepartamentoList;