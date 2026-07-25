import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nominasService } from '../../api/nomina/auth';

const ProcesarNomina = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        periodoInicio: '',
        periodoFin: '',
        fechaPago: new Date().toISOString().split('T')[0],
        observaciones: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.periodoInicio || !formData.periodoFin) {
            alert('Debe seleccionar el periodo de la nómina');
            return;
        }

        if (new Date(formData.periodoInicio) > new Date(formData.periodoFin)) {
            alert('La fecha de inicio no puede ser mayor a la fecha de fin');
            return;
        }

        setLoading(true);

        try {
            const nomina = await nominasService.procesar({
                periodoInicio: formData.periodoInicio,
                periodoFin: formData.periodoFin,
                fechaPago: formData.fechaPago || null,
                observaciones: formData.observaciones || null
            });
            alert(`Nómina procesada exitosamente\nFolio: ${nomina.folioNomina}\nTotal Neto: $${nomina.totalNeto}`);
            navigate(`/nominas/${nomina.id}`);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error al procesar nómina';
            alert(errorMsg);
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <h2>Procesar Nómina</h2>
                <p className="text-muted">Seleccione el periodo para calcular la nómina de todos los empleados activos</p>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Fecha de Inicio *</label>
                            <input
                                type="date"
                                className="form-control"
                                name="periodoInicio"
                                value={formData.periodoInicio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Fecha de Fin *</label>
                            <input
                                type="date"
                                className="form-control"
                                name="periodoFin"
                                value={formData.periodoFin}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Fecha de Pago</label>
                        <input
                            type="date"
                            className="form-control"
                            name="fechaPago"
                            value={formData.fechaPago}
                            onChange={handleChange}
                        />
                        <small className="text-muted">Si no se especifica, se usará la fecha actual</small>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Observaciones</label>
                        <textarea
                            className="form-control"
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Información adicional sobre esta nómina"
                        />
                    </div>

                    <div className="alert alert-info">
                        <strong>📌 Información importante:</strong>
                        <ul className="mb-0 mt-2">
                            <li>La nómina se calculará para <strong>TODOS los empleados activos</strong></li>
                            <li>Se considerarán las <strong>incidencias registradas</strong> en el periodo (faltas, bonos, horas extras)</li>
                            <li>El cálculo incluye: <strong>ISR, Seguro Social, Infonavit y Cuota Sindical</strong></li>
                            <li>No se puede procesar una nómina para un periodo ya procesado</li>
                        </ul>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Procesando...' : 'Procesar Nómina'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/nominas')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProcesarNomina;