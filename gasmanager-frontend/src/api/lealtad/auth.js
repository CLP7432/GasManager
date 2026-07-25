import axios from "axios";

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const normalizeListResponse = (response) => {
    if (response.status === 204 || response.data == null || response.data === '') {
        return [];
    }
    return Array.isArray(response.data) ? response.data : [];
};

export const extractApiError = (error, defaultMsg = 'Error en la operacion') => {
    const data = error?.response?.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (error?.message) return error.message;
    return defaultMsg;
};

export const mapRecompensa = (recompensa) => ({
    ...recompensa,
    estado: recompensa.activo !== false ? 'ACTIVO' : 'INACTIVO',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const transaccionesService = {
    registrar: async (ventaId) => {
        const response = await api.post(`/transacciones/${ventaId}`);
        return response.data;
    },
    listarPorVenta: async (ventaId) => {
        const response = await api.get(`/transacciones/${ventaId}`);
        return normalizeListResponse(response);
    }
};

export const recompensasService = {
    listar: async () => {
        const response = await api.get('/recompensas');
        const data = normalizeListResponse(response);
        return data.map(mapRecompensa);
    }
};

export const puntosService = {
    consultarSaldo: async (ventaId) => {
        const response = await api.get(`/cuentas-puntos/${ventaId}`);
        return response.data;
    }
};

export const canjesService = {
    registrar: async (ventaId, recompensaId) => {
        const response = await api.post(`/canjes/${ventaId}/${recompensaId}`);
        return response.data;
    },
    listarPorVenta: async (ventaId) => {
        const response = await api.get(`/canjes/${ventaId}`);
        return normalizeListResponse(response);
    }
};

export const programasService = {
    obtenerActivo: async () => {
        const response = await api.get('/programas/activo');
        return response.data;
    },
    listar: async () => {
        const response = await api.get('/programas');
        return normalizeListResponse(response);
    },
    crear: async (programa) => {
        const response = await api.post('/programas', programa);
        return response.data;
    },
    activar: async (id) => {
        const response = await api.put(`/programas/${id}/activar`);
        return response.data;
    },
    desactivar: async (id) => {
        await api.put(`/programas/${id}/desactivar`);
    }
};
