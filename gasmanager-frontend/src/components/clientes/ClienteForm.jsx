import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientesService } from '../../api/clientes/auth';

const ClienteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [esEdicion, setEsEdicion] = useState(false);

    const [formData, setFormData] = useState({
        tipoPersona: 'FISICA',
        razonSocial: '',
        nombreComercial: '',
        rfc: '',
        curp: '',
        email: '',
        telefono: '',
        celular: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        colonia: '',
        ciudad: '',
        estado: '',
        codigoPostal: ''
    });

    useEffect(() => {
        if (id) {
            setEsEdicion(true);
            cargarCliente();
        } else {
            setEsEdicion(false);
        }
    }, [id]);

    const cargarCliente = async () => {
        setCargandoDatos(true);
        try {
            const data = await clientesService.obtenerPorId(id);
            setFormData({
                tipoPersona: data.tipoPersona || 'FISICA',
                razonSocial: data.razonSocial || '',
                nombreComercial: data.nombreComercial || '',
                rfc: data.rfc || '',
                curp: data.curp || '',
                email: data.email || '',
                telefono: data.telefono || '',
                celular: data.celular || '',
                calle: data.calle || '',
                numeroExterior: data.numeroExterior || '',
                numeroInterior: data.numeroInterior || '',
                colonia: data.colonia || '',
                ciudad: data.ciudad || '',
                estado: data.estado || '',
                codigoPostal: data.codigoPostal || ''
            });
        } catch (error) {
            console.error('Error al cargar cliente:', error);
            alert('Error al cargar los datos del cliente');
        }
        setCargandoDatos(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validaciones básicas
            if (!formData.razonSocial.trim()) {
                alert('La razón social es obligatoria');
                setLoading(false);
                return;
            }

            const clienteData = {
                tipoPersona: formData.tipoPersona,
                razonSocial: formData.razonSocial.trim(),
                nombreComercial: formData.nombreComercial?.trim() || null,
                rfc: formData.rfc?.trim() || null,
                curp: formData.curp?.trim() || null,
                email: formData.email?.trim() || null,
                telefono: formData.telefono?.trim() || null,
                celular: formData.celular?.trim() || null,
                calle: formData.calle?.trim() || null,
                numeroExterior: formData.numeroExterior?.trim() || null,
                numeroInterior: formData.numeroInterior?.trim() || null,
                colonia: formData.colonia?.trim() || null,
                ciudad: formData.ciudad?.trim() || null,
                estado: formData.estado?.trim() || null,
                codigoPostal: formData.codigoPostal?.trim() || null
            };

            if (esEdicion) {
                await clientesService.actualizar(id, clienteData);
                alert('✅ Cliente actualizado exitosamente');
            } else {
                await clientesService.crear(clienteData);
                alert('✅ Cliente creado exitosamente');
            }
            navigate('/clientes');
        } catch (error) {
            console.error('Error al guardar:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.errors || 'Error al guardar cliente';
            if (typeof errorMsg === 'object') {
                const firstError = Object.values(errorMsg)[0];
                alert(firstError);
            } else {
                alert(errorMsg);
            }
        }
        setLoading(false);
    };

    if (cargandoDatos) {
        return (
            <div className="card text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando datos del cliente...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h2>{esEdicion ? '✏️ Editar Cliente' : '👤 Nuevo Cliente'}</h2>

                <form onSubmit={handleSubmit}>
                    {/* ===== TIPO DE PERSONA ===== */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Tipo de Persona *</label>
                            <select
                                className="form-select"
                                name="tipoPersona"
                                value={formData.tipoPersona}
                                onChange={handleChange}
                                required
                            >
                                <option value="FISICA">Persona Física</option>
                                <option value="MORAL">Persona Moral</option>
                            </select>
                        </div>
                    </div>

                    {/* ===== DATOS DE IDENTIFICACIÓN ===== */}
                    <h5 className="mt-3 mb-3 border-bottom pb-2">📋 Datos de Identificación</h5>
                    <div className="row g-3">
                        <div className="col-md-12">
                            <label className="form-label">
                                {formData.tipoPersona === 'FISICA' ? 'Nombre Completo' : 'Razón Social'} *
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="razonSocial"
                                value={formData.razonSocial}
                                onChange={handleChange}
                                required
                                placeholder={formData.tipoPersona === 'FISICA' ? 'Nombre completo' : 'Razón social de la empresa'}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Nombre Comercial</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombreComercial"
                                value={formData.nombreComercial}
                                onChange={handleChange}
                                placeholder="Nombre comercial (opcional)"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">RFC</label>
                            <input
                                type="text"
                                className="form-control"
                                name="rfc"
                                value={formData.rfc}
                                onChange={handleChange}
                                placeholder="RFC (opcional)"
                                maxLength="13"
                                style={{ textTransform: 'uppercase' }}
                            />
                        </div>
                        {formData.tipoPersona === 'FISICA' && (
                            <div className="col-md-6">
                                <label className="form-label">CURP</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="curp"
                                    value={formData.curp}
                                    onChange={handleChange}
                                    placeholder="CURP (opcional)"
                                    maxLength="18"
                                    style={{ textTransform: 'uppercase' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* ===== DATOS DE CONTACTO ===== */}
                    <h5 className="mt-4 mb-3 border-bottom pb-2">📞 Datos de Contacto</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="5551234567"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Celular</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="celular"
                                value={formData.celular}
                                onChange={handleChange}
                                placeholder="5551234567"
                            />
                        </div>
                    </div>

                    {/* ===== DIRECCIÓN ===== */}
                    <h5 className="mt-4 mb-3 border-bottom pb-2">📍 Dirección</h5>
                    <div className="row g-3">
                        <div className="col-md-8">
                            <label className="form-label">Calle</label>
                            <input
                                type="text"
                                className="form-control"
                                name="calle"
                                value={formData.calle}
                                onChange={handleChange}
                                placeholder="Calle"
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Núm. Ext.</label>
                            <input
                                type="text"
                                className="form-control"
                                name="numeroExterior"
                                value={formData.numeroExterior}
                                onChange={handleChange}
                                placeholder="123"
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Núm. Int.</label>
                            <input
                                type="text"
                                className="form-control"
                                name="numeroInterior"
                                value={formData.numeroInterior}
                                onChange={handleChange}
                                placeholder="A, B, 1"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Colonia</label>
                            <input
                                type="text"
                                className="form-control"
                                name="colonia"
                                value={formData.colonia}
                                onChange={handleChange}
                                placeholder="Colonia"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Ciudad</label>
                            <input
                                type="text"
                                className="form-control"
                                name="ciudad"
                                value={formData.ciudad}
                                onChange={handleChange}
                                placeholder="Ciudad"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Estado</label>
                            <input
                                type="text"
                                className="form-control"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                placeholder="Estado"
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">CP</label>
                            <input
                                type="text"
                                className="form-control"
                                name="codigoPostal"
                                value={formData.codigoPostal}
                                onChange={handleChange}
                                placeholder="06000"
                                maxLength="5"
                            />
                        </div>
                    </div>

                    {/* ===== BOTONES ===== */}
                    <div className="d-flex gap-2 mt-4">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : (esEdicion ? '💾 Actualizar Cliente' : '✅ Crear Cliente')}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/clientes')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClienteForm;