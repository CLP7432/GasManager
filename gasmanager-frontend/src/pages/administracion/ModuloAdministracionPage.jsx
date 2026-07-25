import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';

const ModuloAdministracionPage = () => {
    const navigate = useNavigate();

    const submodulos = [
        {
            name: 'Usuarios',
            icon: '👥',
            path: '/usuarios',
            color: '#667eea',
            description: 'Gestión de usuarios del sistema'
        },
        {
            name: 'Roles',
            icon: '🔐',
            path: '/roles',
            color: '#28a745',
            description: 'Gestión de roles y permisos'
        },
        {
            name: 'Permisos',
            icon: '⚙️',
            path: '/permisos',
            color: '#17a2b8',
            description: 'Gestión de permisos del sistema'
        },
        {
            name: 'Auditoría',
            icon: '📋',
            path: '/auditoria',
            color: '#6c757d',
            description: 'Registro de actividades'
        },
        {
            name: 'Configuración Inicial',
            icon: '⚙️',
            path: '/configuracion-inicial',
            color: '#fd7e14',
            description: 'Configuración de lecturas base y precios'
        },
        {
            name: 'Precios de Combustibles',
            icon: '💰',
            path: '/precios-combustibles',
            color: '#28a745',
            description: 'Gestión de precios por litro de combustibles'
        },
        {
            name: 'Dispensarios',
            icon: '⛽',
            path: '/dispensarios',
            color: '#17a2b8',
            description: 'Gestión de surtidores, caras y mangueras'
        },
        {
            name: 'Configurar Tanques',
            icon: '🛢️',
            path: '/configurar-tanques',
            color: '#6f42c1',
            description: 'Configurar niveles de tanques de combustible'
        },
        {
            name: 'Cargar Inventario Aceites',
            icon: '📦',
            path: '/cargar-inventario-aceites',
            color: '#28a745',
            description: 'Cargar inventario inicial de aceites en bodega y dispensarios'
        },
        {
            name: 'Reinventario Aceites',
            icon: '🛢️',
            path: '/reiniciar-inventario-aceites',
            color: '#dc3545',
            description: 'Reiniciar stock de aceites a cero'
        },
        {
            name: 'Reiniciar Clientes',
            icon: '👥',
            path: '/reiniciar-clientes',
            color: '#dc3545',
            description: 'Eliminar todos los clientes, créditos y abonos'
        },
        {
            name: 'Reiniciar Sistema',
            icon: '🔄',
            path: '/reiniciar-sistema',
            color: '#dc3545',
            description: 'Eliminar ventas, turnos y cortes (conserva dispensarios y precios)'
        },
        {
            name: 'Precios de Aceites',
            icon: '💰',
            path: '/precios-aceites',
            color: '#e83e8c',
            description: 'Gestión de precios de aceites y aditivos'
        },
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
                    <h1 style={{ marginBottom: '10px', fontSize: '28px' }}>
                        ⚙️ Módulo de Administración
                    </h1>
                    <p style={{ opacity: 0.9, marginBottom: 0 }}>
                        Gestión de usuarios, roles, permisos y configuración del sistema
                    </p>
                </div>

                <h2 style={{ marginBottom: '20px', color: '#333' }}>Submódulos disponibles</h2>

                <div className="modules-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    {submodulos.map((modulo, index) => (
                        <div
                            key={index}
                            className="module-card"
                            onClick={() => navigate(modulo.path)}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                borderTop: `4px solid ${modulo.color}`,
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
                            <div style={{ fontSize: '40px', marginBottom: '15px' }}>
                                {modulo.icon}
                            </div>
                            <h3 style={{ marginBottom: '8px', color: '#333' }}>{modulo.name}</h3>
                            <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>
                                {modulo.description}
                            </p>
                            <span style={{
                                position: 'absolute',
                                bottom: '15px',
                                right: '15px',
                                fontSize: '11px',
                                color: modulo.color
                            }}>
                                →
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ModuloAdministracionPage;