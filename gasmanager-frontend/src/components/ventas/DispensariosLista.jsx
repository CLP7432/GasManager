import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dispensariosService } from '../../api/ventas/auth';
import { useAuth } from '../../contexts/AuthContext';

const DispensariosLista = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [dispensarios, setDispensarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDispensarios();
    }, []);

    const cargarDispensarios = async () => {
        setLoading(true);
        try {
            const data = await dispensariosService.listarCompletos();
            if (Array.isArray(data)) {
                setDispensarios(data);
            } else {
                setDispensarios([]);
            }
        } catch (error) {
            console.error('Error:', error);
            setDispensarios([]);
        }
        setLoading(false);
    };

    const handleEliminar = async (id, nombre) => {
        if (window.confirm(`¿Eliminar PERMANENTEMENTE el dispensario "${nombre}"?\n\n¡Esta acción no se puede deshacer!`)) {
            try {
                await dispensariosService.eliminar(id);
                alert('✅ Dispensario eliminado correctamente');
                cargarDispensarios();
            } catch (error) {
                alert('❌ Error al eliminar: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleDeshabilitar = async (id, nombre) => {
        if (window.confirm(`¿Deshabilitar el dispensario "${nombre}"?\n\nNo aparecerá en el punto de venta.`)) {
            try {
                await dispensariosService.deshabilitar(id);
                alert('✅ Dispensario deshabilitado');
                cargarDispensarios();
            } catch (error) {
                alert('❌ Error al deshabilitar');
            }
        }
    };

    const handleHabilitar = async (id, nombre) => {
        if (window.confirm(`¿Habilitar el dispensario "${nombre}"?\n\nVolverá a aparecer en el punto de venta.`)) {
            try {
                await dispensariosService.habilitar(id);
                alert('✅ Dispensario habilitado');
                cargarDispensarios();
            } catch (error) {
                alert('❌ Error al habilitar');
            }
        }
    };

    const getEstadoBadge = (dispensario) => {
        if (!dispensario.activo) {
            if (dispensario.estado === 'MANTENIMIENTO') {
                return <span className="badge bg-warning text-dark">🔧 MANTENIMIENTO</span>;
            }
            return <span className="badge bg-secondary">❌ INACTIVO</span>;
        }
        return <span className="badge bg-success">✅ ACTIVO</span>;
    };

    const getCombustiblePorManguera = (dispensario, mangueraCodigo) => {
        if (!dispensario.caras) return '-';
        for (const cara of dispensario.caras) {
            if (cara.mangueras) {
                const manguera = cara.mangueras.find(m => m.codigo === mangueraCodigo);
                if (manguera && manguera.tipoCombustible) {
                    return manguera.tipoCombustible;
                }
            }
        }
        return '-';
    };

    if (loading) {
        return <div className="card">Cargando dispensarios...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Gestión de Dispensarios</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/dispensarios/nuevo')}>
                        + Nuevo Dispensario
                    </button>
                )}
            </div>

            <div className="alert alert-info">
                ℹ️ Los dispensarios <strong>INACTIVOS</strong> o en <strong>MANTENIMIENTO</strong> no aparecerán en el Punto de Venta.
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Número</th>
                            <th>Nombre</th>
                            <th>Ubicación</th>
                            <th colSpan="4" className="text-center">Mangueras</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        <tr>
                            <th></th><th></th><th></th><th></th>
                            <th className="text-center">A1</th>
                            <th className="text-center">A2</th>
                            <th className="text-center">B1</th>
                            <th className="text-center">B2</th>
                            <th></th><th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {dispensarios.map(d => (
                            <tr key={d.id} className={!d.activo ? 'table-secondary' : ''}>
                                <td>{d.id}</td>
                                <td><strong>{d.numero}</strong></td>
                                <td>{d.nombre}</td>
                                <td>{d.ubicacion || '-'}</td>
                                <td className="text-center">
                                    {getCombustiblePorManguera(d, 'A1') !== '-' ? (
                                        <span className="badge bg-primary">{getCombustiblePorManguera(d, 'A1')}</span>
                                    ) : <span className="badge bg-secondary">-</span>}
                                </td>
                                <td className="text-center">
                                    {getCombustiblePorManguera(d, 'A2') !== '-' ? (
                                        <span className="badge bg-primary">{getCombustiblePorManguera(d, 'A2')}</span>
                                    ) : <span className="badge bg-secondary">-</span>}
                                </td>
                                <td className="text-center">
                                    {getCombustiblePorManguera(d, 'B1') !== '-' ? (
                                        <span className="badge bg-primary">{getCombustiblePorManguera(d, 'B1')}</span>
                                    ) : <span className="badge bg-secondary">-</span>}
                                </td>
                                <td className="text-center">
                                    {getCombustiblePorManguera(d, 'B2') !== '-' ? (
                                        <span className="badge bg-primary">{getCombustiblePorManguera(d, 'B2')}</span>
                                    ) : <span className="badge bg-secondary">-</span>}
                                </td>
                                <td>{getEstadoBadge(d)}</td>
                                <td>
                                    <div className="btn-group btn-group-sm" role="group">
                                        {d.activo ? (
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => handleDeshabilitar(d.id, d.nombre)}
                                                title="Deshabilitar">
                                                🔴 Deshabilitar
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleHabilitar(d.id, d.nombre)}
                                                title="Habilitar">
                                                🟢 Habilitar
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => navigate(`/dispensarios/editar/${d.id}`)}
                                            title="Editar">
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleEliminar(d.id, d.nombre)}
                                            title="Eliminar">
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {dispensarios.length === 0 && (
                            <tr>
                                <td colSpan="11" className="text-center">
                                    No hay dispensarios registrados
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

export default DispensariosLista;