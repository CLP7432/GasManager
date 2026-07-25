import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AsistenteIA = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [mensajes, setMensajes] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [contexto, setContexto] = useState('GENERAL');
    const mensajesEndRef = useRef(null);

    // Cargar mensajes guardados al iniciar
    useEffect(() => {
        const guardados = localStorage.getItem('asistenteIA_mensajes');
        if (guardados) {
            try {
                const mensajesGuardados = JSON.parse(guardados);
                // Convertir timestamp string de vuelta a Date
                const mensajesConFecha = mensajesGuardados.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                setMensajes(mensajesConFecha);
            } catch (e) {
                console.error('Error cargando mensajes:', e);
                setMensajes([mensajeInicial]);
            }
        } else {
            setMensajes([mensajeInicial]);
        }
    }, []);

    // Guardar mensajes cuando cambien
    useEffect(() => {
        if (mensajes.length > 0) {
            localStorage.setItem('asistenteIA_mensajes', JSON.stringify(mensajes));
        }
    }, [mensajes]);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (mensajesEndRef.current) {
            mensajesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [mensajes]);

    // Detectar contexto según la URL actual
    useEffect(() => {
        const path = window.location.pathname;
        if (path.includes('ventas') || path.includes('punto-venta') || path.includes('turnos') || path.includes('cortes')) {
            setContexto('VENTAS');
        } else if (path.includes('inventarios') || path.includes('combustibles') || path.includes('aceites')) {
            setContexto('INVENTARIO');
        } else if (path.includes('reportes')) {
            setContexto('REPORTES');
        } else if (path.includes('admin') || path.includes('usuarios') || path.includes('dispensarios')) {
            setContexto('ADMINISTRACION');
        } else {
            setContexto('GENERAL');
        }
    }, [typeof window !== 'undefined' ? window.location.pathname : '']);

    const mensajeInicial = {
        id: 1,
        texto: "¡Hola! Soy GasManager Assistant. ¿En qué puedo ayudarte hoy?",
        esUsuario: false,
        timestamp: new Date()
    };

    const enviarMensaje = async () => {
        if (!input.trim()) return;

        // Agregar mensaje del usuario
        const mensajeUsuario = {
            id: Date.now(),
            texto: input,
            esUsuario: true,
            timestamp: new Date()
        };
        setMensajes(prev => [...prev, mensajeUsuario]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/ia/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mensaje: input,
                    contexto: contexto,
                    usuarioId: user?.idUsuario || '1',
                    usuarioNombre: user?.nombre || 'Usuario'
                })
            });

            const data = await response.json();

            const mensajeBot = {
                id: Date.now() + 1,
                texto: data.respuesta || 'Lo siento, no pude procesar tu solicitud.',
                esUsuario: false,
                timestamp: new Date(),
                error: !data.exito
            };
            setMensajes(prev => [...prev, mensajeBot]);

        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            const mensajeError = {
                id: Date.now() + 1,
                texto: 'Error de conexión. Por favor intenta más tarde.',
                esUsuario: false,
                timestamp: new Date(),
                error: true
            };
            setMensajes(prev => [...prev, mensajeError]);
        } finally {
            setLoading(false);
        }
    };

    const limpiarHistorial = () => {
        if (window.confirm('¿Borrar todo el historial de conversación?')) {
            setMensajes([mensajeInicial]);
            localStorage.removeItem('asistenteIA_mensajes');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    };

    const formatearHora = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Botón flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    fontSize: '24px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.backgroundColor = '#20c997';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#28a745';
                }}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Ventana de chat */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '90px',
                        right: '20px',
                        width: '380px',
                        height: '550px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 1000,
                        fontFamily: 'sans-serif'
                    }}
                >
                    {/* Cabecera */}
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            color: 'white',
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}
                        >
                            🤖
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '14px' }}>GasManager Assistant</h4>
                            <small style={{ opacity: 0.8, fontSize: '10px' }}>
                                Módulo: {contexto}
                            </small>
                        </div>
                        <button
                            onClick={limpiarHistorial}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                padding: '4px 8px',
                                fontSize: '11px',
                                cursor: 'pointer'
                            }}
                            title="Limpiar historial"
                        >
                            🗑️ Limpiar
                        </button>
                        <div style={{ fontSize: '11px', opacity: 0.8 }}>
                            {loading ? '✍️' : '●'}
                        </div>
                    </div>

                    {/* Mensajes */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '12px',
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}
                    >
                        {mensajes.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: msg.esUsuario ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '80%',
                                        padding: '8px 12px',
                                        borderRadius: '16px',
                                        backgroundColor: msg.esUsuario ? '#28a745' : 'white',
                                        color: msg.esUsuario ? 'white' : '#333',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                        border: msg.esUsuario ? 'none' : '1px solid #e0e0e0'
                                    }}
                                >
                                    <div style={{ fontSize: '13px', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                                        {msg.texto}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '9px',
                                            marginTop: '4px',
                                            opacity: 0.6,
                                            textAlign: msg.esUsuario ? 'right' : 'left'
                                        }}
                                    >
                                        {formatearHora(msg.timestamp)}
                                        {msg.error && ' ⚠️'}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div
                                    style={{
                                        backgroundColor: 'white',
                                        padding: '8px 12px',
                                        borderRadius: '16px',
                                        border: '1px solid #e0e0e0',
                                        display: 'flex',
                                        gap: '4px'
                                    }}
                                >
                                    <span className="dot-pulse">●</span>
                                    <span className="dot-pulse">●</span>
                                    <span className="dot-pulse">●</span>
                                </div>
                            </div>
                        )}
                        <div ref={mensajesEndRef} />
                    </div>

                    {/* Sugerencias rápidas */}
                    <div
                        style={{
                            padding: '8px 12px',
                            backgroundColor: '#f1f3f5',
                            borderTop: '1px solid #e0e0e0',
                            borderBottom: '1px solid #e0e0e0',
                            display: 'flex',
                            gap: '6px',
                            flexWrap: 'wrap'
                        }}
                    >
                        {[
                            '¿Cómo vender combustible?',
                            'Ver resumen de ventas',
                            '¿Qué es un corte de turno?',
                            'Precios actuales'
                        ].map((sugerencia, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setInput(sugerencia);
                                    setTimeout(() => enviarMensaje(), 100);
                                }}
                                style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '20px',
                                    padding: '4px 10px',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    color: '#495057',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e9ecef';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                }}
                            >
                                {sugerencia}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding: '10px',
                            display: 'flex',
                            gap: '8px',
                            backgroundColor: 'white'
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu pregunta..."
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '20px',
                                outline: 'none',
                                fontSize: '13px'
                            }}
                            disabled={loading}
                        />
                        <button
                            onClick={enviarMensaje}
                            disabled={loading || !input.trim()}
                            style={{
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '34px',
                                height: '34px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: loading || !input.trim() ? 0.5 : 1
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .dot-pulse {
                    animation: pulse 1.4s infinite;
                    animation-fill-mode: both;
                }
                .dot-pulse:nth-child(1) { animation-delay: -0.32s; }
                .dot-pulse:nth-child(2) { animation-delay: -0.16s; }
                @keyframes pulse {
                    0%, 80%, 100% { opacity: 0.3; }
                    40% { opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default AsistenteIA;