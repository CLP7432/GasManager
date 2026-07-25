import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { creditosService, clientesService } from '../../api/clientes/auth';
import { useAuth } from '../../contexts/AuthContext';

const CreditoList = ({ clienteId }) => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [creditos, setCreditos] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [showAbonoModal, setShowAbonoModal] = useState(false);
    const [creditoSeleccionado, setCreditoSeleccionado] = useState(null);
    const [abonoData, setAbonoData] = useState({
        monto: '',
        fechaAbono: new Date().toISOString().split('T')[0],
        metodoPago: 'EFECTIVO',
        referenciaPago: '',
        notas: ''
    });
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if (clienteId) {
            cargarCliente();
        }
        cargarCreditos();
    }, [clienteId, estadoFiltro]);

    const cargarCliente = async () => {
        try {
            const data = await clientesService.obtenerPorId(clienteId);
            setCliente(data);
        } catch (error) {
            console.error('Error al cargar cliente:', error);
        }
    };

    const cargarCreditos = async () => {
        setLoading(true);
        try {
            let data;
            if (clienteId) {
                data = await creditosService.listarPorCliente(clienteId);
            } else if (estadoFiltro) {
                data = await creditosService.listarPorEstado(estadoFiltro);
            } else {
                data = await creditosService.listar();
            }
            setCreditos(data);
        } catch (error) {
            console.error('Error al cargar créditos:', error);
        }
        setLoading(false);
    };

    const handleCancelarCredito = async (id) => {
        const motivo = prompt('Motivo de cancelación:');
        if (motivo === null) return;

        if (window.confirm('¿Estás seguro de cancelar este crédito?')) {
            try {
                await creditosService.cancelar(id, motivo);
                alert('Crédito cancelado exitosamente');
                cargarCreditos();
            } catch (error) {
                alert(error.response?.data?.message || 'Error al cancelar crédito');
            }
        }
    };

    const abrirModalAbono = (credito) => {
        setCreditoSeleccionado(credito);
        setAbonoData({
            monto: '',
            fechaAbono: new Date().toISOString().split('T')[0],
            metodoPago: 'EFECTIVO',
            referenciaPago: '',
            notas: ''
        });
        setShowAbonoModal(true);
    };

    const cerrarModal = () => {
        setShowAbonoModal(false);
        setCreditoSeleccionado(null);
        setAbonoData({
            monto: '',
            fechaAbono: new Date().toISOString().split('T')[0],
            metodoPago: 'EFECTIVO',
            referenciaPago: '',
            notas: ''
        });
    };

    const handleAbonoChange = (e) => {
        const { name, value } = e.target;
        setAbonoData(prev => ({ ...prev, [name]: value }));
    };

    const registrarAbono = async (e) => {
        e.preventDefault();
        if (!abonoData.monto || parseFloat(abonoData.monto) <= 0) {
            alert('Ingrese un monto válido');
            return;
        }

        if (creditoSeleccionado && parseFloat(abonoData.monto) > creditoSeleccionado.saldoPendiente) {
            alert(`El monto del abono no puede exceder el saldo pendiente (${formatMonto(creditoSeleccionado.saldoPendiente)})`);
            return;
        }

        setEnviando(true);
        try {
            await creditosService.registrarAbono(creditoSeleccionado.id, {
                monto: parseFloat(abonoData.monto),
                fechaAbono: abonoData.fechaAbono,
                metodoPago: abonoData.metodoPago,
                referenciaPago: abonoData.referenciaPago || null,
                notas: abonoData.notas || null
            });
            alert('Abono registrado exitosamente');
            cerrarModal();
            cargarCreditos();
        } catch (error) {
            alert(error.response?.data?.message || 'Error al registrar abono');
        }
        setEnviando(false);
    };

    const getEstadoBadge = (estado) => {
        const colores = {
            ACTIVO: 'badge bg-success',
            PAGADO: 'badge bg-info',
            VENCIDO: 'badge bg-danger',
            CANCELADO: 'badge bg-secondary',
            EN_COBRANZA: 'badge bg-warning text-dark'
        };
        return <span className={colores[estado] || 'badge bg-secondary'}>{estado}</span>;
    };

    const getMetodoPagoBadge = (metodo) => {
        const colores = {
            SEMANAL: 'badge bg-primary',
            QUINCENAL: 'badge bg-info',
            MENSUAL: 'badge bg-success',
            PERSONALIZADO: 'badge bg-warning text-dark'
        };
        return metodo ? <span className={colores[metodo]}>{metodo}</span> : '-';
    };

    const formatMonto = (monto) => {
        if (!monto && monto !== 0) return '$0.00';
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    if (loading) {
        return <div className="card">Cargando créditos...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2>Gestión de Créditos</h2>
                    {cliente && <p className="text-muted">Cliente: <strong>{cliente.razonSocial || cliente.nombreComercial}</strong> ({cliente.codigoCliente})</p>}
                </div>
                {isAdmin && !clienteId && (
                    <button className="btn btn-primary" onClick={() => navigate('/creditos/nuevo')}>
                        + Nuevo Crédito
                    </button>
                )}
                {clienteId && (
                    <button className="btn btn-secondary" onClick={() => navigate('/clientes')}>
                        ← Volver a Clientes
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
                                <option value="ACTIVO">Activos</option>
                                <option value="PAGADO">Pagados</option>
                                <option value="VENCIDO">Vencidos</option>
                                <option value="CANCELADO">Cancelados</option>
                                <option value="EN_COBRANZA">En Cobranza</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-secondary w-100" onClick={cargarCreditos}>
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
                            <th>Cliente</th>
                            <th>Monto Total</th>
                            <th>Pagado</th>
                            <th>Saldo</th>
                            <th>Plazo</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                            <th>Método Pago</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {creditos.map(credito => (
                            <tr key={credito.id}>
                                <td>{credito.id}</td>
                                <td><code>{credito.folioCredito}</code></td>
                                <td>
                                    <strong>{credito.clienteNombre}</strong><br/>
                                    <small className="text-muted">ID: {credito.clienteId}</small>
                                </td>
                                <td className="text-end">{formatMonto(credito.montoTotal)}</td>
                                <td className="text-end text-success">{formatMonto(credito.montoPagado)}</td>
                                <td className="text-end fw-bold">{formatMonto(credito.saldoPendiente)}</td>
                                <td>{credito.plazoMeses} meses</td>
                                <td>{credito.fechaVencimiento || '-'}</td>
                                <td>{getEstadoBadge(credito.estado)}</td>
                                <td>{getMetodoPagoBadge(credito.metodoPago)}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-1"
                                        onClick={() => navigate(`/creditos/${credito.id}`)}
                                    >
                                        Ver
                                    </button>
                                    {credito.estado === 'ACTIVO' && (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-1"
                                                onClick={() => abrirModalAbono(credito)}
                                            >
                                                Abono
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleCancelarCredito(credito.id)}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    )}
                                    {credito.estado === 'VENCIDO' && (
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => abrirModalAbono(credito)}
                                        >
                                            Registrar Pago
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {creditos.length === 0 && (
                            <tr>
                                <td colSpan="11" className="text-center">
                                    No hay créditos registrados
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para registrar abono */}
            {showAbonoModal && creditoSeleccionado && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Registrar Abono</h5>
                                <button type="button" className="btn-close" onClick={cerrarModal}></button>
                            </div>
                            <form onSubmit={registrarAbono}>
                                <div className="modal-body">
                                    <p><strong>Crédito:</strong> {creditoSeleccionado.folioCredito}</p>
                                    <p><strong>Cliente:</strong> {creditoSeleccionado.clienteNombre}</p>
                                    <p><strong>Saldo pendiente:</strong> <span className="text-danger fw-bold">{formatMonto(creditoSeleccionado.saldoPendiente)}</span></p>
                                    <hr />
                                    <div className="mb-3">
                                        <label className="form-label">Monto del abono *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={creditoSeleccionado.saldoPendiente}
                                            className="form-control"
                                            name="monto"
                                            value={abonoData.monto}
                                            onChange={handleAbonoChange}
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha del abono *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="fechaAbono"
                                            value={abonoData.fechaAbono}
                                            onChange={handleAbonoChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Método de pago *</label>
                                        <select
                                            className="form-select"
                                            name="metodoPago"
                                            value={abonoData.metodoPago}
                                            onChange={handleAbonoChange}
                                            required
                                        >
                                            <option value="EFECTIVO">Efectivo</option>
                                            <option value="TRANSFERENCIA">Transferencia</option>
                                            <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                                            <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                                            <option value="CHEQUE">Cheque</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Referencia de pago</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="referenciaPago"
                                            value={abonoData.referenciaPago}
                                            onChange={handleAbonoChange}
                                            placeholder="Número de referencia, folio, etc."
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Notas</label>
                                        <textarea
                                            className="form-control"
                                            name="notas"
                                            value={abonoData.notas}
                                            onChange={handleAbonoChange}
                                            rows="2"
                                            placeholder="Observaciones (opcional)"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={enviando}>
                                        {enviando ? 'Registrando...' : 'Registrar Abono'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditoList;