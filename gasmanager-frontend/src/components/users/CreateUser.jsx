import {useState} from "react";
import api from "../../services/api"

export function CreateUser({onCreated}){

    const [form, setForm] =useState({
       nombre: "",
       correo: "",
       password: ""
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({ ...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMsg("");
      setSuccessMsg("");
      setLoading(true);

      try{
          const res = await api.post("/usuarios", form);
          setSuccessMsg("Usuario creado correctamente");
          setForm({nombre: "", correo: "", password: ""});
          //Notificamos al padre para refrescar la lista
          onCreated?.(res.data);
      }catch (err){
          const msg = err?.response?.data?.message || "Error al crear usuario";
          setErrorMsg(msg);
          console.error("Error al crear usuario:", err);
      }finally {
          setLoading(false);
      }
    };

    return(
        <>
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
                                />
                            </div>
                        </div>
                        <div className="mt-3 d-flex gap-2">
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                {loading ? "Creando...": "Crear"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setForm({nombre: "", correo: "", password: ""});
                                    setErrorMsg("");
                                    setSuccessMsg("");
                                }}
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
        </>
    )
}