import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { configuracionService, manguerasService } from '../../api/ventas/auth';
import { useAuth } from '../../contexts/AuthContext';

const ConfiguracionInicialPage = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [configuracionExistente, setConfiguracionExistente] = useState(false);
    const [lecturas, setLecturas] = useState([]);

    useEffect(() => {
        cargarConfiguracion();
    }, []);

    const cargarConfiguracion = async () => {
        setLoading(true);
        try {
            const existe = await configuracionService.verificar();
            setConfiguracionExistente(existe);

            // Obtener mangueras activas en lugar de dispensarios
            const mangueras = await manguerasService.listarActivas();

            let lecturasIniciales;

            if (existe) {
                // Si ya existe configuración, usar las lecturas guardadas de las mangueras
                lecturasIniciales = mangueras.map(m => ({
                    mangueraId: m.id,
                    mangueraNombre: m.nombre,
                    caraNombre: m.cara?.nombre || 'Cara',
                    dispensarioNombre: m.cara?.dispensario?.nombre || 'Surtidor',
                    tipoCombustible: m.tipoCombustible,
                    lecturaInicial: m.lecturaActual || 0,
                    precioPorLitro: 24.00,
                    tipo: 'COMBUSTIBLE'
                }));
            } else {
                // Configuración nueva, todo en cero
                lecturasIniciales = mangueras.map(m => ({
                    mangueraId: m.id,
                    mangueraNombre: m.nombre,
                    caraNombre: m.cara?.nombre || 'Cara',
                    dispensarioNombre: m.cara?.dispensario?.nombre || 'Surtidor',
                    tipoCombustible: m.tipoCombustible,
                    lecturaInicial: 0,
                    precioPorLitro: 24.00,
                    tipo: 'COMBUSTIBLE'
                }));
            }

            setLecturas(lecturasIniciales);
        } catch (error) {
            console.error('Error cargando configuración:', error);
            alert('Error al cargar las mangueras. Asegúrate de tener dispensarios configurados.');
        }
        setLoading(false);
    };

    const handleLecturaChange = (index, value) => {
        const nuevas = [...lecturas];
        nuevas[index].lecturaInicial = parseFloat(value) || 0;
        setLecturas(nuevas);
    };

    const handlePrecioChange = (index, value) => {
        const nuevas = [...lecturas];
        nuevas[index].precioPorLitro = parseFloat(value) || 0;
        setLecturas(nuevas);
    };

    const inicializarCeros = () => {
        const nuevas = lecturas.map(l => ({ ...l, lecturaInicial: 0 }));
        setLecturas(nuevas);
    };

    const handleGuardar = async () => {
        const accion = configuracionExistente ? 'actualizar' : 'guardar';
        if (!window.confirm(`⚠️ ¿Estás seguro de ${accion} la configuración?\n\nEsta acción actualizará las lecturas base del sistema.`)) {
            return;
        }

        setGuardando(true);
        try {
            await configuracionService.guardar(lecturas);
            alert(`✅ Configuración ${configuracionExistente ? 'actualizada' : 'guardada'} exitosamente`);

            // También actualizar las lecturas actuales de las mangueras
            for (const lectura of lecturas) {
                await manguerasService.actualizarLectura(lectura.mangueraId, lectura.lecturaInicial);
            }

            setConfiguracionExistente(true);
            cargarConfiguracion();
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || error.message));
        }
        setGuardando(false);
    };

    if (!isAdmin) {
        return (
            <Layout>
                <div className="alert alert-danger">No tienes permisos para acceder a esta página</div>
            </Layout>
        );
    }

    if (loading) {
        return <Layout><div className="card">Cargando mangueras...</div></Layout>;
    }

    if (lecturas.length === 0) {
        return (
            <Layout>
                <div className="card">
                    <h2>⚙️ Configuración del Sistema</h2>
                    <div className="alert alert-warning">
                        ⚠️ No hay mangueras configuradas. Primero debes crear dispensarios con sus caras y mangueras.
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/dispensarios')}
                    >
                        Ir a Gestión de Dispensarios
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="card">
                <h2>⚙️ Configuración del Sistema</h2>

                {configuracionExistente && (
                    <div className="alert alert-info">
                        ℹ️ Ya existe una configuración previa. Puedes modificarla si es necesario.
                    </div>
                )}

                <div className="alert alert-warning">
                    ⚠️ <strong>Importante:</strong> Modificar estas lecturas afectará los cálculos de los turnos futuros.
                </div>

                <div className="mb-3">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={inicializarCeros}
                    >
                        🔄 Resetear Lecturas a Cero
                    </button>
                </div>

                <h3>📊 Lecturas Base de Mangueras</h3>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-dark">
                        <tr>
                            <th>Dispensario</th>
                            <th>Cara</th>
                            <th>Manguera</th>
                            <th>Tipo</th>
                            <th>Lectura Base (Litros)</th>
                            <th>Precio por Litro ($)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lecturas.map((lectura, index) => (
                            <tr key={lectura.mangueraId}>
                                <td><strong>{lectura.dispensarioNombre}</strong></td>
                                <td>{lectura.caraNombre}</td>
                                <td>{lectura.mangueraNombre}</td>
                                <td>{lectura.tipoCombustible}</td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.001"
                                        className="form-control"
                                        value={lectura.lecturaInicial}
                                        onChange={(e) => handleLecturaChange(index, e.target.value)}
                                        style={{ width: '150px' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        value={lectura.precioPorLitro}
                                        onChange={(e) => handlePrecioChange(index, e.target.value)}
                                        style={{ width: '100px' }}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 d-flex gap-2">
                    <button
                        className="btn btn-success"
                        onClick={handleGuardar}
                        disabled={guardando}
                    >
                        {guardando ? 'Guardando...' : (configuracionExistente ? '💾 Actualizar Configuración' : '✅ Guardar Configuración Inicial')}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/modulo-administracion')}
                    >
                        Volver al Módulo de Administración
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ConfiguracionInicialPage;