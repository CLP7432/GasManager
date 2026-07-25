import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';

const ModuloVentasPage = () => {
    const navigate = useNavigate();

    const submodulos = [
        { name: 'Punto de Venta', icon: '⛽', path: '/monitor-dispensarios', color: '#28a745', description: 'Carga de combustible en surtidores' },
        { name: 'Historial de Ventas', icon: '📋', path: '/ventas', color: '#17a2b8', description: 'Consulta de ventas realizadas' },
        { name: 'Turnos', icon: '⏰', path: '/turnos', color: '#fd7e14', description: 'Abrir y cerrar turnos' },
        { name: 'Cortes de Turno', icon: '📊', path: '/cortes', color: '#20c997', description: 'Cortes de caja por turno' }
    ];

    return (
        <Layout>
            <div>
                <div className="welcome-header" style={{
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    borderRadius: '15px',
                    padding: '30px',
                    marginBottom: '30px',
                    color: 'white'
                }}>
                    <h1 style={{ marginBottom: '10px', fontSize: '28px' }}>
                        ⛽ Módulo de Ventas
                    </h1>
                    <p style={{ opacity: 0.9, marginBottom: 0 }}>
                        Gestión de ventas de combustible, turnos y cortes de caja
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

export default ModuloVentasPage;