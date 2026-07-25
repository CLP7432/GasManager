import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>GasManager</h2>
                <p>Sistema de Gestión</p>
            </div>

            <div className="sidebar-menu" style={{ overflowY: 'auto', flex: '1' }}>
                <NavLink to="/dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                    <span className="menu-icon">🏠</span>
                    <span>Dashboard</span>
                </NavLink>

                {isAdmin && (
                    <>
                        {/* ========== VENTAS ========== */}
                        <div className="menu-group-title" style={{
                            padding: '12px 20px 4px 20px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px'
                        }}>
                            VENTAS
                        </div>
                        <NavLink to="/modulo-ventas" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <span className="menu-icon">💰</span>
                            <span>Módulo de Ventas</span>
                        </NavLink>

                        {/* ========== INVENTARIOS ========== */}
                        <div className="menu-group-title" style={{
                            padding: '12px 20px 4px 20px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px'
                        }}>
                            INVENTARIOS
                        </div>
                        <NavLink to="/modulo-inventarios" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <span className="menu-icon">📦</span>
                            <span>Módulo de Inventarios</span>
                        </NavLink>

                        {/* ========== ADMINISTRACIÓN ========== */}
                        <div className="menu-group-title" style={{
                            padding: '12px 20px 4px 20px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px'
                        }}>
                            ADMINISTRACIÓN
                        </div>
                        <NavLink to="/modulo-administracion" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <span className="menu-icon">⚙️</span>
                            <span>Módulo de Administración</span>
                        </NavLink>

                        {/* ========== CLIENTES Y CRÉDITOS ========== */}
                        <div className="menu-group-title" style={{
                            padding: '12px 20px 4px 20px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px'
                        }}>
                            CLIENTES Y CRÉDITOS
                        </div>
                        <NavLink to="/modulo-clientes" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <span className="menu-icon">👥</span>
                            <span>Módulo de Clientes</span>
                        </NavLink>

                        {/* ========== FACTURACIÓN ========== */}
                        <div className="menu-group-title" style={{
                            padding: '12px 20px 4px 20px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px'
                        }}>
                            FACTURACIÓN
                        </div>
                        <NavLink to="/modulo-facturacion" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <span className="menu-icon">📄</span>
                            <span>Módulo de Facturación</span>
                        </NavLink>

                        {/* ========== NÓMINA ========== */}
                        <div className="menu-group-title" style={{
                            padding: '12px 20px 4px 20px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px'
                        }}>
                            NÓMINA
                        </div>
                        <NavLink to="/modulo-nomina" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <span className="menu-icon">👥</span>
                            <span>Módulo de Nómina</span>
                        </NavLink>

                        {/* ========== COMPRAS ========== */}
                        <div className="menu-group-title" style={{
                            padding: '12px 20px 4px 20px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px'
                        }}>
                            COMPRAS
                        </div>
                        <NavLink to="/modulo-compras" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <span className="menu-icon">🛒</span>
                            <span>Módulo de Compras</span>
                        </NavLink>

                        {/* ========== REPORTES ========== */}
                        <div className="menu-group-title" style={{
                            padding: '12px 20px 4px 20px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px'
                        }}>
                            REPORTES
                        </div>
                        <NavLink to="/modulo-reportes" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <span className="menu-icon">&#128202;</span>
                            <span>Modulo de Reportes</span>
                        </NavLink>

                        {/* ========== LEALTAD ========== */}
                        <div className="menu-group-title" style={{
                            padding: '12px 20px 4px 20px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px'
                        }}>
                            LEALTAD
                        </div>
                        <NavLink to="/modulo-lealtad" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                            <span className="menu-icon">&#11088;</span>
                            <span>Programa de Lealtad</span>
                        </NavLink>

                        {/* ========== CONFIGURACIÓN INICIAL ========== */}
                        <div className="menu-group-title" style={{
                            padding: '12px 20px 4px 20px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px'
                        }}>
                            SISTEMA
                        </div>

                    </>
                )}
            </div>

            <div className="sidebar-footer">
                <div className="user-info">
                    <span>👤</span>
                    <div>
                        <div>{user?.correo}</div>
                        <div className="user-role">{user?.rol}</div>
                    </div>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Sidebar;