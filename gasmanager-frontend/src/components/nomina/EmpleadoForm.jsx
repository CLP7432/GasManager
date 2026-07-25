import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { empleadosService, puestosService, departamentosService } from '../../api/nomina/auth';

const EmpleadoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [puestos, setPuestos] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        rfc: '',
        curp: '',
        nss: '',
        email: '',
        telefono: '',
        celular: '',
        fechaNacimiento: '',
        fechaIngreso: new Date().toISOString().split('T')[0],
        puestoId: '',
        departamentoId: '',
        tipoContrato: 'INDEFINIDO',
        tipoJornada: 'DIURNA',
        salarioDiario: '',
        numeroCuenta: '',
        banco: '',
        direccion: ''
    });

    useEffect(() => {
        cargarCatalogos();
        if (id) {
            cargarEmpleado();
        }
    }, [id]);

    const cargarCatalogos = async () => {
        try {
            const [puestosData, departamentosData] = await Promise.all([
                puestosService.listarActivos(),
                departamentosService.listarActivos()
            ]);
            setPuestos(puestosData);
            setDepartamentos(departamentosData);
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
        }
    };

    const cargarEmpleado = async () => {
        try {
            const data = await empleadosService.obtenerPorId(id);
            setFormData({
                nombre: data.nombre || '',
                apellidoPaterno: data.apellidoPaterno || '',
                apellidoMaterno: data.apellidoMaterno || '',
                rfc: data.rfc || '',
                curp: data.curp || '',
                nss: data.nss || '',
                email: data.email || '',
                telefono: data.telefono || '',
                celular: data.celular || '',
                fechaNacimiento: data.fechaNacimiento || '',
                fechaIngreso: data.fechaIngreso || new Date().toISOString().split('T')[0],
                puestoId: data.puestoId || '',
                departamentoId: data.departamentoId || '',
                tipoContrato: data.tipoContrato || 'INDEFINIDO',
                tipoJornada: data.tipoJornada || 'DIURNA',
                salarioDiario: data.salarioDiario || '',
                numeroCuenta: data.numeroCuenta || '',
                banco: data.banco || '',
                direccion: data.direccion || ''
            });
        } catch (error) {
            console.error('Error al cargar empleado:', error);
            alert('Error al cargar empleado');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const empleadoData = {
                nombre: formData.nombre,
                apellidoPaterno: formData.apellidoPaterno,
                apellidoMaterno: formData.apellidoMaterno || null,
                rfc: formData.rfc || null,
                curp: formData.curp || null,
                nss: formData.nss || null,
                email: formData.email || null,
                telefono: formData.telefono || null,
                celular: formData.celular || null,
                fechaNacimiento: formData.fechaNacimiento || null,
                fechaIngreso: formData.fechaIngreso,
                puestoId: formData.puestoId ? parseInt(formData.puestoId) : null,
                departamentoId: formData.departamentoId ? parseInt(formData.departamentoId) : null,
                tipoContrato: formData.tipoContrato,
                tipoJornada: formData.tipoJornada,
                salarioDiario: parseFloat(formData.salarioDiario),
                numeroCuenta: formData.numeroCuenta || null,
                banco: formData.banco || null,
                direccion: formData.direccion || null
            };

            if (id) {
                await empleadosService.actualizar(id, empleadoData);
                alert('Empleado actualizado exitosamente');
            } else {
                await empleadosService.crear(empleadoData);
                alert('Empleado creado exitosamente');
            }
            navigate('/empleados');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.errors || 'Error al guardar empleado';
            if (typeof errorMsg === 'object') {
                const firstError = Object.values(errorMsg)[0];
                alert(firstError);
            } else {
                alert(errorMsg);
            }
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2>{id ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>

                <form onSubmit={handleSubmit}>
                    {/* Datos Personales */}
                    <h5 className="mt-3 mb-3">Datos Personales</h5>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Nombre *</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Apellido Paterno *</label>
                            <input
                                type="text"
                                className="form-control"
                                name="apellidoPaterno"
                                value={formData.apellidoPaterno}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Apellido Materno</label>
                            <input
                                type="text"
                                className="form-control"
                                name="apellidoMaterno"
                                value={formData.apellidoMaterno}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">RFC</label>
                            <input
                                type="text"
                                className="form-control"
                                name="rfc"
                                value={formData.rfc}
                                onChange={handleChange}
                                placeholder="RFC (opcional)"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">CURP</label>
                            <input
                                type="text"
                                className="form-control"
                                name="curp"
                                value={formData.curp}
                                onChange={handleChange}
                                placeholder="CURP (opcional)"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">NSS</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nss"
                                value={formData.nss}
                                onChange={handleChange}
                                placeholder="NSS (opcional)"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Contacto */}
                    <h5 className="mt-4 mb-3">Datos de Contacto</h5>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Celular</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="celular"
                                value={formData.celular}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Dirección</label>
                            <textarea
                                className="form-control"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                rows="2"
                            />
                        </div>
                    </div>

                    {/* Datos Laborales */}
                    <h5 className="mt-4 mb-3">Datos Laborales</h5>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Fecha de Ingreso *</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaIngreso"
                                value={formData.fechaIngreso}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Puesto</label>
                            <select
                                className="form-select"
                                name="puestoId"
                                value={formData.puestoId}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione un puesto</option>
                                {puestos.map(puesto => (
                                    <option key={puesto.id} value={puesto.id}>
                                        {puesto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Departamento</label>
                            <select
                                className="form-select"
                                name="departamentoId"
                                value={formData.departamentoId}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione un departamento</option>
                                {departamentos.map(depto => (
                                    <option key={depto.id} value={depto.id}>
                                        {depto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Salario Diario *</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="form-control"
                                    name="salarioDiario"
                                    value={formData.salarioDiario}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Tipo de Contrato</label>
                            <select
                                className="form-select"
                                name="tipoContrato"
                                value={formData.tipoContrato}
                                onChange={handleChange}
                            >
                                <option value="INDEFINIDO">Indefinido</option>
                                <option value="TEMPORAL">Temporal</option>
                                <option value="POR_TIEMPO_DETERMINADO">Por tiempo determinado</option>
                                <option value="PRACTICAS">Prácticas</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Tipo de Jornada</label>
                            <select
                                className="form-select"
                                name="tipoJornada"
                                value={formData.tipoJornada}
                                onChange={handleChange}
                            >
                                <option value="DIURNA">Diurna</option>
                                <option value="NOCTURNA">Nocturna</option>
                                <option value="MIXTA">Mixta</option>
                                <option value="TURNO_ROTATIVO">Turno rotativo</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Banco</label>
                            <input
                                type="text"
                                className="form-control"
                                name="banco"
                                value={formData.banco}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Número de Cuenta</label>
                            <input
                                type="text"
                                className="form-control"
                                name="numeroCuenta"
                                value={formData.numeroCuenta}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="alert alert-info mt-3">
                        <small>
                            <strong>Información:</strong> El salario mensual se calcula automáticamente como (Salario Diario × 30).
                            Las incidencias (faltas, bonos, horas extras) se registrarán por separado.
                        </small>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/empleados')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmpleadoForm;