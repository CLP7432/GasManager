import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout.jsx';

const ModuloLealtadPage = () => {
    const navigate = useNavigate();

    const submodulos = [
        {
            name: 'Registrar Transaccion',
            icon: '\u26FD',
            path: '/lealtad/transacciones',
            color: '#e83e8c',
            description: 'Registra compras de combustible y acumula puntos de lealtad.'
        },
        {
            name: 'Consulta de Puntos',
            icon: '\u2B50',
            path: '/lealtad/puntos',
            color: '#fd7e14',
            description: 'Consulta el saldo de puntos acumulados por cliente.'
        },
        {
            name: 'Recompensas',
            icon: '\uD83C\uDF81',
            path: '/lealtad/recompensas',
            color: '#6f42c1',
            description: 'Catalogo de recompensas disponibles para canjear.'
        },
        {
            name: 'Canje de Recompensas',
            icon: '\uD83D\uDD04',
            path: '/lealtad/canjes',
            color: '#17a2b8',
            description: 'Canjea puntos por recompensas y consulta el historial.'
        },
        {
            name: 'Configuracion',
            icon: '\u2699\uFE0F',
            path: '/lealtad/configuracion',
            color: '#6c757d',
            description: 'Personaliza los parametros del programa de lealtad (factor de puntos).'
        }
    ];

    return (
        <Layout>
            <div>
                <div className="welcome-header" style={{
                    background: 'linear-gradient(135deg, #e83e8c 0%, #6f42c1 100%)',
                    borderRadius: '15px',
                    padding: '30px',
                    marginBottom: '30px',
                    color: 'white'
                }}>
                    <h1 style={{ marginBottom: '10px', fontSize: '28px' }}>
                        Programa de Lealtad
                    </h1>
                    <p style={{ opacity: 0.9, marginBottom: 0 }}>
                        Gestion de puntos, recompensas y canjes para clientes
                    </p>
                </div>

                <h2 style={{ marginBottom: '20px', color: '#333' }}>Submodulos disponibles</h2>

                <div className="modules-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {submodulos.map((sub, index) => (
                        <div
                            key={index}
                            className="module-card"
                            onClick={() => navigate(sub.path)}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '25px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                borderTop: `4px solid ${sub.color}`,
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
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                                {sub.icon}
                            </div>
                            <h3 style={{ marginBottom: '8px', color: '#333' }}>{sub.name}</h3>
                            <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px', lineHeight: '1.5' }}>
                                {sub.description}
                            </p>
                            <span style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '20px',
                                fontSize: '11px',
                                color: sub.color,
                                fontWeight: 'bold'
                            }}>
                                Acceder &rarr;
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ModuloLealtadPage;
