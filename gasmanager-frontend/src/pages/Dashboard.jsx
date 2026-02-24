import {useAuth} from '../context/AuthContext.jsx';
import {useNavigate} from 'react-router-dom';

export default function Dashboard() {
    const {auth, logout} = useAuth();
    const navigate = useNavigate();

    // Función para determinar qué módulos puede ver según su rol
    const canAccessVentas = ['ADMINISTRADOR', 'DESPACHADOR', 'SUPERVISOR'].includes(auth?.rol);
    const canAccessReportes = ['ADMINISTRADOR', 'SUPERVISOR', 'CONTADOR'].includes(auth?.rol);
    const canAccessTurnos = ['ADMINISTRADOR', 'SUPERVISOR'].includes(auth?.rol);

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Dashboard GasManager</h2>
                    <button
                        onClick={logout}
                        className="btn btn-danger btn-sm"
                    >
                        Cerrar Sesión
                    </button>
                </div>
                <div className="card-body">
                    <h4>Bienvenido, {auth?.nombre || auth?.correo}!</h4>

                    <div className="row mt-4">
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Información del Usuario</h5>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <strong>Correo:</strong> {auth?.correo}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Rol:</strong>
                                            <span className="badge bg-primary ms-2">
                                                {auth?.rol}
                                            </span>
                                        </li>
                                        <li className="list-group-item">
                                            <strong>ID Usuario:</strong> {auth?.idUsuario}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Token JWT:</strong>
                                            <div className="mt-2">
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows="3"
                                                    readOnly
                                                    value={auth?.token || 'No hay token'}
                                                    onClick={(e) => e.target.select()}
                                                />
                                                <small className="text-muted">Copia este token para usar en
                                                    Insomnia</small>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">Acciones Rápidas</h5>
                                    <div className="d-grid gap-2">
                                        {/* BOTÓN PARA VER VENTAS */}
                                        {canAccessVentas && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => navigate('/ventas')}
                                            >
                                                Ver Ventas
                                            </button>
                                        )}

                                        {/* BOTÓN PARA REGISTRAR VENTA (solo despachadores y admin) */}
                                        {['ADMINISTRADOR', 'DESPACHADOR'].includes(auth?.rol) && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => navigate('/ventas/nueva')}
                                            >
                                                Registrar Venta
                                            </button>
                                        )}

                                        {/* BOTÓN PARA GESTIONAR TURNOS (solo supervisores y admin) */}
                                        {canAccessTurnos && (
                                            <button
                                                className="btn btn-info"
                                                onClick={() => navigate('/turnos')}
                                            >
                                                Gestionar Turnos
                                            </button>
                                        )}

                                        {/* BOTÓN PARA REPORTES */}
                                        {canAccessReportes && (
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => navigate('/reportes')}
                                            >
                                                Generar Reporte
                                            </button>
                                        )}

                                        {/* BOTÓN PARA ADMINISTRAR USUARIOS (solo admin) */}
                                        {auth?.rol === 'ADMINISTRADOR' && (
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => navigate('/admin/usuarios')}
                                            >
                                                Ver Todos los Usuarios
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard según rol con módulos específicos */}
                    <div className="card mt-4">
                        <div className="card-header">
                            <h5 className="mb-0">Módulos Disponibles</h5>
                        </div>
                        <div className="card-body">
                            {auth?.rol === 'ADMINISTRADOR' && (
                                <div className="alert alert-info">
                                    <h6>Panel de Administrador</h6>
                                    <p>Acceso completo a todos los módulos del sistema</p>
                                    <div className="mt-2">
                                        <button
                                            className="btn btn-sm btn-outline-info me-2"
                                            onClick={() => navigate('/ventas')}
                                        >
                                            <i className="bi bi-cash-stack me-1"></i> Ventas
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-info me-2"
                                            onClick={() => navigate('/turnos')}
                                        >
                                            <i className="bi bi-clock me-1"></i> Turnos
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-info me-2"
                                            onClick={() => navigate('/reportes')}
                                        >
                                            <i className="bi bi-graph-up me-1"></i> Reportes
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-info"
                                            onClick={() => navigate('/admin/usuarios')}
                                        >
                                            <i className="bi bi-people me-1"></i> Usuarios
                                        </button>
                                    </div>
                                </div>
                            )}

                            {auth?.rol === 'DESPACHADOR' && (
                                <div className="alert alert-success">
                                    <h6>Panel de Despachador</h6>
                                    <p>Puedes registrar ventas y consultar inventario</p>
                                    <div className="mt-2">
                                        <button
                                            className="btn btn-sm btn-outline-success me-2"
                                            onClick={() => navigate('/ventas/nueva')}
                                        >
                                            <i className="bi bi-plus-circle me-1"></i> Nueva Venta
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-success me-2"
                                            onClick={() => navigate('/ventas')}
                                        >
                                            <i className="bi bi-list-check me-1"></i> Mis Ventas
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() => alert('Inventario - En desarrollo')}
                                        >
                                            <i className="bi bi-box-seam me-1"></i> Inventario
                                        </button>
                                    </div>
                                </div>
                            )}

                            {auth?.rol === 'SUPERVISOR' && (
                                <div className="alert alert-warning">
                                    <h6>Panel de Supervisor</h6>
                                    <p>Supervisión de operaciones y validación de cortes</p>
                                    <div className="mt-2">
                                        <button
                                            className="btn btn-sm btn-outline-warning me-2"
                                            onClick={() => navigate('/ventas')}
                                        >
                                            <i className="bi bi-eye me-1"></i> Supervisar Ventas
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-warning me-2"
                                            onClick={() => navigate('/turnos')}
                                        >
                                            <i className="bi bi-check-circle me-1"></i> Validar Turnos
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={() => navigate('/reportes')}
                                        >
                                            <i className="bi bi-file-earmark-bar-graph me-1"></i> Reportes Diarios
                                        </button>
                                    </div>
                                </div>
                            )}

                            {auth?.rol === 'CONTADOR' && (
                                <div className="alert alert-secondary">
                                    <h6>Panel de Contador</h6>
                                    <p>Acceso a facturación, créditos y reportes financieros</p>
                                    <div className="mt-2">
                                        <button
                                            className="btn btn-sm btn-outline-secondary me-2"
                                            onClick={() => alert('Facturación - En desarrollo')}
                                        >
                                            <i className="bi bi-receipt me-1"></i> Facturación
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-secondary me-2"
                                            onClick={() => navigate('/reportes')}
                                        >
                                            <i className="bi bi-calculator me-1"></i> Reportes Financieros
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}