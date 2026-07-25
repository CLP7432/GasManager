import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facturacionService } from '../../api/facturacion/auth';
import { clientesService } from '../../api/clientes/auth';
import { ventasService } from '../../api/ventas/auth';
import { useAuth } from '../../contexts/AuthContext';

const SolicitarFactura = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [buscandoVentas, setBuscandoVentas] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [ventasDisponibles, setVentasDisponibles] = useState([]);
    const [ventasSeleccionadas, setVentasSeleccionadas] = useState([]);
    const [formData, setFormData] = useState({
        clienteId: '',
        rfc: '',
        nombre: '',
        regimenFiscal: '601',
        codigoPostal: '',
        email: '',
        formaPago: 'EFECTIVO',
        metodoPago: 'PAGO_EN_UNA_EXHIBICION',
        observaciones: ''
    });
    const [buscarVentaInput, setBuscarVentaInput] = useState('');
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [totalFactura, setTotalFactura] = useState(0);

    useEffect(() => {
        cargarClientes();
    }, []);

    useEffect(() => {
        // Calcular total cuando cambian las ventas seleccionadas
        const total = ventasSeleccionadas.reduce((sum, v) => sum + v.total, 0);
        setTotalFactura(total);
    }, [ventasSeleccionadas]);

    const cargarClientes = async () => {
        try {
            const data = await clientesService.listarActivos();
            setClientes(data);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
    };

    const handleClienteChange = async (e) => {
        const clienteId = e.target.value;
        setFormData(prev => ({ ...prev, clienteId }));

        if (clienteId) {
            try {
                const cliente = await clientesService.obtenerPorId(clienteId);
                setFormData(prev => ({
                    ...prev,
                    rfc: cliente.rfc || '',
                    nombre: cliente.razonSocial || cliente.nombreComercial || '',
                    email: cliente.email || ''
                }));
            } catch (error) {
                console.error('Error al cargar cliente:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const buscarVenta = async () => {
        if (!buscarVentaInput.trim()) {
            alert('Ingrese un número de folio o ID de venta');
            return;
        }

        setBuscandoVentas(true);
        try {
            // Intentar buscar por ID
            let venta;
            try {
                venta = await ventasService.obtenerPorId(buscarVentaInput);
            } catch {
                // Si no funciona, intentar por folio
                venta = await ventasService.obtenerPorFolio(buscarVentaInput);
            }

            // Verificar si la venta es facturable
            const facturable = await facturacionService.verificarVentaFacturable(venta.id);

            if (!facturable.facturable) {
                alert(`La venta no es facturable: ${facturable.mensaje}`);
                setVentaSeleccionada(null);
            } else {
                setVentaSeleccionada({
                    id: venta.id,
                    folio: venta.folio,
                    fechaHora: venta.fechaHora,
                    total: venta.total,
                    clienteId: venta.clienteId
                });
            }
        } catch (error) {
            console.error('Error al buscar venta:', error);
            alert('Venta no encontrada');
            setVentaSeleccionada(null);
        }
        setBuscandoVentas(false);
    };

    const agregarVenta = () => {
        if (!ventaSeleccionada) {
            alert('Primero busque una venta válida');
            return;
        }

        // Verificar que no esté ya seleccionada
        if (ventasSeleccionadas.some(v => v.id === ventaSeleccionada.id)) {
            alert('Esta venta ya ha sido agregada');
            return;
        }

        // Verificar que pertenezca al mismo cliente
        if (formData.clienteId && ventaSeleccionada.clienteId &&
            parseInt(formData.clienteId) !== ventaSeleccionada.clienteId) {
            alert('Esta venta pertenece a otro cliente. Por favor, seleccione el cliente correcto primero.');
            return;
        }

        setVentasSeleccionadas(prev => [...prev, ventaSeleccionada]);
        setVentaSeleccionada(null);
        setBuscarVentaInput('');
    };

    const eliminarVenta = (ventaId) => {
        setVentasSeleccionadas(prev => prev.filter(v => v.id !== ventaId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (ventasSeleccionadas.length === 0) {
            alert('Debe agregar al menos una venta');
            return;
        }

        if (!formData.clienteId) {
            alert('Debe seleccionar un cliente');
            return;
        }

        if (!formData.rfc || !formData.nombre) {
            alert('Debe completar los datos fiscales del cliente');
            return;
        }

        setLoading(true);

        try {
            const solicitud = {
                clienteId: parseInt(formData.clienteId),
                rfc: formData.rfc,
                nombre: formData.nombre,
                regimenFiscal: formData.regimenFiscal,
                codigoPostal: formData.codigoPostal || null,
                email: formData.email || null,
                formaPago: formData.formaPago,
                metodoPago: formData.metodoPago,
                ventasIds: ventasSeleccionadas.map(v => v.id),
                observaciones: formData.observaciones || null
            };

            const factura = await facturacionService.solicitarFactura(solicitud);
            alert(`Factura creada exitosamente\nFolio: ${factura.folioFactura}\nTotal: $${factura.total}`);
            navigate(`/facturas/${factura.id}`);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.errors || 'Error al crear factura';
            if (typeof errorMsg === 'object') {
                const firstError = Object.values(errorMsg)[0];
                alert(firstError);
            } else {
                alert(errorMsg);
            }
        }
        setLoading(false);
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-MX');
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2>Solicitar Factura</h2>
                <p className="text-muted">Seleccione un cliente y agregue una o más ventas para facturar</p>

                <form onSubmit={handleSubmit}>
                    {/* Selección de Cliente */}
                    <h5 className="mt-3 mb-3">Datos del Cliente</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Cliente *</label>
                            <select
                                className="form-select"
                                value={formData.clienteId}
                                onChange={handleClienteChange}
                                required
                            >
                                <option value="">Seleccione un cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.razonSocial || cliente.nombreComercial} - {cliente.rfc || 'Sin RFC'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">RFC *</label>
                            <input
                                type="text"
                                className="form-control"
                                name="rfc"
                                value={formData.rfc}
                                onChange={handleChange}
                                required
                                placeholder="RFC del cliente"
                            />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Nombre o Razón Social *</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                placeholder="Nombre completo o razón social"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Régimen Fiscal *</label>
                            <select
                                className="form-select"
                                name="regimenFiscal"
                                value={formData.regimenFiscal}
                                onChange={handleChange}
                                required
                            >
                                <option value="601">601 - General de Ley Personas Morales</option>
                                <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                                <option value="605">605 - Sueldos y Salarios e Ingresos Asimilados</option>
                                <option value="606">606 - Arrendamiento</option>
                                <option value="608">608 - Demás ingresos</option>
                                <option value="610">610 - Residentes en el Extranjero</option>
                                <option value="611">611 - Ingresos por Dividendos</option>
                                <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                                <option value="614">614 - Ingresos por intereses</option>
                                <option value="616">616 - Sin obligaciones fiscales</option>
                                <option value="620">620 - Plataformas Tecnológicas</option>
                                <option value="621">621 - Incorporación Fiscal</option>
                                <option value="622">622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Código Postal</label>
                            <input
                                type="text"
                                className="form-control"
                                name="codigoPostal"
                                value={formData.codigoPostal}
                                onChange={handleChange}
                                placeholder="06000"
                                maxLength="5"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                    </div>

                    {/* Datos de Factura */}
                    <h5 className="mt-4 mb-3">Datos de Facturación</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Forma de Pago</label>
                            <select
                                className="form-select"
                                name="formaPago"
                                value={formData.formaPago}
                                onChange={handleChange}
                            >
                                <option value="EFECTIVO">Efectivo</option>
                                <option value="TRANSFERENCIA">Transferencia electrónica</option>
                                <option value="TARJETA_CREDITO">Tarjeta de crédito</option>
                                <option value="TARJETA_DEBITO">Tarjeta de débito</option>
                                <option value="CHEQUE">Cheque</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Método de Pago</label>
                            <select
                                className="form-select"
                                name="metodoPago"
                                value={formData.metodoPago}
                                onChange={handleChange}
                            >
                                <option value="PAGO_EN_UNA_EXHIBICION">Pago en una sola exhibición (PUE)</option>
                                <option value="PAGO_EN_PARCIALIDADES">Pago en parcialidades (PPD)</option>
                            </select>
                        </div>
                    </div>

                    {/* Agregar Ventas */}
                    <h5 className="mt-4 mb-3">Ventas a Facturar</h5>
                    <div className="card bg-light mb-3">
                        <div className="card-body">
                            <div className="row g-2">
                                <div className="col-md-8">
                                    <label className="form-label">Buscar venta por folio o ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: VENTA-20260520-200754-4535 o 33"
                                        value={buscarVentaInput}
                                        onChange={(e) => setBuscarVentaInput(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4 d-flex align-items-end">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={buscarVenta}
                                        disabled={buscandoVentas}
                                    >
                                        {buscandoVentas ? 'Buscando...' : 'Buscar Venta'}
                                    </button>
                                </div>
                            </div>

                            {ventaSeleccionada && (
                                <div className="alert alert-success mt-3 mb-0">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>Venta encontrada:</strong> {ventaSeleccionada.folio} - {formatDate(ventaSeleccionada.fechaHora)} - {formatMonto(ventaSeleccionada.total)}
                                        </div>
                                        <button type="button" className="btn btn-success btn-sm" onClick={agregarVenta}>
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lista de Ventas Seleccionadas */}
                    {ventasSeleccionadas.length > 0 && (
                        <div className="card mb-3">
                            <div className="card-header">
                                <strong>Ventas seleccionadas ({ventasSeleccionadas.length})</strong>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-container">
                                    <table className="table mb-0">
                                        <thead>
                                        <tr>
                                            <th>Folio</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {ventasSeleccionadas.map(venta => (
                                            <tr key={venta.id}>
                                                <td><code>{venta.folio}</code></td>
                                                <td>{formatDate(venta.fechaHora)}</td>
                                                <td className="text-success fw-bold">{formatMonto(venta.total)}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => eliminarVenta(venta.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                        <tfoot>
                                        <tr className="table-light">
                                            <td colSpan="2" className="text-end fw-bold">Total:</td>
                                            <td className="text-success fw-bold">{formatMonto(totalFactura)}</td>
                                            <td></td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Observaciones */}
                    <div className="mb-3">
                        <label className="form-label">Observaciones</label>
                        <textarea
                            className="form-control"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Información adicional (opcional)"
                        />
                    </div>

                    <div className="alert alert-info">
                        <small>
                            <strong>Información:</strong> La factura generará un CFDI 4.0 conforme a las especificaciones del SAT.
                            Cada venta solo puede facturarse una vez.
                        </small>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading || ventasSeleccionadas.length === 0}>
                            {loading ? 'Generando factura...' : 'Generar Factura'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/facturas')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SolicitarFactura;