import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordenesCompraService, proveedoresService, productosCatalogo } from '../../api/compras/auth';

const OrdenCompraForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [proveedores, setProveedores] = useState([]);
    const [formData, setFormData] = useState({
        proveedorId: '',
        fechaOrden: new Date().toISOString().split('T')[0],
        fechaEntrega: '',
        observaciones: '',
        detalles: []
    });
    const [detalleActual, setDetalleActual] = useState({
        tipoProducto: 'COMBUSTIBLE_MAGNA',
        productoId: '',
        productoNombre: '',
        cantidad: '',
        precioUnitario: ''
    });

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        try {
            const data = await proveedoresService.listarActivos();
            setProveedores(data);
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDetalleChange = (e) => {
        const { name, value } = e.target;
        setDetalleActual(prev => ({ ...prev, [name]: value }));
    };

    const agregarDetalle = () => {
        if (!detalleActual.productoId || !detalleActual.cantidad || !detalleActual.precioUnitario) {
            alert('Complete todos los campos del producto');
            return;
        }

        const nuevoDetalle = {
            tipoProducto: detalleActual.tipoProducto,
            productoId: parseInt(detalleActual.productoId),
            productoNombre: detalleActual.productoNombre,
            cantidad: parseFloat(detalleActual.cantidad),
            precioUnitario: parseFloat(detalleActual.precioUnitario)
        };

        setFormData(prev => ({
            ...prev,
            detalles: [...prev.detalles, nuevoDetalle]
        }));

        setDetalleActual({
            tipoProducto: 'COMBUSTIBLE_MAGNA',
            productoId: '',
            productoNombre: '',
            cantidad: '',
            precioUnitario: ''
        });
    };

    const eliminarDetalle = (index) => {
        setFormData(prev => ({
            ...prev,
            detalles: prev.detalles.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.proveedorId) {
            alert('Seleccione un proveedor');
            return;
        }

        if (formData.detalles.length === 0) {
            alert('Agregue al menos un producto');
            return;
        }

        setLoading(true);

        try {
            const ordenData = {
                proveedorId: parseInt(formData.proveedorId),
                fechaOrden: formData.fechaOrden,
                fechaEntrega: formData.fechaEntrega || null,
                observaciones: formData.observaciones || null,
                detalles: formData.detalles
            };

            const orden = await ordenesCompraService.crear(ordenData);
            alert(`Orden creada exitosamente\nFolio: ${orden.folioOrden}\nTotal: $${orden.total}`);
            navigate(`/ordenes-compra/${orden.id}`);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.errors || 'Error al crear orden';
            if (typeof errorMsg === 'object') {
                const firstError = Object.values(errorMsg)[0];
                alert(firstError);
            } else {
                alert(errorMsg);
            }
        }
        setLoading(false);
    };

    const calcularSubtotal = () => {
        return formData.detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0);
    };

    const calcularIVA = () => {
        return calcularSubtotal() * 0.16;
    };

    const calcularTotal = () => {
        return calcularSubtotal() + calcularIVA();
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto);
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2>Nueva Orden de Compra</h2>

                <form onSubmit={handleSubmit}>
                    {/* Datos de la orden */}
                    <h5 className="mt-3 mb-3">Datos de la Orden</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Proveedor *</label>
                            <select
                                className="form-select"
                                name="proveedorId"
                                value={formData.proveedorId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un proveedor</option>
                                {proveedores.map(prov => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Fecha de Orden *</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaOrden"
                                value={formData.fechaOrden}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Fecha de Entrega</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaEntrega"
                                value={formData.fechaEntrega}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Observaciones</label>
                            <textarea
                                className="form-control"
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                rows="2"
                                placeholder="Notas adicionales sobre esta orden"
                            />
                        </div>
                    </div>

                    {/* Productos */}
                    <h5 className="mt-4 mb-3">Productos</h5>
                    <div className="card bg-light mb-3">
                        <div className="card-body">
                            <div className="row g-2">
                                <div className="col-md-3">
                                    <label className="form-label">Tipo</label>
                                    <select
                                        className="form-select"
                                        name="tipoProducto"
                                        value={detalleActual.tipoProducto}
                                        onChange={handleDetalleChange}
                                    >
                                        {productosCatalogo.tiposProducto.map(tipo => (
                                            <option key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">ID Producto</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="productoId"
                                        value={detalleActual.productoId}
                                        onChange={handleDetalleChange}
                                        placeholder="ID"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="productoNombre"
                                        value={detalleActual.productoNombre}
                                        onChange={handleDetalleChange}
                                        placeholder="Nombre del producto"
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Cantidad</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        className="form-control"
                                        name="cantidad"
                                        value={detalleActual.cantidad}
                                        onChange={handleDetalleChange}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Precio Unitario</label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            name="precioUnitario"
                                            value={detalleActual.precioUnitario}
                                            onChange={handleDetalleChange}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <button type="button" className="btn btn-primary" onClick={agregarDetalle}>
                                    + Agregar Producto
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista de productos agregados */}
                    {formData.detalles.length > 0 && (
                        <div className="card mb-3">
                            <div className="card-header">
                                <strong>Productos agregados ({formData.detalles.length})</strong>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-container">
                                    <table className="table mb-0">
                                        <thead>
                                        <tr>
                                            <th>Tipo</th>
                                            <th>ID</th>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unit.</th>
                                            <th>Importe</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {formData.detalles.map((detalle, idx) => (
                                            <tr key={idx}>
                                                <td>{productosCatalogo.tiposProducto.find(t => t.value === detalle.tipoProducto)?.label || detalle.tipoProducto}</td>
                                                <td>{detalle.productoId}</td>
                                                <td>{detalle.productoNombre}</td>
                                                <td className="text-end">{detalle.cantidad.toLocaleString()}</td>
                                                <td className="text-end">{formatMonto(detalle.precioUnitario)}</td>
                                                <td className="text-end">{formatMonto(detalle.cantidad * detalle.precioUnitario)}</td>
                                                <td>
                                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => eliminarDetalle(idx)}>
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                        <tfoot>
                                        <tr className="table-light">
                                            <td colSpan="5" className="text-end fw-bold">Subtotal:</td>
                                            <td className="text-end fw-bold">{formatMonto(calcularSubtotal())}</td>
                                            <td></td>
                                        </tr>
                                        <tr className="table-light">
                                            <td colSpan="5" className="text-end fw-bold">IVA (16%):</td>
                                            <td className="text-end fw-bold">{formatMonto(calcularIVA())}</td>
                                            <td></td>
                                        </tr>
                                        <tr className="table-light">
                                            <td colSpan="5" className="text-end fw-bold">Total:</td>
                                            <td className="text-end fw-bold text-success">{formatMonto(calcularTotal())}</td>
                                            <td></td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="alert alert-info">
                        <small>
                            <strong>Nota:</strong> Al recibir la orden, el inventario se actualizará automáticamente.
                            Para combustibles, se actualizará el tanque correspondiente. Para aceites, se aumentará el stock.
                        </small>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading || formData.detalles.length === 0}>
                            {loading ? 'Guardando...' : 'Crear Orden'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/ordenes-compra')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrdenCompraForm;