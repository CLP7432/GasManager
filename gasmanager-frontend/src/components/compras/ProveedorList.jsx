import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { proveedoresService } from '../../api/compras/auth';
import { useAuth } from '../../contexts/AuthContext';

const ProveedorList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        cargarProveedores();
    }, [filtro]);

    const cargarProveedores = async () => {
        setLoading(true);
        try {
            let data;
            if (filtro === 'activos') {
                data = await proveedoresService.listarActivos();
            } else {
                data = await proveedoresService.listar();
            }
            setProveedores(data);
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
        setLoading(false);
    };

    const handleBuscar = async () => {
        if (searchTerm.trim()) {
            setLoading(true);
            try {
                const data = await proveedoresService.buscarPorNombre(searchTerm);
                setProveedores(data);
            } catch (error) {
                console.error('Error al buscar:', error);
            }
            setLoading(false);
        } else {
            cargarProveedores();
        }
    };

    const handleToggleActivo = async (id, activo, nombre) => {
        const accion = activo ? 'desactivar' : 'activar';
        if (window.confirm(`¿Estás seguro de ${accion} el proveedor "${nombre}"?`)) {
            try {
                await proveedoresService.toggleActivo(id);
                cargarProveedores();
            } catch (error) {
                alert('Error al cambiar estado del proveedor');
            }
        }
    };

    const handleEliminar = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de eliminar el proveedor "${nombre}"?`)) {
            try {
                await proveedoresService.eliminar(id);
                cargarProveedores();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al eliminar proveedor');
            }
        }
    };

    const getEstadoBadge = (activo) => {
        return activo ?
            <span className="badge bg-success">Activo</span> :
            <span className="badge bg-danger">Inactivo</span>;
    };

    if (loading) {
        return <div className="card">Cargando proveedores...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Proveedores</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/proveedores/nuevo')}>
                        + Nuevo Proveedor
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
                                    placeholder="Buscar por nombre..."
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
                            <button className="btn btn-secondary w-100" onClick={cargarProveedores}>
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
                            <th>Nombre</th>
                            <th>RFC</th>
                            <th>Contacto</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Estado</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {proveedores.map(proveedor => (
                            <tr key={proveedor.id}>
                                <td>{proveedor.id}</td>
                                <td><code>{proveedor.codigoProveedor}</code></td>
                                <td><strong>{proveedor.nombre}</strong></td>
                                <td>{proveedor.rfc || '-'}</td>
                                <td>{proveedor.contacto || '-'}</td>
                                <td>{proveedor.telefono || '-'}</td>
                                <td>{proveedor.email || '-'}</td>
                                <td>{getEstadoBadge(proveedor.activo)}</td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-1"
                                            onClick={() => navigate(`/proveedores/editar/${proveedor.id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-info btn-sm me-1"
                                            onClick={() => navigate(`/ordenes-compra?proveedorId=${proveedor.id}`)}
                                        >
                                            Órdenes
                                        </button>
                                        <button
                                            className={`btn ${proveedor.activo ? 'btn-warning' : 'btn-success'} btn-sm me-1`}
                                            onClick={() => handleToggleActivo(proveedor.id, proveedor.activo, proveedor.nombre)}
                                        >
                                            {proveedor.activo ? 'Desactivar' : 'Activar'}
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleEliminar(proveedor.id, proveedor.nombre)}
                                            disabled={!proveedor.activo}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {proveedores.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 9 : 8} className="text-center">
                                    No hay proveedores registrados
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

export default ProveedorList;