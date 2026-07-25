import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';

const ModuloReportesPage = () => {
    const navigate = useNavigate();

    const submodulos = [
        { name: 'Dashboard Gráficas', icon: '📊', path: '/dashboard-v2', color: '#667eea', description: 'Estadísticas y gráficas en tiempo real' },
        { name: 'Reporte de Ventas', icon: '💰', path: '/reportes/ventas', color: '#28a745', description: 'Tabla detallada de ventas con exportación' },
        { name: 'Reporte de Inventario', icon: '⛽', path: '/reportes/inventario', color: '#17a2b8', description: 'Niveles de combustible y alertas' },
        { name: 'Reporte de Créditos', icon: '📋', path: '/reportes/creditos', color: '#ffc107', description: 'Saldos y estado de créditos' },
        { name: 'Reporte de Facturación', icon: '📄', path: '/reportes/facturacion', color: '#fd7e14', description: 'Facturas emitidas y CFDI' },
        { name: 'Reporte de Nómina', icon: '👥', path: '/reportes/nomina', color: '#6f42c1', description: 'Sueldos y deducciones' },
        { name: 'Reporte de Lealtad', icon: '⭐', path: '/reportes/lealtad', color: '#e83e8c', description: 'Puntos acumulados' }
    ];

    return (
        <Layout>
            <div>
                <div className="welcome-header" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '15px',
                    padding: '30px',
                    marginBottom: '30px',
                    color: 'white'
                }}>
                    <h1 style={{ marginBottom: '10px', fontSize: '28px' }}>📊 Módulo de Reportes</h1>
                    <p>Reportes, estadísticas y gráficas para la toma de decisiones</p>
                </div>

                <h2 style={{ marginBottom: '20px', color: '#333' }}>Reportes disponibles</h2>

                <div className="modules-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {submodulos.map((sub, index) => (
                        <div key={index} className="module-card" onClick={() => navigate(sub.path)} style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            borderTop: `4px solid ${sub.color}`,
                            position: 'relative'
                        }}
                             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>{sub.icon}</div>
                            <h3 style={{ marginBottom: '8px', color: '#333' }}>{sub.name}</h3>
                            <p style={{ color: '#666', fontSize: '12px' }}>{sub.description}</p>
                            <span style={{ position: 'absolute', bottom: '15px', right: '15px', fontSize: '11px', color: sub.color }}>Acceder →</span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ModuloReportesPage;