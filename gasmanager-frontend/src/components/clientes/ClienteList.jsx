import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesService } from '../../api/clientes/auth';
import { useAuth } from '../../contexts/AuthContext';

const ClienteList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        cargarClientes();
    }, [filtro]);

    const cargarClientes = async () => {
        setLoading(true);
        try {
            let data;
            if (filtro === 'activos') {
                data = await clientesService.listarActivos();
            } else {
                data = await clientesService.listar();
            }
            setClientes(data);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
        setLoading(false);
    };

    const handleBuscar = async () => {
        if (searchTerm.trim()) {
            setLoading(true);
            try {
                const data = await clientesService.buscarPorRazonSocial(searchTerm);
                setClientes(data);
            } catch (error) {
                console.error('Error al buscar:', error);
            }
            setLoading(false);
        } else {
            cargarClientes();
        }
    };

    const handleToggleActivo = async (id, activo) => {
        const accion = activo ? 'desactivar' : 'activar';
        if (window.confirm(`¿Estás seguro de ${accion} este cliente?`)) {
            try {
                await clientesService.toggleActivo(id);
                cargarClientes();
            } catch (error) {
                alert('Error al cambiar estado del cliente');
            }
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente? Esta acción eliminará todos sus créditos.')) {
            try {
                await clientesService.eliminar(id);
                cargarClientes();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al eliminar cliente');
            }
        }
    };

    const getEstadoBadge = (activo) => {
        return activo ?
            <span className="badge bg-success">Activo</span> :
            <span className="badge bg-danger">Inactivo</span>;
    };

    const getTipoPersonaBadge = (tipo) => {
        return tipo === 'FISICA' ?
            <span className="badge bg-info">Persona Física</span> :
            <span className="badge bg-primary">Persona Moral</span>;
    };

    if (loading) {
        return <div className="card">Cargando clientes...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Clientes</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/clientes/nuevo')}>
                        + Nuevo Cliente
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
                                    placeholder="Buscar por razón social..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                                />
                                <button className="btn btn-outline-secondary" onClick={handleBuscar}>
                                    Buscar
                                </button>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-secondary w-100" onClick={cargarClientes}>
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
                            <th>Razón Social</th>
                            <th>RFC</th>
                            <th>Tipo</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td><code>{cliente.codigoCliente}</code></td>
                                <td><strong>{cliente.razonSocial || cliente.nombreComercial}</strong></td>
                                <td>{cliente.rfc || '-'}</td>
                                <td>{getTipoPersonaBadge(cliente.tipoPersona)}</td>
                                <td>{cliente.email || '-'}</td>
                                <td>{cliente.telefono || cliente.celular || '-'}</td>
                                <td>{getEstadoBadge(cliente.activo)}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm me-1"
                                        onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-info btn-sm me-1"
                                        onClick={() => navigate(`/clientes/creditos/${cliente.id}`)}
                                    >
                                        Créditos
                                    </button>
                                    <button
                                        className={`btn ${cliente.activo ? 'btn-warning' : 'btn-success'} btn-sm me-1`}
                                        onClick={() => handleToggleActivo(cliente.id, cliente.activo)}
                                    >
                                        {cliente.activo ? 'Desactivar' : 'Activar'}
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleEliminar(cliente.id)}
                                        disabled={!cliente.activo}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {clientes.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    No hay clientes registrados
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

export default ClienteList;