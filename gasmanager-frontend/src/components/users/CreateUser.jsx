import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext.jsx";

export function CreateUser({ onCreated }) {
    const { auth } = useAuth();
    const [form, setForm] = useState({
        nombre: "",
        correo: "",
        password: "",
        rol: { idRol: "" }
    });

    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Cargar roles disponibles al montar el componente
    useEffect(() => {
        cargarRoles();
    }, []);

    const cargarRoles = async () => {
        try {
            const response = await api.get('/roles/activos', {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setRoles(response.data);
        } catch (err) {
            console.error("Error cargando roles:", err);
            // Fallback con roles comunes
            setRoles([
                { idRol: 1, nombreRol: 'ROLE_ADMIN' },
                { idRol: 2, nombreRol: 'ADMINISTRADOR' },
                { idRol: 3, nombreRol: 'SUPERVISOR' },
                { idRol: 4, nombreRol: 'DESPACHADOR' },
                { idRol: 5, nombreRol: 'CONTADOR' }
            ]);
        } finally {
            setLoadingRoles(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'rol') {
            setForm(prev => ({
                ...prev,
                rol: { idRol: parseInt(value) }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setLoading(true);

        // Validar que se haya seleccionado un rol
        if (!form.rol.idRol) {
            setErrorMsg("Debe seleccionar un rol para el usuario");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post("/usuarios", form, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });
            setSuccessMsg("Usuario creado correctamente");
            setForm({ nombre: "", correo: "", password: "", rol: { idRol: "" } });
            onCreated?.(res.data);
        } catch (err) {
            const msg = err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Error al crear usuario";
            setErrorMsg(msg);
            console.error("Error al crear usuario:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm({ nombre: "", correo: "", password: "", rol: { idRol: "" } });
        setErrorMsg("");
        setSuccessMsg("");
    };

    if (loadingRoles) {
        return (
            <div className="card mb-4">
                <div className="card-body text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando roles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Crear Usuario</h5>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                className="form-control"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Correo</label>
                            <input
                                type="email"
                                name="correo"
                                className="form-control"
                                value={form.correo}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={form.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                minLength="6"
                            />
                            <small className="text-muted">Mínimo 6 caracteres</small>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Rol</label>
                            <select
                                className="form-select"
                                name="rol"
                                value={form.rol.idRol}
                                onChange={handleChange}
                                required
                                disabled={loading || roles.length === 0}
                            >
                                <option value="">Seleccionar rol...</option>
                                {roles.map(rol => (
                                    <option key={rol.idRol} value={rol.idRol}>
                                        {rol.nombreRol}
                                    </option>
                                ))}
                            </select>
                            {roles.length === 0 && (
                                <small className="text-danger">
                                    No hay roles disponibles
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 d-flex gap-2">
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? "Creando..." : "Crear"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Limpiar
                        </button>
                    </div>

                    {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
                    {successMsg && <div className="alert alert-success mt-3">{successMsg}</div>}
                </form>
            </div>
        </div>
    );
}