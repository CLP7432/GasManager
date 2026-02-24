// src/components/ventas/VentaForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ventaService from '../../services/ventaService';
import { useAuth } from '../../context/AuthContext';

const VentaForm = () => {
    const { id } = useParams(); // Si hay ID, es edición
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [detalles, setDetalles] = useState([]);

    // Datos de la venta
    const [ventaData, setVentaData] = useState({
        folio: '',
        estado: 'PENDIENTE',
        metodoPago: 'EFECTIVO',
        subtotal: 0,
        iva: 0,
        total: 0,
        despachadorId: auth?.idUsuario || '',
        despachadorNombre: auth?.nombre || '',
        clienteId: '',
        clienteNombre: '',
        clienteRfc: '',
        turnoId: '',
        surtidorId: 1,
        surtidorNumero: 'D01',
        facturada: false,
        folioFactura: '',
        esCredito: false,
        creditoId: '',
        puntosObtenidos: 0,
        puntosCanjeados: 0,
        observaciones: ''
    });

    // Datos para nuevo detalle
    const [nuevoDetalle, setNuevoDetalle] = useState({
        tipoProducto: 'COMBUSTIBLE_GASOLINA_MAGNA',
        productoId: '',
        productoNombre: '',
        cantidad: 1,
        precioUnitario: 0,
        importe: 0,
        unidadMedida: 'LITROS'
    });

    // Opciones para selectores
    const tiposProducto = [
        { value: 'COMBUSTIBLE_GASOLINA_MAGNA', label: 'Gasolina Magna' },
        { value: 'COMBUSTIBLE_GASOLINA_PREMIUM', label: 'Gasolina Premium' },
        { value: 'COMBUSTIBLE_DIESEL', label: 'Diesel' },
        { value: 'ACEITE_MOTOR', label: 'Aceite Motor' },
        { value: 'ADITIVO', label: 'Aditivo' },
        { value: 'OTRO', label: 'Otro' }
    ];

    const metodosPago = [
        { value: 'EFECTIVO', label: 'Efectivo' },
        { value: 'TARJETA', label: 'Tarjeta' },
        { value: 'TRANSFERENCIA', label: 'Transferencia' },
        { value: 'CREDITO', label: 'Crédito' }
    ];

    const estadosVenta = [
        { value: 'PENDIENTE', label: 'Pendiente' },
        { value: 'COMPLETADA', label: 'Completada' },
        { value: 'FACTURADA', label: 'Facturada' },
        { value: 'CREDITO_PENDIENTE', label: 'Crédito Pendiente' }
    ];

    const surtidores = [
        { id: 1, numero: 'D01', nombre: 'Dispensario 1 - Magna' },
        { id: 2, numero: 'D02', nombre: 'Dispensario 2 - Premium' },
        { id: 3, numero: 'D03', nombre: 'Dispensario 3 - Diesel' }
    ];

    // Cargar venta si es edición
    useEffect(() => {
        if (id) {
            fetchVenta();
        } else {
            // Generar folio automático para nueva venta
            const fecha = new Date();
            const folio = `VENTA-${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
            setVentaData(prev => ({ ...prev, folio }));
        }
    }, [id]);

    const fetchVenta = async () => {
        try {
            setLoading(true);
            const response = await ventaService.getVentaById(id);
            const venta = response.data;

            setVentaData({
                folio: venta.folio || '',
                estado: venta.estado || 'PENDIENTE',
                metodoPago: venta.metodoPago || 'EFECTIVO',
                subtotal: venta.subtotal || 0,
                iva: venta.iva || 0,
                total: venta.total || 0,
                despachadorId: venta.despachadorId || auth?.idUsuario || '',
                despachadorNombre: venta.despachadorNombre || auth?.nombre || '',
                clienteId: venta.clienteId || '',
                clienteNombre: venta.clienteNombre || '',
                clienteRfc: venta.clienteRfc || '',
                turnoId: venta.turnoId || '',
                surtidorId: venta.surtidorId || 1,
                surtidorNumero: venta.surtidorNumero || 'D01',
                facturada: venta.facturada || false,
                folioFactura: venta.folioFactura || '',
                esCredito: venta.esCredito || false,
                creditoId: venta.creditoId || '',
                puntosObtenidos: venta.puntosObtenidos || 0,
                puntosCanjeados: venta.puntosCanjeados || 0,
                observaciones: venta.observaciones || ''
            });

            // Aquí cargaríamos los detalles si la API los incluye
            // setDetalles(venta.detalles || []);

        } catch (error) {
            console.error('Error cargando venta:', error);
            alert('Error al cargar la venta');
            navigate('/ventas');
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambios en los campos de la venta
    const handleVentaChange = (e) => {
        const { name, value, type, checked } = e.target;
        setVentaData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Calcular total si cambia subtotal o IVA
        if (name === 'subtotal' || name === 'iva') {
            const subtotal = name === 'subtotal' ? parseFloat(value) || 0 : prev.subtotal;
            const iva = name === 'iva' ? parseFloat(value) || 0 : prev.iva;
            setVentaData(prevData => ({
                ...prevData,
                total: subtotal + iva
            }));
        }
    };

    // Manejar cambios en el nuevo detalle
    const handleDetalleChange = (e) => {
        const { name, value } = e.target;
        const nuevoValor = name === 'cantidad' || name === 'precioUnitario' ?
            parseFloat(value) || 0 : value;

        setNuevoDetalle(prev => {
            const updated = { ...prev, [name]: nuevoValor };

            // Calcular importe automáticamente
            if (name === 'cantidad' || name === 'precioUnitario') {
                updated.importe = updated.cantidad * updated.precioUnitario;
            }

            return updated;
        });
    };

    // Agregar nuevo detalle a la lista
    const agregarDetalle = () => {
        if (!nuevoDetalle.productoNombre || nuevoDetalle.cantidad <= 0 || nuevoDetalle.precioUnitario <= 0) {
            alert('Por favor completa todos los campos del detalle');
            return;
        }

        const nuevoDetalleConId = {
            ...nuevoDetalle,
            id: detalles.length + 1 // ID temporal
        };

        setDetalles([...detalles, nuevoDetalleConId]);

        // Calcular nuevos totales
        const nuevoSubtotal = ventaData.subtotal + nuevoDetalleConId.importe;
        const nuevoIva = nuevoSubtotal * 0.16; // 16% IVA
        const nuevoTotal = nuevoSubtotal + nuevoIva;

        setVentaData(prev => ({
            ...prev,
            subtotal: nuevoSubtotal,
            iva: nuevoIva,
            total: nuevoTotal
        }));

        // Resetear formulario de detalle
        setNuevoDetalle({
            tipoProducto: 'COMBUSTIBLE_GASOLINA_MAGNA',
            productoId: '',
            productoNombre: '',
            cantidad: 1,
            precioUnitario: 0,
            importe: 0,
            unidadMedida: 'LITROS'
        });
    };

    // Eliminar detalle
    const eliminarDetalle = (index) => {
        const detalleAEliminar = detalles[index];
        const nuevosDetalles = detalles.filter((_, i) => i !== index);

        // Recalcular totales
        const nuevoSubtotal = ventaData.subtotal - detalleAEliminar.importe;
        const nuevoIva = nuevoSubtotal * 0.16;
        const nuevoTotal = nuevoSubtotal + nuevoIva;

        setDetalles(nuevosDetalles);
        setVentaData(prev => ({
            ...prev,
            subtotal: nuevoSubtotal,
            iva: nuevoIva,
            total: nuevoTotal
        }));
    };

    // Validar formulario
    const validarFormulario = () => {
        if (!ventaData.folio.trim()) {
            alert('El folio es requerido');
            return false;
        }
        if (detalles.length === 0) {
            alert('Debe agregar al menos un producto a la venta');
            return false;
        }
        if (!ventaData.surtidorId) {
            alert('Debe seleccionar un dispensario');
            return false;
        }
        return true;
    };

    // Guardar venta
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        try {
            setSubmitting(true);

            // Preparar datos para enviar
            const ventaParaEnviar = {
                ...ventaData,
                detalles: detalles.map(d => ({
                    tipoProducto: d.tipoProducto,
                    productoId: d.productoId,
                    productoNombre: d.productoNombre,
                    cantidad: d.cantidad,
                    precioUnitario: d.precioUnitario,
                    importe: d.importe,
                    unidadMedida: d.unidadMedida
                }))
            };

            let response;
            if (id) {
                // Actualizar venta existente
                response = await ventaService.updateVenta(id, ventaParaEnviar);
                alert('Venta actualizada exitosamente');
            } else {
                // Crear nueva venta
                response = await ventaService.createVenta(ventaParaEnviar);
                alert('Venta creada exitosamente');
            }

            // Redirigir a la lista de ventas
            navigate('/ventas');

        } catch (error) {
            console.error('Error guardando venta:', error);
            alert(`Error al guardar la venta: ${error.response?.data?.message || error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Cancelar y volver
    const handleCancel = () => {
        if (window.confirm('¿Estás seguro de cancelar? Los cambios no guardados se perderán.')) {
            navigate('/ventas');
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <span className="ms-3">Cargando venta...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{id ? 'Editar Venta' : 'Nueva Venta'}</h1>
                <button
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    {/* Columna izquierda - Datos de la venta */}
                    <div className="col-md-6">
                        <div className="card mb-4">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-receipt me-2"></i>
                                    Información de la Venta
                                </h5>
                            </div>
                            <div className="card-body">
                                {/* Folio */}
                                <div className="mb-3">
                                    <label className="form-label">Folio *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="folio"
                                        value={ventaData.folio}
                                        onChange={handleVentaChange}
                                        required
                                        disabled={!!id}
                                    />
                                </div>

                                {/* Estado y Método de Pago */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Estado *</label>
                                        <select
                                            className="form-select"
                                            name="estado"
                                            value={ventaData.estado}
                                            onChange={handleVentaChange}
                                            required
                                        >
                                            {estadosVenta.map(estado => (
                                                <option key={estado.value} value={estado.value}>
                                                    {estado.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Método de Pago *</label>
                                        <select
                                            className="form-select"
                                            name="metodoPago"
                                            value={ventaData.metodoPago}
                                            onChange={handleVentaChange}
                                            required
                                        >
                                            {metodosPago.map(metodo => (
                                                <option key={metodo.value} value={metodo.value}>
                                                    {metodo.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Despachador */}
                                <div className="mb-3">
                                    <label className="form-label">Despachador</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={ventaData.despachadorNombre}
                                        readOnly
                                    />
                                    <small className="text-muted">Usuario actual: {auth?.nombre}</small>
                                </div>

                                {/* Cliente */}
                                <div className="mb-3">
                                    <label className="form-label">Cliente (opcional)</label>
                                    <div className="row g-2">
                                        <div className="col-md-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nombre del cliente"
                                                name="clienteNombre"
                                                value={ventaData.clienteNombre}
                                                onChange={handleVentaChange}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="RFC"
                                                name="clienteRfc"
                                                value={ventaData.clienteRfc}
                                                onChange={handleVentaChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dispensario */}
                                <div className="mb-3">
                                    <label className="form-label">Dispensario *</label>
                                    <select
                                        className="form-select"
                                        name="surtidorId"
                                        value={ventaData.surtidorId}
                                        onChange={handleVentaChange}
                                        required
                                    >
                                        <option value="">Seleccionar dispensario</option>
                                        {surtidores.map(surtidor => (
                                            <option key={surtidor.id} value={surtidor.id}>
                                                {surtidor.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Crédito y Facturación */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="esCredito"
                                                checked={ventaData.esCredito}
                                                onChange={handleVentaChange}
                                                id="esCreditoCheck"
                                            />
                                            <label className="form-check-label" htmlFor="esCreditoCheck">
                                                Es a Crédito
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="facturada"
                                                checked={ventaData.facturada}
                                                onChange={handleVentaChange}
                                                id="facturadaCheck"
                                            />
                                            <label className="form-check-label" htmlFor="facturadaCheck">
                                                Facturada
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Observaciones */}
                                <div className="mb-3">
                                    <label className="form-label">Observaciones</label>
                                    <textarea
                                        className="form-control"
                                        name="observaciones"
                                        value={ventaData.observaciones}
                                        onChange={handleVentaChange}
                                        rows="3"
                                        placeholder="Notas adicionales sobre la venta..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Totales y Detalles */}
                    <div className="col-md-6">
                        {/* Totales */}
                        <div className="card mb-4">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-calculator me-2"></i>
                                    Totales
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <strong>Subtotal:</strong>
                                    </div>
                                    <div className="col-6 text-end">
                                        ${ventaData.subtotal.toFixed(2)}
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <strong>IVA (16%):</strong>
                                    </div>
                                    <div className="col-6 text-end">
                                        ${ventaData.iva.toFixed(2)}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <strong>Total:</strong>
                                    </div>
                                    <div className="col-6 text-end">
                                        <h5 className="text-success">${ventaData.total.toFixed(2)}</h5>
                                    </div>
                                </div>
                                <div className="alert alert-info">
                                    <small>
                                        <i className="bi bi-info-circle me-1"></i>
                                        Los totales se calculan automáticamente al agregar productos
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Agregar Producto */}
                        <div className="card mb-4">
                            <div className="card-header bg-warning">
                                <h5 className="mb-0">
                                    <i className="bi bi-cart-plus me-2"></i>
                                    Agregar Producto
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <label className="form-label">Tipo Producto</label>
                                        <select
                                            className="form-select"
                                            name="tipoProducto"
                                            value={nuevoDetalle.tipoProducto}
                                            onChange={handleDetalleChange}
                                        >
                                            {tiposProducto.map(tipo => (
                                                <option key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Producto *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="productoNombre"
                                            value={nuevoDetalle.productoNombre}
                                            onChange={handleDetalleChange}
                                            placeholder="Ej: Gasolina Magna"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Cantidad *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="cantidad"
                                            value={nuevoDetalle.cantidad}
                                            onChange={handleDetalleChange}
                                            min="0.001"
                                            step="0.001"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Precio Unitario *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="precioUnitario"
                                            value={nuevoDetalle.precioUnitario}
                                            onChange={handleDetalleChange}
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Importe</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={`$${nuevoDetalle.importe.toFixed(2)}`}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                    <div className="col-12">
                                        <button
                                            type="button"
                                            className="btn btn-success w-100"
                                            onClick={agregarDetalle}
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Agregar a la Venta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Productos Agregados */}
                        <div className="card">
                            <div className="card-header bg-info text-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-list-check me-2"></i>
                                    Productos en la Venta ({detalles.length})
                                </h5>
                            </div>
                            <div className="card-body">
                                {detalles.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio</th>
                                                <th>Importe</th>
                                                <th></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {detalles.map((detalle, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <small>{detalle.productoNombre}</small>
                                                    </td>
                                                    <td>{detalle.cantidad}</td>
                                                    <td>${detalle.precioUnitario.toFixed(2)}</td>
                                                    <td>
                                                        <strong>${detalle.importe.toFixed(2)}</strong>
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => eliminarDetalle(index)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-3">
                                        <i className="bi bi-cart display-6"></i>
                                        <p className="mt-2">No hay productos agregados</p>
                                        <small>Agrega productos usando el formulario de arriba</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="card mt-4">
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={handleCancel}
                                disabled={submitting}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancelar
                            </button>

                            <div>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary me-2"
                                    onClick={() => alert('Vista previa - En desarrollo')}
                                    disabled={submitting}
                                >
                                    <i className="bi bi-eye me-2"></i>
                                    Vista Previa
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting || detalles.length === 0}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-save me-2"></i>
                                            {id ? 'Actualizar Venta' : 'Guardar Venta'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Nota del microservicio */}
            <div className="alert alert-info mt-4">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Nota:</strong> Este formulario se conecta al microservicio de ventas en el puerto 8091.
                Los datos se guardarán en la base de datos del microservicio.
            </div>
        </div>
    );
};

export default VentaForm;