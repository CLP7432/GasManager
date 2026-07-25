import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user } = useAuth();

    const getPageTitle = () => {
        const path = location.pathname;

        // Dashboard
        if (path === '/dashboard') return 'Dashboard';

        // Usuarios
        if (path === '/usuarios') return 'Gestión de Usuarios';
        if (path === '/usuarios/nuevo') return 'Nuevo Usuario';
        if (path.match(/^\/usuarios\/editar\/\d+$/)) return 'Editar Usuario';

        // Roles
        if (path === '/roles') return 'Gestión de Roles';
        if (path === '/roles/nuevo') return 'Nuevo Rol';
        if (path.match(/^\/roles\/editar\/\d+$/)) return 'Editar Rol';

        // Permisos
        if (path === '/permisos') return 'Gestión de Permisos';
        if (path === '/permisos/nuevo') return 'Nuevo Permiso';
        if (path.match(/^\/permisos\/editar\/\d+$/)) return 'Editar Permiso';

        // Auditoría
        if (path === '/auditoria') return 'Registro de Auditoría';

        // Ventas - Historial
        if (path === '/ventas') return '📋 Historial de Ventas';
        if (path.match(/^\/ventas\/\d+$/)) return 'Detalle de Venta';

        // Turnos
        if (path === '/turnos') return 'Gestión de Turnos';

        // Cortes
        if (path === '/cortes') return 'Gestión de Cortes';

        // Dispensarios
        if (path === '/dispensarios') return 'Gestión de Dispensarios';

        // Punto de Venta (Monitor de Cargas)
        if (path === '/monitor-dispensarios') return '⛽ Punto de Venta - Carga de Combustible';

        // ========== INVENTARIOS ==========
        // Combustibles
        if (path === '/combustibles') return 'Gestión de Combustibles';
        if (path === '/combustibles/nuevo') return 'Nuevo Combustible';
        if (path.match(/^\/combustibles\/editar\/\d+$/)) return 'Editar Combustible';

        // Aceites
        if (path === '/aceites') return 'Gestión de Aceites y Aditivos';
        if (path === '/aceites/nuevo') return 'Nuevo Aceite';
        if (path.match(/^\/aceites\/editar\/\d+$/)) return 'Editar Aceite';

        // Inventario de Combustible
        if (path === '/inventario-combustible') return 'Inventario de Combustible';
        if (path === '/cargas-pipa/nueva') return 'Registrar Carga de Pipa';
        if (path === '/cargas-pipa/historial') return 'Historial de Cargas de Pipa';
        if (path.match(/^\/cargas-pipa\/tipo\/\w+$/)) return 'Cargas por Tipo de Combustible';

        // ========== CLIENTES Y CRÉDITOS ==========
        // Módulo Principal
        if (path === '/modulo-clientes') return '👥 Módulo de Clientes y Créditos';

        // Clientes
        if (path === '/clientes') return '👥 Gestión de Clientes';
        if (path === '/clientes/nuevo') return 'Nuevo Cliente';
        if (path.match(/^\/clientes\/editar\/\d+$/)) return 'Editar Cliente';
        if (path.match(/^\/clientes\/creditos\/\d+$/)) return 'Créditos del Cliente';

        // Créditos
        if (path === '/creditos') return '💰 Gestión de Créditos';
        if (path === '/creditos/nuevo') return 'Nuevo Crédito';
        if (path.match(/^\/creditos\/editar\/\d+$/)) return 'Editar Crédito';
        if (path.match(/^\/creditos\/\d+$/)) return 'Detalle de Crédito';

        // ========== FACTURACIÓN ==========
        // Módulo Principal
        if (path === '/modulo-facturacion') return '📄 Módulo de Facturación';

        // Facturas
        if (path === '/facturas') return '📄 Gestión de Facturas';
        if (path === '/facturas/nueva') return 'Nueva Factura';
        if (path.match(/^\/facturas\/\d+$/)) return 'Detalle de Factura';

        // Módulos
        if (path === '/modulo-ventas') return '💰 Módulo de Ventas';
        if (path === '/modulo-inventarios') return '📦 Módulo de Inventarios';
        if (path === '/modulo-administracion') return '⚙️ Módulo de Administración';

        // ========== NÓMINA ==========
        // Módulo Principal
        if (path === '/modulo-nomina') return '👥 Módulo de Nómina';

        // Empleados
        if (path === '/empleados') return '👥 Gestión de Empleados';
        if (path === '/empleados/nuevo') return 'Nuevo Empleado';
        if (path.match(/^\/empleados\/editar\/\d+$/)) return 'Editar Empleado';

        // Puestos
        if (path === '/puestos') return '📋 Gestión de Puestos';
        if (path === '/puestos/nuevo') return 'Nuevo Puesto';
        if (path.match(/^\/puestos\/editar\/\d+$/)) return 'Editar Puesto';

        // Departamentos
        if (path === '/departamentos') return '🏢 Gestión de Departamentos';
        if (path === '/departamentos/nuevo') return 'Nuevo Departamento';
        if (path.match(/^\/departamentos\/editar\/\d+$/)) return 'Editar Departamento';

        // Incidencias
        if (path === '/incidencias') return '📝 Gestión de Incidencias';
        if (path === '/incidencias/nuevo') return 'Nueva Incidencia';

        // Nóminas
        if (path === '/nominas') return '📄 Gestión de Nóminas';
        if (path === '/nominas/procesar') return 'Procesar Nómina';
        if (path.match(/^\/nominas\/\d+$/)) return 'Detalle de Nómina';

        // ========== COMPRAS ==========
        // Módulo Principal
        if (path === '/modulo-compras') return '🛒 Módulo de Compras';

        // Proveedores
        if (path === '/proveedores') return '🏢 Gestión de Proveedores';
        if (path === '/proveedores/nuevo') return 'Nuevo Proveedor';
        if (path.match(/^\/proveedores\/editar\/\d+$/)) return 'Editar Proveedor';

        // Órdenes de Compra
        if (path === '/ordenes-compra') return '📋 Órdenes de Compra';
        if (path === '/ordenes-compra/nueva') return 'Nueva Orden de Compra';
        if (path.match(/^\/ordenes-compra\/\d+$/)) return 'Detalle de Orden de Compra';

        return 'GasManager';
    };

    return (
        <div className="navbar">
            <div className="navbar-title">{getPageTitle()}</div>
            <div className="navbar-user">
                <span>👋 Hola, {user?.nombre || user?.correo}</span>
            </div>
        </div>
    );
};

export default Navbar;