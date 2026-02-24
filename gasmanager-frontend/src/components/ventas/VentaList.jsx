// src/components/ventas/VentaList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ventaService from '../../services/ventaService';

const VentaList = () => {
    const [ventas, setVentas] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalVentas, setTotalVentas] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadisticas, setEstadisticas] = useState(null);
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        estado: '',
        despachadorId: ''
    });

    const navigate = useNavigate();

    // Cargar ventas
    const fetchVentas = async () => {
        try {
            setLoading(true);
            const response = await ventaService.getAllVentas(page, size);

            setVentas(response.data.ventas || []);
            setTotalVentas(response.data.totalItems || 0);
        } catch (error) {
            console.error('Error al cargar ventas:', error);
            alert('Error al cargar ventas. Verifica que el microservicio esté ejecutándose.');
        } finally {
            setLoading(false);
        }
    };

    // Cargar estadísticas
    const fetchEstadisticas = async () => {
        try {
            const response = await ventaService.getEstadisticas();
            setEstadisticas(response.data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    useEffect(() => {
        fetchVentas();
        fetchEstadisticas();
    }, [page, size]);

    // Buscar por folio
    const handleSearch = async () => {
        if (searchTerm.trim()) {
            try {
                const response = await ventaService.getVentaByFolio(searchTerm);
                if (response.data) {
                    setVentas([response.data]);
                    setTotalVentas(1);
                } else {
                    alert('Venta no encontrada');
                    fetchVentas();
                }
            } catch (error) {
                console.error('Error buscando venta:', error);
                alert('Venta no encontrada');
                fetchVentas();
            }
        } else {
            fetchVentas();
        }
    };

    // Ver detalles
    const handleViewDetails = (id) => {
        navigate(`/ventas/${id}`);
    };

    // Editar venta
    const handleEdit = (id) => {
        navigate(`/ventas/${id}/editar`);
    };

    // Cancelar venta
    const handleCancel = async (id) => {
        if (window.confirm('¿Estás seguro de cancelar esta venta?')) {
            try {
                await ventaService.deleteVenta(id);
                alert('Venta cancelada exitosamente');
                fetchVentas();
                fetchEstadisticas();
            } catch (error) {
                console.error('Error cancelando venta:', error);
                alert('Error al cancelar venta');
            }
        }
    };

    // Formatear fecha
    const formatFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-MX') + ' ' + fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    };

    // Formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount || 0);
    };

    // Estilo del estado
    const getEstadoBadge = (estado) => {
        switch (estado) {
            case 'COMPLETADA':
                return 'badge bg-success';
            case 'PENDIENTE':
                return 'badge bg-warning text-dark';
            case 'CANCELADA':
                return 'badge bg-danger';
            case 'FACTURADA':
                return 'badge bg-info';
            case 'CREDITO_PENDIENTE':
                return 'badge bg-secondary';
            default:
                return 'badge bg-light text-dark';
        }
    };

    // Estilo del método de pago
    const getMetodoPagoBadge = (metodo) => {
        switch (metodo) {
            case 'EFECTIVO':
                return 'badge bg-success';
            case 'TARJETA':
                return 'badge bg-primary';
            case 'TRANSFERENCIA':
                return 'badge bg-info';
            case 'CREDITO':
                return 'badge bg-warning text-dark';
            default:
                return 'badge bg-secondary';
        }
    };

    // Manejar cambio de página
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Manejar cambio de tamaño de página
    const handleSizeChange = (e) => {
        setSize(parseInt(e.target.value));
        setPage(0);
    };

    // Aplicar filtros
    const handleApplyFilters = () => {
        setPage(0);
        // Aquí implementarías la lógica de filtrado
        console.log('Aplicando filtros:', filtros);
    };

    // Limpiar filtros
    const handleClearFilters = () => {
        setFiltros({
            fechaInicio: '',
            fechaFin: '',
            estado: '',
            despachadorId: ''
        });
        setPage(0);
        fetchVentas();
    };

    if (loading && ventas.length === 0) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <span className="ms-3">Cargando ventas...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Gestión de Ventas</h1>
                <button
                    className="btn btn-success"
                    onClick={() => navigate('/ventas/nueva')}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nueva Venta
                </button>
            </div>

            {/* Tarjetas de estadísticas */}
            {estadisticas && (
                <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                        <div className="card border-primary">
                            <div className="card-body">
                                <h5 className="card-title text-primary">Ventas Hoy</h5>
                                <h2 className="card-text">{estadisticas.ventasHoy || 0}</h2>
                                <p className="card-text text-muted">
                                    Total: {formatCurrency(estadisticas.totalHoy || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-success">
                            <div className="card-body">
                                <h5 className="card-title text-success">Completadas</h5>
                                <h2 className="card-text">{estadisticas.ventasCompletadas || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-warning">
                            <div className="card-body">
                                <h5 className="card-title text-warning">Pendientes</h5>
                                <h2 className="card-text">{estadisticas.ventasPendientes || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-danger">
                            <div className="card-body">
                                <h5 className="card-title text-danger">Canceladas</h5>
                                <h2 className="card-text">{estadisticas.ventasCanceladas || 0}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Barra de búsqueda y filtros */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        {/* Búsqueda por folio */}
                        <div className="col-md-4">
                            <label className="form-label">Buscar por folio</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej: VENTA-2025-001234"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={handleSearch}
                                >
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>

                        {/* Filtro por estado */}
                        <div className="col-md-3">
                            <label className="form-label">Estado</label>
                            <select
                                className="form-select"
                                value={filtros.estado}
                                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                            >
                                <option value="">Todos</option>
                                <option value="COMPLETADA">Completadas</option>
                                <option value="PENDIENTE">Pendientes</option>
                                <option value="CANCELADA">Canceladas</option>
                                <option value="FACTURADA">Facturadas</option>
                            </select>
                        </div>

                        {/* Botones de acción */}
                        <div className="col-md-5 d-flex align-items-end">
                            <button
                                className="btn btn-primary me-2"
                                onClick={handleApplyFilters}
                            >
                                <i className="bi bi-funnel me-2"></i>
                                Aplicar Filtros
                            </button>
                            <button
                                className="btn btn-outline-secondary me-2"
                                onClick={handleClearFilters}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                Limpiar
                            </button>
                            <button
                                className="btn btn-outline-success"
                                onClick={() => alert('Exportar a Excel - En desarrollo')}
                            >
                                <i className="bi bi-file-earmark-excel me-2"></i>
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de ventas */}
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>Folio</th>
                                <th>Fecha/Hora</th>
                                <th>Cliente</th>
                                <th>Despachador</th>
                                <th>Total</th>
                                <th>Método Pago</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ventas.length > 0 ? (
                                ventas.map((venta) => (
                                    <tr key={venta.id}>
                                        <td>
                                            <strong>{venta.folio}</strong>
                                        </td>
                                        <td>{formatFecha(venta.fechaHora)}</td>
                                        <td>
                                            {venta.clienteNombre || 'Cliente ocasional'}
                                            {venta.clienteRfc && <div className="small text-muted">RFC: {venta.clienteRfc}</div>}
                                        </td>
                                        <td>{venta.despachadorNombre}</td>
                                        <td>{formatCurrency(venta.total)}</td>
                                        <td>
                                                <span className={getMetodoPagoBadge(venta.metodoPago)}>
                                                    {venta.metodoPago}
                                                </span>
                                        </td>
                                        <td>
                                                <span className={getEstadoBadge(venta.estado)}>
                                                    {venta.estado}
                                                </span>
                                        </td>
                                        <td>
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => handleViewDetails(venta.id)}
                                                    title="Ver detalles"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning"
                                                    onClick={() => handleEdit(venta.id)}
                                                    disabled={venta.estado === 'CANCELADA'}
                                                    title="Editar"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => handleCancel(venta.id)}
                                                    disabled={venta.estado === 'CANCELADA'}
                                                    title="Cancelar"
                                                >
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        <div className="text-muted">
                                            <i className="bi bi-inbox display-6"></i>
                                            <p className="mt-2">No hay ventas registradas</p>
                                            <button
                                                className="btn btn-primary mt-2"
                                                onClick={() => navigate('/ventas/nueva')}
                                            >
                                                <i className="bi bi-plus-circle me-2"></i>
                                                Crear primera venta
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {ventas.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <span className="text-muted">
                                    Mostrando {ventas.length} de {totalVentas} ventas
                                </span>
                            </div>
                            <div className="d-flex align-items-center">
                                <select
                                    className="form-select form-select-sm me-3"
                                    style={{width: 'auto'}}
                                    value={size}
                                    onChange={handleSizeChange}
                                >
                                    <option value="5">5 por página</option>
                                    <option value="10">10 por página</option>
                                    <option value="25">25 por página</option>
                                    <option value="50">50 por página</option>
                                </select>

                                <nav>
                                    <ul className="pagination mb-0">
                                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page - 1)}
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                        </li>

                                        {Array.from({ length: Math.ceil(totalVentas / size) }, (_, i) => i)
                                            .filter(i => i >= Math.max(0, page - 2) && i <= Math.min(Math.ceil(totalVentas / size) - 1, page + 2))
                                            .map(i => (
                                                <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(i)}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))
                                        }

                                        <li className={`page-item ${page >= Math.ceil(totalVentas / size) - 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page + 1)}
                                            >
                                                <i className="bi bi-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Nota del microservicio */}
            <div className="alert alert-info mt-4">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Nota:</strong> Este módulo se conecta al microservicio de ventas en el puerto 8091.
                Asegúrate de que el microservicio esté ejecutándose para ver los datos.
            </div>
        </div>
    );
};

export default VentaList;