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

// ========== SERVICIO DE CLIENTES ==========
export const clientesService = {
    listar: async () => {
        const response = await api.get('/clientes');
        return response.data;
    },
    listarActivos: async () => {
        const response = await api.get('/clientes/activos');
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/clientes/${id}`);
        return response.data;
    },
    obtenerPorRFC: async (rfc) => {
        const response = await api.get(`/clientes/rfc/${rfc}`);
        return response.data;
    },
    buscarPorRazonSocial: async (razonSocial) => {
        const response = await api.get(`/clientes/buscar?razonSocial=${razonSocial}`);
        return response.data;
    },
    crear: async (cliente) => {
        const response = await api.post('/clientes', cliente);
        return response.data;
    },
    actualizar: async (id, cliente) => {
        const response = await api.put(`/clientes/${id}`, cliente);
        return response.data;
    },
    toggleActivo: async (id) => {
        const response = await api.patch(`/clientes/${id}/toggle`);
        return response.data;
    },
    eliminar: async (id) => {
        const response = await api.delete(`/clientes/${id}`);
        return response.data;
    }
};

// ========== SERVICIO DE CRÉDITOS ==========
export const creditosService = {
    listar: async () => {
        const response = await api.get('/creditos');
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/creditos/${id}`);
        return response.data;
    },
    listarPorCliente: async (clienteId) => {
        const response = await api.get(`/creditos/cliente/${clienteId}`);
        return response.data;
    },
    listarPorEstado: async (estado) => {
        const response = await api.get(`/creditos/estado/${estado}`);
        return response.data;
    },
    listarActivosConSaldo: async () => {
        const response = await api.get('/creditos/activos-con-saldo');
        return response.data;
    },
    listarVencidos: async () => {
        const response = await api.get('/creditos/vencidos');
        return response.data;
    },
    crear: async (credito) => {
        const response = await api.post('/creditos', credito);
        return response.data;
    },
    actualizar: async (id, credito) => {
        const response = await api.put(`/creditos/${id}`, credito);
        return response.data;
    },
    registrarAbono: async (creditoId, abono) => {
        const response = await api.post(`/creditos/${creditoId}/abonos`, abono);
        return response.data;
    },
    listarAbonos: async (creditoId) => {
        const response = await api.get(`/creditos/${creditoId}/abonos`);
        return response.data;
    },
    cancelar: async (id, motivo = '') => {
        const url = motivo ? `/creditos/${id}/cancelar?motivo=${encodeURIComponent(motivo)}` : `/creditos/${id}/cancelar`;
        const response = await api.post(url);
        return response.data;
    }
};