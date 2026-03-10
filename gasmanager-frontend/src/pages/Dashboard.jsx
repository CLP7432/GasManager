import {useAuth} from '../context/AuthContext.jsx';
import {useNavigate} from 'react-router-dom';

export default function Dashboard() {
    const {auth, logout} = useAuth();
    const navigate = useNavigate();

    // Variables de permisos - TODAS incluyen ROLE_ADMIN
    const canAccessVentas = ['ROLE_ADMIN', 'ADMINISTRADOR', 'DESPACHADOR', 'SUPERVISOR'].includes(auth?.rol);
    const canRegistrarVenta = ['ROLE_ADMIN', 'ADMINISTRADOR', 'DESPACHADOR'].includes(auth?.rol);
    const canAccessTurnos = ['ROLE_ADMIN', 'ADMINISTRADOR', 'SUPERVISOR'].includes(auth?.rol);
    const canAccessReportes = ['ROLE_ADMIN', 'ADMINISTRADOR', 'SUPERVISOR', 'CONTADOR'].includes(auth?.rol);
    const canAccessUsuarios = ['ROLE_ADMIN', 'ADMINISTRADOR'].includes(auth?.rol);
    const canAccessPermisos = ['ROLE_ADMIN', 'ADMINISTRADOR'].includes(auth?.rol);
    const canAccessRoles = ['ROLE_ADMIN', 'ADMINISTRADOR'].includes(auth?.rol);

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
                                                <small className="text-muted">Copia este token para usar en Insomnia</small>
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
                                        {canAccessVentas && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => navigate('/ventas')}
                                            >
                                                Ver Ventas
                                            </button>
                                        )}
                                        {canRegistrarVenta && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => navigate('/ventas/nueva')}
                                            >
                                                Registrar Venta
                                            </button>
                                        )}
                                        {canAccessTurnos && (
                                            <button
                                                className="btn btn-info"
                                                onClick={() => navigate('/turnos')}
                                            >
                                                Gestionar Turnos
                                            </button>
                                        )}
                                        {canAccessReportes && (
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => navigate('/reportes')}
                                            >
                                                Generar Reporte
                                            </button>
                                        )}
                                        {canAccessUsuarios && (
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

                    {/* Panel de Administrador - Se muestra si es ROLE_ADMIN o ADMINISTRADOR */}
                    {['ROLE_ADMIN', 'ADMINISTRADOR'].includes(auth?.rol) && (
                        <div className="card mt-4">
                            <div className="card-header">
                                <h5 className="mb-0">Panel de Administrador</h5>
                            </div>
                            <div className="card-body">
                                <div className="alert alert-info">
                                    <h6>Acceso completo a todos los módulos</h6>
                                    <div className="mt-2 d-flex flex-wrap gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-info"
                                            onClick={() => navigate('/ventas')}
                                        >
                                            Ventas
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-info"
                                            onClick={() => navigate('/turnos')}
                                        >
                                            Turnos
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-info"
                                            onClick={() => navigate('/reportes')}
                                        >
                                            Reportes
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-info"
                                            onClick={() => navigate('/admin/usuarios')}
                                        >
                                            Usuarios
                                        </button>

                                        {/* ===== NUEVOS BOTONES PARA PERMISOS Y ROLES ===== */}
                                        {canAccessPermisos && (
                                            <button
                                                className="btn btn-sm btn-outline-warning"
                                                onClick={() => navigate('/admin/permisos')}
                                            >
                                                <i className="bi bi-shield-lock me-1"></i>
                                                Permisos
                                            </button>
                                        )}

                                        {canAccessRoles && (
                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() => navigate('/admin/roles')}
                                            >
                                                <i className="bi bi-people-fill me-1"></i>
                                                Roles
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}