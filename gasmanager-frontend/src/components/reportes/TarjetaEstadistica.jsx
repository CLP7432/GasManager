import React from 'react';

const TarjetaEstadistica = ({ titulo, valor, icono, color, subtitulo, loading }) => {
    return (
        <div className="stat-card" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${color || '#667eea'}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
        }}
             onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-3px)';
                 e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
             }}
             onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
             }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {titulo}
                    </p>
                    {loading ? (
                        <div className="skeleton" style={{ width: '100px', height: '32px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}></div>
                    ) : (
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                            {typeof valor === 'number' ? valor.toLocaleString('es-MX') : valor}
                        </h2>
                    )}
                    {subtitulo && (
                        <p style={{ fontSize: '12px', color: '#888', marginBottom: 0 }}>{subtitulo}</p>
                    )}
                </div>
                <div style={{
                    fontSize: '32px',
                    backgroundColor: `${color}15`,
                    padding: '10px',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icono}
                </div>
            </div>
        </div>
    );
};

export default TarjetaEstadistica;