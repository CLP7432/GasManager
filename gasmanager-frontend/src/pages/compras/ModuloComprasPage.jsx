import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';

const ModuloComprasPage = () => {
    const navigate = useNavigate();

    const submodulos = [
        {
            name: 'Proveedores',
            icon: '🏢',
            path: '/proveedores',
            color: '#17a2b8',
            description: 'Gestión de proveedores. Altas, bajas, consultas y actualizaciones.'
        },
        {
            name: 'Órdenes de Compra',
            icon: '📋',
            path: '/ordenes-compra',
            color: '#28a745',
            description: 'Creación y seguimiento de órdenes de compra.'
        },
        {
            name: 'Nueva Orden',
            icon: '➕',
            path: '/ordenes-compra/nueva',
            color: '#ffc107',
            description: 'Registrar una nueva orden de compra a proveedor.'
        },
        {
            name: 'Recepción de Compras',
            icon: '📦',
            path: '/ordenes-compra?estado=PENDIENTE',
            color: '#6f42c1',
            description: 'Recibir mercancía y actualizar inventario automáticamente.'
        }
    ];

    return (
        <Layout>
            <div>
                {/* Encabezado del módulo */}
                <div className="welcome-header" style={{
                    background: 'linear-gradient(135deg, #17a2b8 0%, #0f172a 100%)',
                    borderRadius: '15px',
                    padding: '30px',
                    marginBottom: '30px',
                    color: 'white'
                }}>
                    <h1 style={{ marginBottom: '10px', fontSize: '28px' }}>
                        🛒 Módulo de Compras
                    </h1>
                    <p style={{ opacity: 0.9, marginBottom: 0 }}>
                        Gestión integral de proveedores y órdenes de compra.
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
                            <li>Al <strong>recibir una orden</strong>, el inventario se actualiza automáticamente</li>
                            <li>Los proveedores pueden estar <strong>activos o inactivos</strong></li>
                            <li>Las órdenes de compra tienen estados: <strong>PENDIENTE, RECIBIDA, CANCELADA</strong></li>
                            <li>Se puede cancelar una orden <strong>solo si no ha sido recibida</strong></li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ModuloComprasPage;