import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Módulos organizados
    const modules = [
        { name: 'Módulo de Ventas', icon: '💰', path: '/modulo-ventas', color: '#ffc107', description: 'Gestión de ventas, turnos y cortes de caja' },
        { name: 'Módulo de Inventarios', icon: '📦', path: '/modulo-inventarios', color: '#6f42c1', description: 'Combustibles, aceites, tanques y cargas de pipa' },
        { name: 'Módulo de Administración', icon: '⚙️', path: '/modulo-administracion', color: '#667eea', description: 'Usuarios, roles, permisos y auditoría' },
        { name: 'Clientes y Créditos', icon: '👥', path: '/modulo-clientes', color: '#20c997', description: 'Gestión de clientes, créditos y abonos' },
        { name: 'Facturación', icon: '📄', path: '/modulo-facturacion', color: '#28a745', description: 'Facturación electrónica CFDI' },
        { name: 'Nómina', icon: '👥', path: '/modulo-nomina', color: '#fd7e14', description: 'Gestión de empleados y cálculo de nómina' },
        { name: 'Compras', icon: '🛒', path: '/modulo-compras', color: '#17a2b8', description: 'Gestión de proveedores y órdenes de compra' },
        // REPORTES - AHORA ACTIVO
        { name: 'Reportes', icon: '📊', path: '/modulo-reportes', color: '#e83e8c', description: 'Reportes, estadísticas y gráficas del negocio' },
        { name: 'Programa de Lealtad', icon: '⭐', path: '/modulo-lealtad', color: '#e83e8c', description: 'Puntos, recompensas y canjes para clientes' }
    ];

    return (
        <div>
            {/* Encabezado de bienvenida */}
            <div className="welcome-header" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px',
                padding: '30px',
                marginBottom: '30px',
                color: 'white'
            }}>
                <h1 style={{ marginBottom: '10px', fontSize: '28px' }}>
                    ¡Bienvenido, {user?.nombre || user?.correo}!
                </h1>
                <p style={{ opacity: 0.9, marginBottom: 0 }}>
                    GasManager - Sistema Integral de Gestión para Estaciones de Servicio
                </p>
            </div>

            <h2 style={{ marginBottom: '20px', color: '#333' }}>Módulos del Sistema</h2>

            <div className="modules-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {modules.map((module, index) => (
                    <div
                        key={index}
                        className="module-card"
                        onClick={() => navigate(module.path)}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            borderTop: `4px solid ${module.color}`,
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                            {module.icon}
                        </div>
                        <h3 style={{ marginBottom: '8px', color: '#333' }}>{module.name}</h3>
                        <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>
                            {module.description}
                        </p>
                        <span style={{
                            position: 'absolute',
                            bottom: '15px',
                            right: '15px',
                            fontSize: '11px',
                            color: module.color,
                            fontWeight: 'bold'
                        }}>
                            Acceder →
                        </span>
                    </div>
                ))}
            </div>

            {/* Ayuda */}
            <div className="help-section" style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e0e0e0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ marginBottom: '5px', color: '#333' }}>¿Necesitas ayuda?</h3>
                        <p style={{ color: '#666', marginBottom: 0 }}>Consulta la documentación o contacta al administrador.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => alert('Documentación próximamente')}>
                        📖 Ver Documentación
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;