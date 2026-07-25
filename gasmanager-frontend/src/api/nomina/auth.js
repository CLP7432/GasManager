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

// ========== SERVICIO DE DEPARTAMENTOS ==========
export const departamentosService = {
    listar: async () => {
        const response = await api.get('/departamentos');
        return response.data;
    },
    listarActivos: async () => {
        const response = await api.get('/departamentos/activos');
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/departamentos/${id}`);
        return response.data;
    },
    crear: async (data) => {
        const response = await api.post('/departamentos', data);
        return response.data;
    },
    actualizar: async (id, data) => {
        const response = await api.put(`/departamentos/${id}`, data);
        return response.data;
    },
    toggleActivo: async (id) => {
        const response = await api.patch(`/departamentos/${id}/toggle`);
        return response.data;
    },
    eliminar: async (id) => {
        const response = await api.delete(`/departamentos/${id}`);
        return response.data;
    }
};

// ========== SERVICIO DE PUESTOS ==========
export const puestosService = {
    listar: async () => {
        const response = await api.get('/puestos');
        return response.data;
    },
    listarActivos: async () => {
        const response = await api.get('/puestos/activos');
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/puestos/${id}`);
        return response.data;
    },
    crear: async (data) => {
        const response = await api.post('/puestos', data);
        return response.data;
    },
    actualizar: async (id, data) => {
        const response = await api.put(`/puestos/${id}`, data);
        return response.data;
    },
    toggleActivo: async (id) => {
        const response = await api.patch(`/puestos/${id}/toggle`);
        return response.data;
    },
    eliminar: async (id) => {
        const response = await api.delete(`/puestos/${id}`);
        return response.data;
    }
};

// ========== SERVICIO DE EMPLEADOS ==========
export const empleadosService = {
    listar: async () => {
        const response = await api.get('/empleados');
        return response.data;
    },
    listarActivos: async () => {
        const response = await api.get('/empleados/activos');
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/empleados/${id}`);
        return response.data;
    },
    obtenerPorRFC: async (rfc) => {
        const response = await api.get(`/empleados/rfc/${rfc}`);
        return response.data;
    },
    listarPorDepartamento: async (departamentoId) => {
        const response = await api.get(`/empleados/departamento/${departamentoId}`);
        return response.data;
    },
    listarPorPuesto: async (puestoId) => {
        const response = await api.get(`/empleados/puesto/${puestoId}`);
        return response.data;
    },
    crear: async (data) => {
        const response = await api.post('/empleados', data);
        return response.data;
    },
    actualizar: async (id, data) => {
        const response = await api.put(`/empleados/${id}`, data);
        return response.data;
    },
    desactivar: async (id, fechaBaja, motivo) => {
        let url = `/empleados/${id}/desactivar`;
        if (fechaBaja) url += `?fechaBaja=${fechaBaja}`;
        if (motivo) url += `${fechaBaja ? '&' : '?'}motivo=${encodeURIComponent(motivo)}`;
        const response = await api.patch(url);
        return response.data;
    },
    reactivar: async (id) => {
        const response = await api.patch(`/empleados/${id}/reactivar`);
        return response.data;
    }
};

// ========== SERVICIO DE INCIDENCIAS ==========
export const incidenciasService = {
    listar: async () => {
        const response = await api.get('/incidencias');
        return response.data;
    },
    listarPorEmpleado: async (empleadoId) => {
        const response = await api.get(`/incidencias/empleado/${empleadoId}`);
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/incidencias/${id}`);
        return response.data;
    },
    crear: async (data) => {
        const response = await api.post('/incidencias', data);
        return response.data;
    },
    actualizar: async (id, data) => {
        const response = await api.put(`/incidencias/${id}`, data);
        return response.data;
    },
    eliminar: async (id) => {
        const response = await api.delete(`/incidencias/${id}`);
        return response.data;
    }
};

// ========== SERVICIO DE NÓMINAS ==========
export const nominasService = {
    listar: async () => {
        const response = await api.get('/nominas');
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/nominas/${id}`);
        return response.data;
    },
    listarPorEstado: async (estado) => {
        const response = await api.get(`/nominas/estado/${estado}`);
        return response.data;
    },
    procesar: async (data) => {
        const response = await api.post('/nominas/procesar', data);
        return response.data;
    },
    marcarPagada: async (id) => {
        const response = await api.post(`/nominas/${id}/marcar-pagada`);
        return response.data;
    },
    cancelar: async (id, motivo) => {
        const url = motivo ? `/nominas/${id}/cancelar?motivo=${encodeURIComponent(motivo)}` : `/nominas/${id}/cancelar`;
        const response = await api.post(url);
        return response.data;
    }
};