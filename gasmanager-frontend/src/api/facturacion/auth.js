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

// ========== SERVICIO DE FACTURACIÓN ==========
export const facturacionService = {
    // Verificar si una venta es facturable
    verificarVentaFacturable: async (ventaId) => {
        const response = await api.get(`/facturas/venta/${ventaId}/facturable`);
        return response.data;
    },

    // Verificar múltiples ventas
    verificarVentasFacturables: async (ventasIds) => {
        const response = await api.post('/facturas/ventas/verificar', ventasIds);
        return response.data;
    },

    // Solicitar factura
    solicitarFactura: async (solicitud) => {
        const response = await api.post('/facturas/solicitar', solicitud);
        return response.data;
    },

    // Obtener factura por ID
    obtenerPorId: async (id) => {
        const response = await api.get(`/facturas/${id}`);
        return response.data;
    },

    // Obtener factura por folio
    obtenerPorFolio: async (folio) => {
        const response = await api.get(`/facturas/folio/${folio}`);
        return response.data;
    },

    // Listar todas las facturas
    listar: async () => {
        const response = await api.get('/facturas');
        return response.data;
    },

    // Listar facturas por cliente
    listarPorCliente: async (clienteId) => {
        const response = await api.get(`/facturas/cliente/${clienteId}`);
        return response.data;
    },

    // Listar facturas por RFC
    listarPorRFC: async (rfc) => {
        const response = await api.get(`/facturas/rfc/${rfc}`);
        return response.data;
    },

    // Cancelar factura
    cancelar: async (id, motivo = '') => {
        const url = motivo ? `/facturas/${id}/cancelar?motivo=${encodeURIComponent(motivo)}` : `/facturas/${id}/cancelar`;
        const response = await api.post(url);
        return response.data;
    },

    // Obtener PDF de la factura
    getPdfUrl: (folioFactura) => {
        return `/api/facturas/${folioFactura}/pdf`;
    }
};