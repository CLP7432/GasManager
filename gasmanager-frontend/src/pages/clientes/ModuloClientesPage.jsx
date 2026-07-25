import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';

const ModuloClientesPage = () => {
    const navigate = useNavigate();

    const submodulos = [
        {
            name: 'Clientes',
            icon: '👥',
            path: '/clientes',
            color: '#20c997',
            description: 'Registro y gestión de clientes. Alta, edición y consulta.'
        },
        {
            name: 'Créditos',
            icon: '💰',
            path: '/creditos',
            color: '#17a2b8',
            description: 'Administración de créditos otorgados a clientes.'
        },
        {
            name: 'Abonos',
            icon: '💵',
            path: '/creditos',
            color: '#fd7e14',
            description: 'Registro de pagos y abonos a créditos.'
        },
        {
            name: 'Historial de Pagos',
            icon: '📜',
            path: '/creditos',
            color: '#6f42c1',
            description: 'Consulta de historial completo de pagos por cliente.'
        }
    ];

    return (
        <Layout>
            <div>
                {/* Encabezado del módulo */}
                <div className="welcome-header" style={{
                    background: 'linear-gradient(135deg, #20c997 0%, #0f172a 100%)',
                    borderRadius: '15px',
                    padding: '30px',
                    marginBottom: '30px',
                    color: 'white'
                }}>
                    <h1 style={{ marginBottom: '10px', fontSize: '28px' }}>
                        👥 Módulo de Clientes y Créditos
                    </h1>
                    <p style={{ opacity: 0.9, marginBottom: 0 }}>
                        Gestión integral de clientes, créditos y abonos
                    </p>
                </div>

                {/* Submódulos */}
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Submódulos disponibles</h2>

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
                                Acceder →
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ModuloClientesPage;