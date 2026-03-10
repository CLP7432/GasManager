import {Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import {useAuth} from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UsuariosList from "./components/admin/UsuariosList.jsx";
import UsuarioDetail from "./components/admin/UsuarioDetail.jsx";
import UsuarioForm from "./components/admin/UsuarioForm.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import VentaList from "./components/ventas/VentaList.jsx";
import VentaForm from "./components/ventas/VentaForm.jsx";
import VentaDetail from "./components/ventas/VentaDetail.jsx";

// ========== IMPORTACIONES PARA PERMISOS Y ROLES ==========
import PermisoList from "./components/permisos/PermisoList.jsx";
import RolesList from "./components/roles/RolesList.jsx";

// Componente para rutas protegidas (solo autenticado)
function ProtectedRoute({children}) {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>
    }
    return children;
}

// Componente para rutas solo ADMIN (acepta ROLE_ADMIN y ADMINISTRADOR)
function AdminRoute({children}) {
    const {auth} = useAuth();
    const rolesPermitidos = ['ROLE_ADMIN', 'ADMINISTRADOR'];

    if (!auth || !rolesPermitidos.includes(auth.rol)) {
        return <Navigate to="/dashboard" replace/>
    }
    return children;
}

// Componente para rutas de VENTAS (roles permitidos: ADMIN, ROLE_ADMIN, DESPACHADOR, SUPERVISOR)
function VentasRoute({children}) {
    const {auth} = useAuth();
    const rolesPermitidos = ['ROLE_ADMIN', 'ADMINISTRADOR', 'DESPACHADOR', 'SUPERVISOR'];

    if (!auth || !rolesPermitidos.includes(auth.rol)) {
        return <Navigate to="/dashboard" replace/>;
    }
    return children;
}

// Componente para rutas de REGISTRO DE VENTAS (solo ADMIN, ROLE_ADMIN y DESPACHADOR)
function RegistrarVentaRoute({children}) {
    const {auth} = useAuth();
    const rolesPermitidos = ['ROLE_ADMIN', 'ADMINISTRADOR', 'DESPACHADOR'];

    if (!auth || !rolesPermitidos.includes(auth.rol)) {
        return <Navigate to="/dashboard" replace/>;
    }
    return children;
}

// Componente para rutas de TURNOS (solo ADMIN, ROLE_ADMIN y SUPERVISOR)
function TurnosRoute({children}) {
    const {auth} = useAuth();
    const rolesPermitidos = ['ROLE_ADMIN', 'ADMINISTRADOR', 'SUPERVISOR'];

    if (!auth || !rolesPermitidos.includes(auth.rol)) {
        return <Navigate to="/dashboard" replace/>;
    }
    return children;
}

// Componente para rutas de REPORTES (ADMIN, ROLE_ADMIN, SUPERVISOR, CONTADOR)
function ReportesRoute({children}) {
    const {auth} = useAuth();
    const rolesPermitidos = ['ROLE_ADMIN', 'ADMINISTRADOR', 'SUPERVISOR', 'CONTADOR'];

    if (!auth || !rolesPermitidos.includes(auth.rol)) {
        return <Navigate to="/dashboard" replace/>;
    }
    return children;
}

export default function App() {
    return (
        <div className="App">
            <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

                {/* ========== RUTAS DE DASHBOARD ========== */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>
                }/>

                {/* ========== RUTAS DE VENTAS ========== */}

                {/* Listar todas las ventas */}
                <Route path="/ventas" element={
                    <ProtectedRoute>
                        <VentasRoute>
                            <VentaList/>
                        </VentasRoute>
                    </ProtectedRoute>
                }/>

                {/* Ver detalle de una venta */}
                <Route path="/ventas/:id" element={
                    <ProtectedRoute>
                        <VentasRoute>
                            <VentaDetail/>
                        </VentasRoute>
                    </ProtectedRoute>
                }/>

                {/* Crear nueva venta */}
                <Route path="/ventas/nueva" element={
                    <ProtectedRoute>
                        <RegistrarVentaRoute>
                            <VentaForm/>
                        </RegistrarVentaRoute>
                    </ProtectedRoute>
                }/>

                {/* Editar venta existente */}
                <Route path="/ventas/:id/editar" element={
                    <ProtectedRoute>
                        <RegistrarVentaRoute>
                            <VentaForm/>
                        </RegistrarVentaRoute>
                    </ProtectedRoute>
                }/>

                {/* ========== RUTAS DE TURNOS ========== */}
                <Route path="/turnos" element={
                    <ProtectedRoute>
                        <TurnosRoute>
                            <div className="container mt-5">
                                <h1>Gestión de Turnos</h1>
                                <p>Módulo en desarrollo - Próximamente</p>
                            </div>
                        </TurnosRoute>
                    </ProtectedRoute>
                }/>

                {/* ========== RUTAS DE REPORTES ========== */}
                <Route path="/reportes" element={
                    <ProtectedRoute>
                        <ReportesRoute>
                            <div className="container mt-5">
                                <h1>Reportes y Estadísticas</h1>
                                <p>Módulo en desarrollo - Próximamente</p>
                            </div>
                        </ReportesRoute>
                    </ProtectedRoute>
                }/>

                {/* ========== RUTAS ADMINISTRATIVAS ========== */}

                {/* Listar usuarios (solo ADMIN) */}
                <Route path="/admin/usuarios" element={
                    <ProtectedRoute>
                        <AdminRoute>
                            <UsuariosList/>
                        </AdminRoute>
                    </ProtectedRoute>
                }/>

                {/* Ver detalle de usuario (solo ADMIN) */}
                <Route path="/admin/usuarios/:id" element={
                    <ProtectedRoute>
                        <AdminRoute>
                            <UsuarioDetail/>
                        </AdminRoute>
                    </ProtectedRoute>
                }/>

                {/* Crear nuevo usuario (solo ADMIN) */}
                <Route path="/admin/usuarios/nuevo" element={
                    <ProtectedRoute>
                        <AdminRoute>
                            <UsuarioForm/>
                        </AdminRoute>
                    </ProtectedRoute>
                }/>

                {/* Editar usuario (solo ADMIN) */}
                <Route path="/admin/usuarios/:id/editar" element={
                    <ProtectedRoute>
                        <AdminRoute>
                            <UsuarioForm/>
                        </AdminRoute>
                    </ProtectedRoute>
                }/>

                {/* ========== NUEVAS RUTAS PARA PERMISOS Y ROLES ========== */}

                {/* Listar permisos (solo ADMIN) */}
                <Route path="/admin/permisos" element={
                    <ProtectedRoute>
                        <AdminRoute>
                            <PermisoList/>
                        </AdminRoute>
                    </ProtectedRoute>
                }/>

                {/* Listar roles (solo ADMIN) */}
                <Route path="/admin/roles" element={
                    <ProtectedRoute>
                        <AdminRoute>
                            <RolesList/>
                        </AdminRoute>
                    </ProtectedRoute>
                }/>

                {/* ========== RUTAS POR DEFECTO Y ERRORES ========== */}

                {/* Ruta por defecto - redirige al dashboard si está autenticado, sino a login */}
                <Route path="/" element={<Navigate to="/dashboard" replace/>}/>

                {/* Ruta 404 */}
                <Route path="*" element={
                    <div className="container mt-5">
                        <h1>404 - Página no encontrada</h1>
                        <p>La página que buscas no existe.</p>
                        <a href="/dashboard" className="btn btn-primary mt-3">
                            Volver al Dashboard
                        </a>
                    </div>
                }/>
            </Routes>
        </div>
    );
}