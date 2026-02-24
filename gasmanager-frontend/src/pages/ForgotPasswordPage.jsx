import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!correo.trim()) {
            setError('Por favor ingresa tu correo electrónico');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/password-reset/solicitar', {
                correo: correo,
                baseUrl: window.location.origin // Para construir el enlace
            });

            setSuccess(true);
            setCorreo(''); // Limpiar campo

        } catch (err) {
            console.error("Error solicitando recuperación:", err);
            setError(
                err.response?.data?.message ||
                'Error al procesar la solicitud. Intenta nuevamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: 420, marginTop: '50px' }}>
            <div className="card">
                <div className="card-header">
                    <h2 className="mb-0">Recuperar Contraseña</h2>
                </div>

                <div className="card-body">
                    <p className="text-muted mb-4">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                    </p>

                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            ✅ Si el correo existe en nuestro sistema, recibirás instrucciones en unos minutos.
                            <br />
                            <small className="text-muted">
                                Revisa tu bandeja de entrada y carpeta de spam.
                            </small>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Correo Electrónico *</label>
                            <input
                                type="email"
                                className="form-control"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="ejemplo@correo.com"
                            />
                        </div>

                        <button
                            className="btn btn-primary w-100 mb-3"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => navigate('/login')}
                                disabled={loading}
                            >
                                ← Volver al inicio de sesión
                            </button>
                        </div>
                    </form>

                    {/* Info para desarrollo */}
                    <div className="mt-4 small text-muted">
                        <p><strong>Para desarrollo:</strong></p>
                        <p>1. MailDev: <a href="http://localhost:1080" target="_blank">http://localhost:1080</a></p>
                        <p>2. Endpoint: POST /api/password-reset/solicitar</p>
                        <p>3. Body: {"{ correo: '...', baseUrl: '...' }"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}