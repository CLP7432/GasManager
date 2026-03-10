import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../services/api.js";
import {useAuth} from "../context/AuthContext.jsx"

export default function LoginPage(){
    const navigate = useNavigate();
    const {login} = useAuth();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("🔵 [1] handleSubmit ejecutado");
        console.log("🔵 [2] correo:", correo, "password:", password ? "****" : "vacío");

        setError(null);
        setLoading(true);

        try {
            console.log("🔵 [3] Intentando llamar a api.post...");
            console.log("🔵 [4] URL completa:", api.defaults.baseURL + "/usuarios/login");

            const response = await api.post("/usuarios/login", {
                correo, password
            });

            console.log("🟢 [5] Respuesta recibida del backend:", response.data);
            console.log("🟢 [6] Status:", response.status);

            const { token, rol, idUsuario, correo: userEmail } = response.data;

            //  GUARDAR EN LOCALSTORAGE (SOLO ESTO NUEVO)
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                token: token,
                rol: rol,
                idUsuario: idUsuario,
                correo: userEmail,
                nombre: userEmail.split('@')[0]
            }));

            // Guardamos el contexto (esto ya estaba)
            login({
                token, rol, idUsuario, correo: userEmail
            });

            console.log("🟢 [7] Token guardado, redirigiendo a dashboard...");
            navigate("/dashboard");

        } catch (err) {
            console.log("🔴 [8] ERROR capturado:");
            console.error("🔴 Error completo: ", err);
            console.error("🔴 Error response: ", err.response);
            console.error("🔴 Error message:", err.message);

            if (err.code === "ERR_NETWORK") {
                console.log("🔴 ERROR DE RED - El backend no responde");
            }

            setError(
                err.response?.data?.message ||
                err.response?.statusText ||
                "Error de conexion con el servidor"
            );
        } finally {
            console.log("🔵 [9] finally ejecutado");
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{maxWidth: 420, marginTop: '50px'}}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
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
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Cargando..." : "Entrar"}
                </button>

                {/* Debug info */}
                <div className="mt-3 small text-muted">
                    <p>Endpoint esperado: POST http://localhost:8090/api/usuarios/login</p>
                    <p>Body esperado: {"{ correo: '...', password: '...' }"}</p>
                </div>
            </form>
        </div>
    );
}