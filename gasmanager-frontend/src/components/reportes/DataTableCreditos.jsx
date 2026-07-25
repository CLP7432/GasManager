import React, { useEffect, useRef } from 'react';
import { reportesService } from '../../api/reportes/auth';

const DataTableCreditos = () => {
    const tableRef = useRef(null);
    const dataTableRef = useRef(null);

    useEffect(() => {
        cargarDatos();
        return () => {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
            }
        };
    }, []);

    const cargarDatos = async () => {
        try {
            const data = await reportesService.getReporteCreditos();

            if (tableRef.current) {
                if (dataTableRef.current) {
                    dataTableRef.current.destroy();
                }

                const tbody = tableRef.current.querySelector('tbody');
                tbody.innerHTML = '';

                data.forEach(credito => {
                    const row = tbody.insertRow();
                    row.insertCell(0).innerHTML = `<code>${credito.folioCredito}</code>`;
                    row.insertCell(1).innerHTML = credito.clienteNombre;
                    row.insertCell(2).innerHTML = credito.clienteRfc || '-';
                    row.insertCell(3).innerHTML = `$${credito.montoTotal.toFixed(2)}`;
                    row.insertCell(4).innerHTML = `$${credito.montoPagado.toFixed(2)}`;
                    row.insertCell(5).innerHTML = `<strong class="text-danger">$${credito.saldoPendiente.toFixed(2)}</strong>`;
                    row.insertCell(6).innerHTML = new Date(credito.fechaInicio).toLocaleDateString('es-MX');
                    row.insertCell(7).innerHTML = credito.fechaVencimiento ? new Date(credito.fechaVencimiento).toLocaleDateString('es-MX') : '-';

                    let estadoClass = 'bg-secondary';
                    if (credito.estado === 'ACTIVO') estadoClass = 'bg-success';
                    else if (credito.estado === 'VENCIDO') estadoClass = 'bg-danger';
                    else if (credito.estado === 'PAGADO') estadoClass = 'bg-info';

                    row.insertCell(8).innerHTML = `<span class="badge ${estadoClass}">${credito.estado}</span>`;
                });

                dataTableRef.current = $(tableRef.current).DataTable({
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
                    },
                    pageLength: 10,
                    order: [[0, 'desc']]
                });
            }
        } catch (error) {
            console.error('Error cargando créditos:', error);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="m-0">💰 Reporte de Créditos</h5>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table ref={tableRef} className="table table-striped" style={{ width: '100%' }}>
                        <thead>
                        <tr>
                            <th>Folio</th>
                            <th>Cliente</th>
                            <th>RFC</th>
                            <th>Monto Total</th>
                            <th>Pagado</th>
                            <th>Saldo</th>
                            <th>Inicio</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataTableCreditos;