import axios from "axios";

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor: agrega el token a cada petición
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Helper para descargar archivos blob
export const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

// ========== SERVICIO DE REPORTES Y DASHBOARD ==========
export const reportesService = {
    // Dashboard principal
    getDashboard: async () => {
        const response = await api.get('/dashboard');
        return response.data;
    },

    // ========== GRÁFICAS ==========
    getVentasPorDia: async (dias = 7) => {
        const response = await api.get(`/dashboard/graficas/ventas-por-dia?dias=${dias}`);
        return response.data;
    },

    getVentasPorMes: async (meses = 6) => {
        const response = await api.get(`/dashboard/graficas/ventas-por-mes?meses=${meses}`);
        return response.data;
    },

    getVentasPorProducto: async () => {
        const response = await api.get('/dashboard/graficas/ventas-por-producto');
        return response.data;
    },

    getVentasPorMetodoPago: async () => {
        const response = await api.get('/dashboard/graficas/ventas-por-metodo-pago');
        return response.data;
    },

    getInventarioCombustible: async () => {
        const response = await api.get('/dashboard/graficas/inventario-combustible');
        return response.data;
    },

    getCreditosPorEstado: async () => {
        const response = await api.get('/dashboard/graficas/creditos-por-estado');
        return response.data;
    },

    getTopProductos: async (limite = 5) => {
        const response = await api.get(`/dashboard/graficas/top-productos?limite=${limite}`);
        return response.data;
    },

    // ========== REPORTE DE VENTAS ==========
    getReporteVentas: async (filtros = {}) => {
        const params = new URLSearchParams();

        if (filtros.fechaInicio) {
            const fechaStr = filtros.fechaInicio.includes('T') ? filtros.fechaInicio.split('T')[0] : filtros.fechaInicio;
            params.append('fechaInicio', fechaStr + 'T00:00:00');
        }
        if (filtros.fechaFin) {
            const fechaStr = filtros.fechaFin.includes('T') ? filtros.fechaFin.split('T')[0] : filtros.fechaFin;
            params.append('fechaFin', fechaStr + 'T23:59:59');
        }
        if (filtros.estado) params.append('estado', filtros.estado);
        if (filtros.metodoPago) params.append('metodoPago', filtros.metodoPago);

        const response = await api.get(`/reportes/ventas?${params.toString()}`);
        return response.data;
    },

    exportarVentasExcel: async (fechaInicio, fechaFin) => {
        const params = new URLSearchParams();
        if (fechaInicio) {
            const fechaStr = fechaInicio.includes('T') ? fechaInicio.split('T')[0] : fechaInicio;
            params.append('fechaInicio', fechaStr);
        }
        if (fechaFin) {
            const fechaStr = fechaFin.includes('T') ? fechaFin.split('T')[0] : fechaFin;
            params.append('fechaFin', fechaStr);
        }

        const response = await api.get(`/reportes/ventas/exportar/excel?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    exportarVentasPdf: async (fechaInicio, fechaFin) => {
        const params = new URLSearchParams();
        if (fechaInicio) {
            const fechaStr = fechaInicio.includes('T') ? fechaInicio.split('T')[0] : fechaInicio;
            params.append('fechaInicio', fechaStr);
        }
        if (fechaFin) {
            const fechaStr = fechaFin.includes('T') ? fechaFin.split('T')[0] : fechaFin;
            params.append('fechaFin', fechaStr);
        }

        const response = await api.get(`/reportes/ventas/exportar/pdf?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    // ========== REPORTE DE INVENTARIO ==========
    getReporteInventario: async () => {
        const response = await api.get('/reportes/inventario');
        return response.data;
    },

    exportarInventarioExcel: async () => {
        const response = await api.get('/reportes/inventario/exportar/excel', {
            responseType: 'blob'
        });
        return response.data;
    },

    exportarInventarioPdf: async () => {
        const response = await api.get('/reportes/inventario/exportar/pdf', {
            responseType: 'blob'
        });
        return response.data;
    },

    // ========== REPORTE DE FACTURACIÓN ==========
    getReporteFacturacion: async (fechaInicio, fechaFin) => {
        const params = new URLSearchParams();
        if (fechaInicio) {
            const fechaStr = fechaInicio.includes('T') ? fechaInicio.split('T')[0] : fechaInicio;
            params.append('fechaInicio', fechaStr + 'T00:00:00');
        }
        if (fechaFin) {
            const fechaStr = fechaFin.includes('T') ? fechaFin.split('T')[0] : fechaFin;
            params.append('fechaFin', fechaStr + 'T23:59:59');
        }

        const response = await api.get(`/reportes/facturacion?${params.toString()}`);
        return response.data;
    },

    exportarFacturacionExcel: async (fechaInicio, fechaFin) => {
        const params = new URLSearchParams();
        if (fechaInicio) {
            const fechaStr = fechaInicio.includes('T') ? fechaInicio.split('T')[0] : fechaInicio;
            params.append('fechaInicio', fechaStr);
        }
        if (fechaFin) {
            const fechaStr = fechaFin.includes('T') ? fechaFin.split('T')[0] : fechaFin;
            params.append('fechaFin', fechaStr);
        }

        const response = await api.get(`/reportes/facturacion/exportar/excel?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    exportarFacturacionPdf: async (fechaInicio, fechaFin) => {
        const params = new URLSearchParams();
        if (fechaInicio) {
            const fechaStr = fechaInicio.includes('T') ? fechaInicio.split('T')[0] : fechaInicio;
            params.append('fechaInicio', fechaStr);
        }
        if (fechaFin) {
            const fechaStr = fechaFin.includes('T') ? fechaFin.split('T')[0] : fechaFin;
            params.append('fechaFin', fechaStr);
        }

        const response = await api.get(`/reportes/facturacion/exportar/pdf?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    // ========== REPORTE DE CRÉDITOS ==========
    getReporteCreditos: async (estado = '') => {
        const params = new URLSearchParams();
        if (estado) params.append('estado', estado);

        const response = await api.get(`/reportes/creditos?${params.toString()}`);
        return response.data;
    },

    exportarCreditosExcel: async () => {
        const response = await api.get('/reportes/creditos/exportar/excel', {
            responseType: 'blob'
        });
        return response.data;
    },

    exportarCreditosPdf: async () => {
        const response = await api.get('/reportes/creditos/exportar/pdf', {
            responseType: 'blob'
        });
        return response.data;
    },

    // ========== REPORTE DE NÓMINA ==========
    getReporteNomina: async (fechaInicio, fechaFin) => {
        const params = new URLSearchParams();
        if (fechaInicio) {
            const fechaStr = fechaInicio.includes('T') ? fechaInicio.split('T')[0] : fechaInicio;
            params.append('fechaInicio', fechaStr + 'T00:00:00');
        }
        if (fechaFin) {
            const fechaStr = fechaFin.includes('T') ? fechaFin.split('T')[0] : fechaFin;
            params.append('fechaFin', fechaStr + 'T23:59:59');
        }

        const response = await api.get(`/reportes/nomina?${params.toString()}`);
        return response.data;
    },

    exportarNominaExcel: async (fechaInicio, fechaFin) => {
        const params = new URLSearchParams();
        if (fechaInicio) {
            const fechaStr = fechaInicio.includes('T') ? fechaInicio.split('T')[0] : fechaInicio;
            params.append('fechaInicio', fechaStr);
        }
        if (fechaFin) {
            const fechaStr = fechaFin.includes('T') ? fechaFin.split('T')[0] : fechaFin;
            params.append('fechaFin', fechaStr);
        }

        const response = await api.get(`/reportes/nomina/exportar/excel?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    exportarNominaPdf: async (fechaInicio, fechaFin) => {
        const params = new URLSearchParams();
        if (fechaInicio) {
            const fechaStr = fechaInicio.includes('T') ? fechaInicio.split('T')[0] : fechaInicio;
            params.append('fechaInicio', fechaStr);
        }
        if (fechaFin) {
            const fechaStr = fechaFin.includes('T') ? fechaFin.split('T')[0] : fechaFin;
            params.append('fechaFin', fechaStr);
        }

        const response = await api.get(`/reportes/nomina/exportar/pdf?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    // ========== REPORTE DE LEALTAD ==========
    getReporteLealtad: async () => {
        const response = await api.get('/reportes/lealtad');
        return response.data;
    },

    exportarLealtadExcel: async () => {
        const response = await api.get('/reportes/lealtad/exportar/excel', {
            responseType: 'blob'
        });
        return response.data;
    },

    exportarLealtadPdf: async () => {
        const response = await api.get('/reportes/lealtad/exportar/pdf', {
            responseType: 'blob'
        });
        return response.data;
    }
};