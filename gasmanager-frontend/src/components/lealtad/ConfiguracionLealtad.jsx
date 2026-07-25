import React, { useState, useEffect } from 'react';
import { programasService, extractApiError } from '../../api/lealtad/auth.js';
import GestionRecompensas from './GestionRecompensas.jsx';

const ConfiguracionLealtad = () => {
    const [programas, setProgramas] = useState([]);
    const [programaActivo, setProgramaActivo] = useState(null);
    const [factorPuntos, setFactorPuntos] = useState(2);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState('Programa de Lealtad');
    const [inicializado, setInicializado] = useState(false);

    useEffect(() => { cargarConfiguracion(); }, []);

    const cargarConfiguracion = async () => {
        try {
            const activo = await programasService.obtenerActivo();
            if (activo) {
                setProgramaActivo(activo);
                setFactorPuntos(activo.factorPuntos);
            } else {
                setProgramaActivo(null);
            }
        } catch (error) {
            console.error('Error al obtener programa activo:', error);
            setProgramaActivo(null);
        }
        try {
            const lista = await programasService.listar();
            setProgramas(lista);
        } catch (error) {
            console.error('Error al listar programas:', error);
            setMensaje({
                tipo: 'error',
                texto: extractApiError(error, 'Error al listar programas de lealtad. Verifica que el microservicio este corriendo.')
            });
        }
        setInicializado(true);
    };

    const handleActualizarFactorPuntos = async (e) => {
        e.preventDefault();
        setMensaje(null);
        setLoading(true);
        try {
            const factor = parseInt(factorPuntos, 10);
            if (isNaN(factor) || factor <= 0 || factor > 100) {
                setMensaje({ tipo: 'error', texto: 'El factor de puntos debe ser un entero entre 1 y 100' });
                setLoading(false);
                return;
            }
            const programa = await programasService.crear({
                nombre: nuevoNombre || `Programa ${new Date().toLocaleDateString()}`,
                inicio: new Date().toISOString(),
                activo: false,
                factorPuntos: factor
            });
            await programasService.activar(programa.id);
            await cargarConfiguracion();
            setMensaje({ tipo: 'success', texto: `Nuevo programa activo con factor de ${factor} puntos por litro.` });
        } catch (error) {
            setMensaje({ tipo: 'error', texto: extractApiError(error, 'Error al actualizar la configuracion') });
        }
        setLoading(false);
    };

    const handleActivarPrograma = async (programaId) => {
        setMensaje(null);
        setLoading(true);
        try {
            await programasService.activar(programaId);
            await cargarConfiguracion();
            setMensaje({ tipo: 'success', texto: 'Programa activado correctamente.' });
        } catch (error) {
            setMensaje({ tipo: 'error', texto: extractApiError(error, 'Error al activar el programa') });
        }
        setLoading(false);
    };

    const formatFecha = (fecha) => {
        if (!fecha) return '-';
        return new Date(fecha).toLocaleString('es-MX');
    };

    return (
        <div>
            {!inicializado && (
                <div className="card p-4">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando configuracion de lealtad...</p>
                    </div>
                </div>
            )}
            {inicializado && (
                <>
                    <div style={{ marginBottom: '30px' }}>
                        <h2>Configuracion del Programa de Lealtad</h2>
                        <p style={{ color: '#666', marginTop: '10px' }}>
                            Administra el programa de lealtad que calcula los puntos por litro en el backend.
                        </p>
                    </div>
                    {mensaje && (
                        <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'}`} role="alert">
                            {mensaje.texto}
                        </div>
                    )}
                    <div className="card mb-4" style={{ borderTop: '4px solid #e83e8c' }}>
                        <div className="card-body">
                            <h5 className="card-title mb-4">Programa Activo</h5>
                            {programaActivo ? (
                                <div>
                                    <p><strong>Nombre:</strong> {programaActivo.nombre}</p>
                                    <p><strong>Factor de puntos:</strong> {programaActivo.factorPuntos} pts/litro</p>
                                    <p><strong>Inicio:</strong> {formatFecha(programaActivo.inicio)}</p>
                                    <p><strong>Activo:</strong> {programaActivo.activo ? 'Si' : 'No'}</p>
                                </div>
                            ) : (
                                <div className="alert alert-warning mb-0">
                                    No se encontro un programa activo. Crea uno nuevo para habilitar el calculo de puntos.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card mb-4" style={{ borderTop: '4px solid #6f42c1' }}>
                        <div className="card-body">
                            <h5 className="card-title mb-4">Crear y Activar Programa de Lealtad</h5>
                            <form onSubmit={handleActualizarFactorPuntos}>
                                <div className="row g-3 align-items-end">
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Nombre del Programa</label>
                                        <input type="text" className="form-control" value={nuevoNombre}
                                            onChange={(e) => setNuevoNombre(e.target.value)}
                                            placeholder="Ej: Programa Promocional" required />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Factor de Puntos</label>
                                        <div className="input-group">
                                            <input type="number" className="form-control" value={factorPuntos}
                                                onChange={(e) => setFactorPuntos(e.target.value)}
                                                step="1" min="1" max="100" required />
                                            <span className="input-group-text">pts/litro</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                            {loading ? 'Guardando...' : 'Guardar y Activar'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Programas Guardados</h5>
                            {programas.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr><th>ID</th><th>Nombre</th><th>Factor</th><th>Activo</th><th>Accion</th></tr>
                                        </thead>
                                        <tbody>
                                            {programas.map(programa => (
                                                <tr key={programa.id}>
                                                    <td>{programa.id}</td>
                                                    <td>{programa.nombre}</td>
                                                    <td>{programa.factorPuntos}</td>
                                                    <td>{programa.activo ? 'Si' : 'No'}</td>
                                                    <td>
                                                        {!programa.activo && (
                                                            <button className="btn btn-sm btn-outline-primary"
                                                                onClick={() => handleActivarPrograma(programa.id)} disabled={loading}>
                                                                Activar
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="alert alert-info mb-0">No hay programas guardados.</div>
                            )}
                        </div>
                    </div>
                    <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #e0e0e0' }}>
                        <GestionRecompensas />
                    </div>
                </>
            )}
        </div>
    );
};

export default ConfiguracionLealtad;
