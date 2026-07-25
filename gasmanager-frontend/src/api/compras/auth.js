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

// ========== SERVICIO DE PROVEEDORES ==========
export const proveedoresService = {
    listar: async () => {
        const response = await api.get('/proveedores');
        return response.data;
    },
    listarActivos: async () => {
        const response = await api.get('/proveedores/activos');
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/proveedores/${id}`);
        return response.data;
    },
    buscarPorNombre: async (nombre) => {
        const response = await api.get(`/proveedores/buscar?nombre=${nombre}`);
        return response.data;
    },
    crear: async (data) => {
        const response = await api.post('/proveedores', data);
        return response.data;
    },
    actualizar: async (id, data) => {
        const response = await api.put(`/proveedores/${id}`, data);
        return response.data;
    },
    toggleActivo: async (id) => {
        const response = await api.patch(`/proveedores/${id}/toggle`);
        return response.data;
    },
    eliminar: async (id) => {
        const response = await api.delete(`/proveedores/${id}`);
        return response.data;
    }
};

// ========== SERVICIO DE ÓRDENES DE COMPRA ==========
export const ordenesCompraService = {
    listar: async () => {
        const response = await api.get('/ordenes-compra');
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/ordenes-compra/${id}`);
        return response.data;
    },
    listarPorProveedor: async (proveedorId) => {
        const response = await api.get(`/ordenes-compra/proveedor/${proveedorId}`);
        return response.data;
    },
    listarPorEstado: async (estado) => {
        const response = await api.get(`/ordenes-compra/estado/${estado}`);
        return response.data;
    },
    listarPendientes: async () => {
        const response = await api.get('/ordenes-compra/pendientes');
        return response.data;
    },
    crear: async (data) => {
        const response = await api.post('/ordenes-compra', data);
        return response.data;
    },
    recibir: async (data) => {
        const response = await api.post('/ordenes-compra/recibir', data);
        return response.data;
    },
    cancelar: async (id, motivo = '') => {
        const url = motivo ? `/ordenes-compra/${id}/cancelar?motivo=${encodeURIComponent(motivo)}` : `/ordenes-compra/${id}/cancelar`;
        const response = await api.post(url);
        return response.data;
    }
};

// ========== CATÁLOGOS PARA PRODUCTOS ==========
export const productosCatalogo = {
    tiposProducto: [
        { value: 'COMBUSTIBLE_MAGNA', label: '⛽ Gasolina Magna' },
        { value: 'COMBUSTIBLE_PREMIUM', label: '⛽ Gasolina Premium' },
        { value: 'COMBUSTIBLE_DIESEL', label: '🛢️ Diesel' },
        { value: 'ACEITE_MOTOR', label: '🛢️ Aceite de Motor' },
        { value: 'ADITIVO', label: '🧪 Aditivo' },
        { value: 'OTRO', label: '📦 Otro' }
    ]
};