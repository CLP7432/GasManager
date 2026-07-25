import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';

const ModuloNominaPage = () => {
    const navigate = useNavigate();

    const submodulos = [
        {
            name: 'Empleados',
            icon: '👥',
            path: '/empleados',
            color: '#fd7e14',
            description: 'Gestión de empleados. Altas, bajas, consultas y actualizaciones.'
        },
        {
            name: 'Puestos',
            icon: '📋',
            path: '/puestos',
            color: '#17a2b8',
            description: 'Administración de puestos y salarios base.'
        },
        {
            name: 'Departamentos',
            icon: '🏢',
            path: '/departamentos',
            color: '#6f42c1',
            description: 'Organización de departamentos de la empresa.'
        },
        {
            name: 'Incidencias',
            icon: '📝',
            path: '/incidencias',
            color: '#ffc107',
            description: 'Registro de faltas, bonos, horas extras y permisos.'
        },
        {
            name: 'Procesar Nómina',
            icon: '💰',
            path: '/nominas/procesar',
            color: '#28a745',
            description: 'Cálculo y procesamiento de nómina por periodo.'
        },
        {
            name: 'Historial de Nóminas',
            icon: '📄',
            path: '/nominas',
            color: '#20c997',
            description: 'Consulta de nóminas procesadas y recibos.'
        }
    ];

    return (
        <Layout>
            <div>
                {/* Encabezado del módulo */}
                <div className="welcome-header" style={{
                    background: 'linear-gradient(135deg, #fd7e14 0%, #0f172a 100%)',
                    borderRadius: '15px',
                    padding: '30px',
                    marginBottom: '30px',
                    color: 'white'
                }}>
                    <h1 style={{ marginBottom: '10px', fontSize: '28px' }}>
                        👥 Módulo de Nómina
                    </h1>
                    <p style={{ opacity: 0.9, marginBottom: 0 }}>
                        Gestión integral de empleados, puestos, incidencias y cálculo de nómina.
                    </p>
                </div>

                {/* Submódulos */}
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Submódulos disponibles</h2>

                <div className="modules-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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

                {/* Información adicional */}
                <div className="card" style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
                    <div className="card-body">
                        <h5>📌 Información importante</h5>
                        <ul className="mb-0">
                            <li>El cálculo de nómina incluye <strong>ISR, Seguro Social, Infonavit y Cuota Sindical</strong></li>
                            <li>Las incidencias registradas afectan automáticamente el cálculo de la nómina</li>
                            <li>Los <strong>bonos</strong> incrementan el total gravado del empleado</li>
                            <li>Las <strong>faltas</strong> descuentan el salario proporcional</li>
                            <li>Las <strong>horas extras</strong> se pagan al doble o triple según corresponda</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ModuloNominaPage;