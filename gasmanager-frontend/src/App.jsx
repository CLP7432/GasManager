import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import LoginPage from './pages/users/LoginPage';
import DashboardPage from './pages/users/DashboardPage';
import UsuariosPage from './pages/users/UsuariosPage';
import UsuarioForm from './components/users/UsuarioForm';
import RolesPage from './pages/users/RolesPage';
import RolForm from './components/users/RolForm';
import PermisosPage from './pages/users/PermisosPage';
import PermisoForm from './components/users/PermisoForm';
import AuditoriaPage from './pages/users/AuditoriaPage';


// Importaciones de Ventas
import VentasPage from './pages/ventas/VentasPage';
import VentaDetallePage from './pages/ventas/VentaDetallePage';
import TurnosPage from './pages/ventas/TurnosPage';
import CortesPage from './pages/ventas/CortesPage';
import DispensariosPage from './pages/ventas/DispensariosPage';
import CorteTurnoDetallePage from './pages/ventas/CorteTurnoDetallePage';
import ModuloVentasPage from './pages/ventas/ModuloVentasPage';
import PuntoVentaPage from './pages/ventas/PuntoVentaPage';


// Importaciones de Inventarios
import CombustiblesPage from './pages/inventarios/CombustiblesPage';
import CombustibleFormPage from './pages/inventarios/CombustibleFormPage';
import AceitesPage from './pages/inventarios/AceitesPage';
import AceiteFormPage from './pages/inventarios/AceiteFormPage';
import InventarioCombustiblePage from './pages/inventarios/InventarioCombustiblePage';
import CargaPipaPage from './pages/inventarios/CargaPipaPage';
import CargaPipaHistorialPage from './pages/inventarios/CargaPipaHistorialPage';
import ModuloInventariosPage from './pages/inventarios/ModuloInventariosPage';
import AceitesInventarioPage from './pages/inventarios/AceitesInventarioPage';


// Importaciones de Administración
import ModuloAdministracionPage from './pages/administracion/ModuloAdministracionPage';
import ConfiguracionInicialPage from './pages/administracion/ConfiguracionInicialPage';
import PreciosCombustiblesPage from './pages/administracion/PreciosCombustiblesPage';
import ConfigurarTanquesPage from './pages/administracion/ConfigurarTanquesPage';
import ReiniciarSistemaPage from './pages/administracion/ReiniciarSistemaPage';
import ReiniciarClientesPage from './pages/administracion/ReiniciarClientesPage';
import CargarInventarioAceitesPage from './pages/administracion/CargarInventarioAceitesPage';
import ReiniciarInventarioAceitesPage from './pages/administracion/ReiniciarInventarioAceitesPage';
import PreciosAceitesPage from './pages/administracion/PreciosAceitesPage';

// Importaciones de Clientes y Créditos
import ModuloClientesPage from './pages/clientes/ModuloClientesPage';
import ClientesPage from './pages/clientes/ClientesPage';
import ClienteFormPage from './pages/clientes/ClienteFormPage';
import CreditosPage from './pages/clientes/CreditosPage';
import CreditoFormPage from './pages/clientes/CreditoFormPage';
import CreditoDetallePage from './pages/clientes/CreditoDetallePage';
import CreditosPorClientePage from './pages/clientes/CreditosPorClientePage';


// Importaciones de Facturación
import ModuloFacturacionPage from './pages/facturacion/ModuloFacturacionPage';
import FacturasPage from './pages/facturacion/FacturasPage';
import FacturaDetallePage from './pages/facturacion/FacturaDetallePage';
import NuevaFacturaPage from './pages/facturacion/NuevaFacturaPage';


// Importaciones de Nómina
import ModuloNominaPage from './pages/nomina/ModuloNominaPage';
import EmpleadosPage from './pages/nomina/EmpleadosPage';
import EmpleadoFormPage from './pages/nomina/EmpleadoFormPage';
import PuestosPage from './pages/nomina/PuestosPage';
import PuestoFormPage from './pages/nomina/PuestoFormPage';
import DepartamentosPage from './pages/nomina/DepartamentosPage';
import DepartamentoFormPage from './pages/nomina/DepartamentoFormPage';
import IncidenciasPage from './pages/nomina/IncidenciasPage';
import IncidenciaFormPage from './pages/nomina/IncidenciaFormPage';
import NominasPage from './pages/nomina/NominasPage';
import NominaDetallePage from './pages/nomina/NominaDetallePage';
import ProcesarNominaPage from './pages/nomina/ProcesarNominaPage';


// Importaciones de Compras
import ModuloComprasPage from './pages/compras/ModuloComprasPage';
import ProveedoresPage from './pages/compras/ProveedoresPage';
import ProveedorFormPage from './pages/compras/ProveedorFormPage';
import OrdenesCompraPage from './pages/compras/OrdenesCompraPage';
import OrdenCompraFormPage from './pages/compras/OrdenCompraFormPage';
import OrdenCompraDetallePage from './pages/compras/OrdenCompraDetallePage';


// Importaciones de Reportes
import NuevoDashboardPage from './pages/reportes/NuevoDashboardPage';
import ReporteVentasPage from './pages/reportes/ReporteVentasPage';
import ReporteInventarioPage from './pages/reportes/ReporteInventarioPage';
import ReporteCreditosPage from './pages/reportes/ReporteCreditosPage';
import ReporteFacturacionPage from './pages/reportes/ReporteFacturacionPage';
import ReporteNominaPage from './pages/reportes/ReporteNominaPage';
import ReporteLealtadPage from './pages/reportes/ReporteLealtadPage';
import ModuloReportesPage from './pages/reportes/ModuloReportesPage';

// Importaciones de Lealtad
import ModuloLealtadPage from './pages/lealtad/ModuloLealtadPage';
import TransaccionPage from './pages/lealtad/TransaccionPage';
import RecompensasPage from './pages/lealtad/RecompensasPage';
import CuentaPuntosPage from './pages/lealtad/CuentaPuntosPage';
import CanjeRecompensaPage from './pages/lealtad/CanjeRecompensaPage';
import ConfiguracionLealtadPage from './pages/lealtad/ConfiguracionLealtadPage';


const PrivateRoute = ({children}) => {
    const {isAuthenticated} = useAuth();
    return isAuthenticated ? children : <Navigate to="/login"/>;
};

const AppRoutes = () => {
    const {isAuthenticated} = useAuth();

    return (
        <Routes>
            {/* ===== RUTAS PÚBLICAS ===== */}
            <Route path="/login" element={<LoginPage/>}/>

            {/* ===== RUTAS PROTEGIDAS ===== */}

            {/* Dashboard */}
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <DashboardPage/>
                </PrivateRoute>
            }/>

            {/* ===== USUARIOS ===== */}
            <Route path="/usuarios" element={
                <PrivateRoute>
                    <UsuariosPage/>
                </PrivateRoute>
            }/>
            <Route path="/usuarios/nuevo" element={
                <PrivateRoute>
                    <UsuarioForm/>
                </PrivateRoute>
            }/>
            <Route path="/usuarios/editar/:id" element={
                <PrivateRoute>
                    <UsuarioForm/>
                </PrivateRoute>
            }/>

            <Route path="/roles" element={
                <PrivateRoute>
                    <RolesPage/>
                </PrivateRoute>
            }/>
            <Route path="/roles/nuevo" element={
                <PrivateRoute>
                    <RolForm/>
                </PrivateRoute>
            }/>
            <Route path="/roles/editar/:id" element={
                <PrivateRoute>
                    <RolForm/>
                </PrivateRoute>
            }/>

            <Route path="/permisos" element={
                <PrivateRoute>
                    <PermisosPage/>
                </PrivateRoute>
            }/>
            <Route path="/permisos/nuevo" element={
                <PrivateRoute>
                    <PermisoForm/>
                </PrivateRoute>
            }/>
            <Route path="/permisos/editar/:id" element={
                <PrivateRoute>
                    <PermisoForm/>
                </PrivateRoute>
            }/>

            <Route path="/auditoria" element={
                <PrivateRoute>
                    <AuditoriaPage/>
                </PrivateRoute>
            }/>

            {/* ===== VENTAS ===== */}
            <Route path="/modulo-ventas" element={
                <PrivateRoute>
                    <ModuloVentasPage/>
                </PrivateRoute>
            }/>

            <Route path="/ventas" element={
                <PrivateRoute>
                    <VentasPage/>
                </PrivateRoute>
            }/>
            <Route path="/ventas/:id" element={
                <PrivateRoute>
                    <VentaDetallePage/>
                </PrivateRoute>
            }/>

            <Route path="/turnos" element={
                <PrivateRoute>
                    <TurnosPage/>
                </PrivateRoute>
            }/>

            <Route path="/cortes" element={
                <PrivateRoute>
                    <CortesPage/>
                </PrivateRoute>
            }/>
            <Route path="/cortes/:id" element={
                <PrivateRoute>
                    <CorteTurnoDetallePage />
                </PrivateRoute>
            }/>

            <Route path="/dispensarios/*" element={
                <PrivateRoute>
                    <DispensariosPage/>
                </PrivateRoute>
            }/>

            <Route path="/monitor-dispensarios" element={
                <PrivateRoute>
                    <PuntoVentaPage/>
                </PrivateRoute>
            }/>

            {/* ===== INVENTARIOS ===== */}
            <Route path="/modulo-inventarios" element={
                <PrivateRoute>
                    <ModuloInventariosPage/>
                </PrivateRoute>
            }/>

            <Route path="/combustibles" element={
                <PrivateRoute>
                    <CombustiblesPage/>
                </PrivateRoute>
            }/>
            <Route path="/combustibles/nuevo" element={
                <PrivateRoute>
                    <CombustibleFormPage/>
                </PrivateRoute>
            }/>
            <Route path="/combustibles/editar/:id" element={
                <PrivateRoute>
                    <CombustibleFormPage/>
                </PrivateRoute>
            }/>

            <Route path="/aceites" element={
                <PrivateRoute>
                    <AceitesPage/>
                </PrivateRoute>
            }/>
            <Route path="/aceites/nuevo" element={
                <PrivateRoute>
                    <AceiteFormPage/>
                </PrivateRoute>
            }/>
            <Route path="/aceites/editar/:id" element={
                <PrivateRoute>
                    <AceiteFormPage/>
                </PrivateRoute>
            }/>

            <Route path="/inventario-combustible" element={
                <PrivateRoute>
                    <InventarioCombustiblePage/>
                </PrivateRoute>
            }/>
            <Route path="/cargas-pipa/nueva" element={
                <PrivateRoute>
                    <CargaPipaPage/>
                </PrivateRoute>
            }/>
            <Route path="/cargas-pipa/historial" element={
                <PrivateRoute>
                    <CargaPipaHistorialPage/>
                </PrivateRoute>
            }/>
            <Route path="/cargas-pipa/tipo/:tipo" element={
                <PrivateRoute>
                    <CargaPipaHistorialPage/>
                </PrivateRoute>
            }/>

            <Route path="/inventario-aceites/*" element={
                <PrivateRoute>
                    <AceitesInventarioPage />
                </PrivateRoute>
            }/>

            {/* ===== ADMINISTRACIÓN ===== */}
            <Route path="/modulo-administracion" element={
                <PrivateRoute>
                    <ModuloAdministracionPage/>
                </PrivateRoute>
            }/>

            <Route path="/configuracion-inicial" element={
                <PrivateRoute>
                    <ConfiguracionInicialPage/>
                </PrivateRoute>
            }/>

            <Route path="/precios-combustibles" element={
                <PrivateRoute>
                    <PreciosCombustiblesPage/>
                </PrivateRoute>
            }/>

            <Route path="/configurar-tanques" element={
                <PrivateRoute>
                    <ConfigurarTanquesPage />
                </PrivateRoute>
            }/>

            <Route path="/cargar-inventario-aceites" element={
                <PrivateRoute>
                    <CargarInventarioAceitesPage />
                </PrivateRoute>
            }/>

            <Route path="/reiniciar-inventario-aceites" element={
                <PrivateRoute>
                    <ReiniciarInventarioAceitesPage />
                </PrivateRoute>
            }/>

            <Route path="/reiniciar-clientes" element={
                <PrivateRoute>
                    <ReiniciarClientesPage />
                </PrivateRoute>
            }/>

            <Route path="/reiniciar-sistema" element={
                <PrivateRoute>
                    <ReiniciarSistemaPage />
                </PrivateRoute>
            }/>
            <Route path="/precios-aceites" element={
                <PrivateRoute>
                    <PreciosAceitesPage />
                </PrivateRoute>
            } />

            {/* ===== CLIENTES Y CRÉDITOS ===== */}
            <Route path="/modulo-clientes" element={
                <PrivateRoute>
                    <ModuloClientesPage/>
                </PrivateRoute>
            }/>

            <Route path="/clientes" element={
                <PrivateRoute>
                    <ClientesPage/>
                </PrivateRoute>
            }/>
            <Route path="/clientes/nuevo" element={
                <PrivateRoute>
                    <ClienteFormPage/>
                </PrivateRoute>
            }/>
            <Route path="/clientes/editar/:id" element={
                <PrivateRoute>
                    <ClienteFormPage/>
                </PrivateRoute>
            }/>
            <Route path="/clientes/creditos/:clienteId" element={
                <PrivateRoute>
                    <CreditosPorClientePage/>
                </PrivateRoute>
            }/>

            <Route path="/creditos" element={
                <PrivateRoute>
                    <CreditosPage/>
                </PrivateRoute>
            }/>
            <Route path="/creditos/nuevo" element={
                <PrivateRoute>
                    <CreditoFormPage/>
                </PrivateRoute>
            }/>
            <Route path="/creditos/editar/:id" element={
                <PrivateRoute>
                    <CreditoFormPage/>
                </PrivateRoute>
            }/>
            <Route path="/creditos/:id" element={
                <PrivateRoute>
                    <CreditoDetallePage/>
                </PrivateRoute>
            }/>

            {/* ===== FACTURACIÓN ===== */}
            <Route path="/modulo-facturacion" element={
                <PrivateRoute>
                    <ModuloFacturacionPage/>
                </PrivateRoute>
            }/>

            <Route path="/facturas" element={
                <PrivateRoute>
                    <FacturasPage/>
                </PrivateRoute>
            }/>
            <Route path="/facturas/nueva" element={
                <PrivateRoute>
                    <NuevaFacturaPage/>
                </PrivateRoute>
            }/>
            <Route path="/facturas/:id" element={
                <PrivateRoute>
                    <FacturaDetallePage/>
                </PrivateRoute>
            }/>

            {/* ===== NÓMINA ===== */}
            <Route path="/modulo-nomina" element={
                <PrivateRoute>
                    <ModuloNominaPage />
                </PrivateRoute>
            }/>

            <Route path="/empleados" element={
                <PrivateRoute>
                    <EmpleadosPage />
                </PrivateRoute>
            }/>
            <Route path="/empleados/nuevo" element={
                <PrivateRoute>
                    <EmpleadoFormPage />
                </PrivateRoute>
            }/>
            <Route path="/empleados/editar/:id" element={
                <PrivateRoute>
                    <EmpleadoFormPage />
                </PrivateRoute>
            }/>

            <Route path="/puestos" element={
                <PrivateRoute>
                    <PuestosPage />
                </PrivateRoute>
            }/>
            <Route path="/puestos/nuevo" element={
                <PrivateRoute>
                    <PuestoFormPage />
                </PrivateRoute>
            }/>
            <Route path="/puestos/editar/:id" element={
                <PrivateRoute>
                    <PuestoFormPage />
                </PrivateRoute>
            }/>

            <Route path="/departamentos" element={
                <PrivateRoute>
                    <DepartamentosPage />
                </PrivateRoute>
            }/>
            <Route path="/departamentos/nuevo" element={
                <PrivateRoute>
                    <DepartamentoFormPage />
                </PrivateRoute>
            }/>
            <Route path="/departamentos/editar/:id" element={
                <PrivateRoute>
                    <DepartamentoFormPage />
                </PrivateRoute>
            }/>

            <Route path="/incidencias" element={
                <PrivateRoute>
                    <IncidenciasPage />
                </PrivateRoute>
            }/>
            <Route path="/incidencias/nuevo" element={
                <PrivateRoute>
                    <IncidenciaFormPage />
                </PrivateRoute>
            }/>
            <Route path="/incidencias/editar/:id" element={
                <PrivateRoute>
                    <IncidenciaFormPage />
                </PrivateRoute>
            }/>

            <Route path="/nominas" element={
                <PrivateRoute>
                    <NominasPage />
                </PrivateRoute>
            }/>
            <Route path="/nominas/procesar" element={
                <PrivateRoute>
                    <ProcesarNominaPage />
                </PrivateRoute>
            }/>
            <Route path="/nominas/:id" element={
                <PrivateRoute>
                    <NominaDetallePage />
                </PrivateRoute>
            }/>

            {/* ===== COMPRAS ===== */}
            <Route path="/modulo-compras" element={
                <PrivateRoute>
                    <ModuloComprasPage />
                </PrivateRoute>
            }/>

            <Route path="/proveedores" element={
                <PrivateRoute>
                    <ProveedoresPage />
                </PrivateRoute>
            }/>
            <Route path="/proveedores/nuevo" element={
                <PrivateRoute>
                    <ProveedorFormPage />
                </PrivateRoute>
            }/>
            <Route path="/proveedores/editar/:id" element={
                <PrivateRoute>
                    <ProveedorFormPage />
                </PrivateRoute>
            }/>

            <Route path="/ordenes-compra" element={
                <PrivateRoute>
                    <OrdenesCompraPage />
                </PrivateRoute>
            }/>
            <Route path="/ordenes-compra/nueva" element={
                <PrivateRoute>
                    <OrdenCompraFormPage />
                </PrivateRoute>
            }/>
            <Route path="/ordenes-compra/:id" element={
                <PrivateRoute>
                    <OrdenCompraDetallePage />
                </PrivateRoute>
            }/>

            {/* ===== REPORTES ===== */}
            <Route path="/modulo-reportes" element={
                <PrivateRoute>
                    <ModuloReportesPage />
                </PrivateRoute>
            }/>

            <Route path="/dashboard-v2" element={
                <PrivateRoute>
                    <NuevoDashboardPage/>
                </PrivateRoute>
            }/>

            <Route path="/reportes/ventas" element={
                <PrivateRoute>
                    <ReporteVentasPage/>
                </PrivateRoute>
            }/>

            <Route path="/reportes/inventario" element={
                <PrivateRoute>
                    <ReporteInventarioPage/>
                </PrivateRoute>
            }/>

            <Route path="/reportes/creditos" element={
                <PrivateRoute>
                    <ReporteCreditosPage/>
                </PrivateRoute>
            }/>

            <Route path="/reportes/facturacion" element={
                <PrivateRoute>
                    <ReporteFacturacionPage/>
                </PrivateRoute>
            }/>

            <Route path="/reportes/nomina" element={
                <PrivateRoute>
                    <ReporteNominaPage/>
                </PrivateRoute>
            }/>

            <Route path="/reportes/lealtad" element={
                <PrivateRoute>
                    <ReporteLealtadPage/>
                </PrivateRoute>
            }/>

            {/* ===== LEALTAD ===== */}
            <Route path="/modulo-lealtad" element={
                <PrivateRoute>
                    <ModuloLealtadPage/>
                </PrivateRoute>
            }/>

            <Route path="/lealtad/transacciones" element={
                <PrivateRoute>
                    <TransaccionPage/>
                </PrivateRoute>
            }/>

            <Route path="/lealtad/recompensas" element={
                <PrivateRoute>
                    <RecompensasPage/>
                </PrivateRoute>
            }/>

            <Route path="/lealtad/puntos" element={
                <PrivateRoute>
                    <CuentaPuntosPage/>
                </PrivateRoute>
            }/>

            <Route path="/lealtad/canjes" element={
                <PrivateRoute>
                    <CanjeRecompensaPage/>
                </PrivateRoute>
            }/>

            <Route path="/lealtad/configuracion" element={
                <PrivateRoute>
                    <ConfiguracionLealtadPage/>
                </PrivateRoute>
            }/>

            {/* ===== REDIRECCIONES ===== */}
            <Route path="/" element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"}/>
            }/>

            {/* ===== 404 ===== */}
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
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes/>
            </Router>
        </AuthProvider>
    );
}

export default App;