import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { combustibleService } from '../../api/inventarios/auth';
import { useAuth } from '../../contexts/AuthContext';

const CombustibleList = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [combustibles, setCombustibles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarCombustibles();
    }, []);

    const cargarCombustibles = async () => {
        setLoading(true);
        try {
            const data = await combustibleService.listar();
            setCombustibles(data);
        } catch (error) {
            console.error('Error al cargar combustibles:', error);
        }
        setLoading(false);
    };

    const toggleActivo = async (combustible) => {
        const nuevoEstado = !combustible.activo;
        const accion = nuevoEstado ? 'activar' : 'desactivar';
        if (window.confirm(`¿Estás seguro de ${accion} "${combustible.nombre}"?`)) {
            try {
                await combustibleService.toggleActivo(combustible.id);
                cargarCombustibles();
            } catch (error) {
                alert('Error al cambiar estado del combustible');
            }
        }
    };

    const eliminarCombustible = async (combustible) => {
        if (window.confirm(`¿Estás seguro de eliminar "${combustible.nombre}"?`)) {
            try {
                await combustibleService.eliminar(combustible.id);
                cargarCombustibles();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al eliminar combustible');
            }
        }
    };

    // 🔥 NUEVO: Redirigir a la página de precios en administración
    const irActualizarPrecio = (combustibleId) => {
        navigate(`/precios-combustibles?combustibleId=${combustibleId}`);
    };

    if (loading) {
        return <div className="card">Cargando combustibles...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Combustibles</h2>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => navigate('/combustibles/nuevo')}>
                        + Nuevo Combustible
                    </button>
                )}
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio Actual</th>
                            <th>Estado</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {combustibles.map(comb => (
                            <tr key={comb.id}>
                                <td>{comb.id}</td>
                                <td>{comb.tipo}</td>
                                <td><strong>{comb.nombre}</strong></td>
                                <td>{comb.descripcion || '-'}</td>
                                <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                                    ${comb.precioActual?.toFixed(2)}
                                </td>
                                <td>
                                        <span className={`badge ${comb.activo ? 'badge-success' : 'badge-danger'}`}>
                                            {comb.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                </td>
                                {isAdmin && (
                                    <td>
                                        {/* 🔥 BOTÓN MODIFICADO: Redirige a Administración */}
                                        <button
                                            className="btn btn-primary"
                                            style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }}
                                            onClick={() => irActualizarPrecio(comb.id)}
                                        >
                                            Actualizar Precio
                                        </button>
                                        <button
                                            className={`btn ${comb.activo ? 'btn-warning' : 'btn-success'}`}
                                            style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }}
                                            onClick={() => toggleActivo(comb)}
                                        >
                                            {comb.activo ? 'Desactivar' : 'Activar'}
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            style={{ padding: '4px 8px', fontSize: '12px' }}
                                            onClick={() => eliminarCombustible(comb)}
                                            disabled={!comb.activo}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {combustibles.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center' }}>
                                    No hay combustibles registrados
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

export default CombustibleList;