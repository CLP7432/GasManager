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

// ========== SERVICIO DE COMBUSTIBLES (precios) ==========
export const combustibleService = {
    listar: async () => {
        const response = await api.get("/combustibles");
        return response.data;
    },
    listarActivos: async () => {
        const response = await api.get("/combustibles/activos");
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/combustibles/${id}`);
        return response.data;
    },
    crear: async (data) => {
        const response = await api.post("/combustibles", data);
        return response.data;
    },
    actualizarPrecio: async (id, data) => {
        const response = await api.put(`/combustibles/${id}/precio`, data);
        return response.data;
    },
    toggleActivo: async (id) => {
        const response = await api.patch(`/combustibles/${id}/toggle`);
        return response.data;
    },
    eliminar: async (id) => {
        const response = await api.delete(`/combustibles/${id}`);
        return response.data;
    }
};

// ========== SERVICIO DE ACEITES ==========
export const aceiteService = {
    listar: async () => {
        const response = await api.get('/aceites');
        return response.data;
    },
    listarActivos: async () => {
        const response = await api.get('/aceites/activos');
        return response.data;
    },
    listarStockBajo: async () => {
        const response = await api.get('/aceites/stock-bajo');
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/aceites/${id}`);
        return response.data;
    },
    crear: async (data) => {
        const response = await api.post('/aceites', data);
        return response.data;
    },
    actualizar: async (id, data) => {
        const response = await api.put(`/aceites/${id}`, data);
        return response.data;
    },
    actualizarStock: async (id, nuevoStock, motivo = '') => {
        const response = await api.put(`/aceites/${id}/stock?nuevoStock=${nuevoStock}&motivo=${encodeURIComponent(motivo)}`);
        return response.data;
    },
    aumentarStock: async (id, cantidad, motivo = '') => {
        const response = await api.post(`/aceites/${id}/aumentar-stock?cantidad=${cantidad}&motivo=${encodeURIComponent(motivo)}`);
        return response.data;
    },
    disminuirStock: async (id, cantidad, motivo = '') => {
        const response = await api.post(`/aceites/${id}/disminuir-stock?cantidad=${cantidad}&motivo=${encodeURIComponent(motivo)}`);
        return response.data;
    },
    validarStock: async (id, cantidadRequerida) => {
        const response = await api.get(`/aceites/${id}/validar-stock?cantidadRequerida=${cantidadRequerida}`);
        return response.data;
    },
    toggleActivo: async (id) => {
        const response = await api.patch(`/aceites/${id}/toggle`);
        return response.data;
    },
    eliminar: async (id) => {
        const response = await api.delete(`/aceites/${id}`);
        return response.data;
    }
};

// ========== NUEVO: SERVICIO DE INVENTARIO DE COMBUSTIBLE (tanques) ==========
export const inventarioCombustibleService = {
    // Obtener inventario de todos los tanques
    listar: async () => {
        const response = await api.get('/inventario-combustible');
        return response.data;
    },
    // Verificar stock bajo
    stockBajo: async () => {
        const response = await api.get('/inventario-combustible/stock-bajo');
        return response.data;
    },
    // Obtener por tipo de combustible
    obtenerPorTipo: async (tipo) => {
        const response = await api.get(`/inventario-combustible/tipo/${tipo}`);
        return response.data;
    },
    // Registrar carga de pipa
    registrarCarga: async (data) => {
        const response = await api.post('/inventario-combustible/cargas', data);
        return response.data;
    },
    // Listar todas las cargas de pipa
    listarCargas: async () => {
        const response = await api.get('/inventario-combustible/cargas');
        return response.data;
    },
    // Listar cargas por tipo de combustible
    listarCargasPorTipo: async (tipo) => {
        const response = await api.get(`/inventario-combustible/cargas/tipo/${tipo}`);
        return response.data;
    },
    // ========== CONFIGURACIÓN DE TANQUES ==========

    obtenerConfiguracion: async () => {
        const response = await api.get('/inventario-combustible/configuracion');
        return response.data;
    },

    actualizarConfiguracion: async (configuracion) => {
        const response = await api.put('/inventario-combustible/configuracion', configuracion);
        return response.data;
    },

    reiniciarInventario: async () => {
        const response = await api.post('/inventario-combustible/reiniciar');
        return response.data;
    }
};

// ========== SERVICIO DE INVENTARIO DE ACEITES (BODEGA Y DISPENSARIOS) ==========
export const aceitesInventarioService = {
    // ===== BODEGA =====
    listarBodega: async () => {
        const response = await api.get('/inventario-aceites/bodega');
        return response.data;
    },

    obtenerBodegaPorAceite: async (aceiteId) => {
        const response = await api.get(`/inventario-aceites/bodega/${aceiteId}`);
        return response.data;
    },

    listarStockBajoBodega: async () => {
        const response = await api.get('/inventario-aceites/bodega/stock-bajo');
        return response.data;
    },

    listarStockCriticoBodega: async () => {
        const response = await api.get('/inventario-aceites/bodega/stock-critico');
        return response.data;
    },

    // ===== DISPENSARIOS =====
    listarStockDispensario: async (dispensarioId) => {
        const response = await api.get(`/inventario-aceites/dispensario/${dispensarioId}`);
        return response.data;
    },

    listarStockBajoDispensarios: async () => {
        const response = await api.get('/inventario-aceites/dispensario/stock-bajo');
        return response.data;
    },

    listarStockBajoPorDispensario: async (dispensarioId) => {
        const response = await api.get(`/inventario-aceites/dispensario/${dispensarioId}/stock-bajo`);
        return response.data;
    },

    obtenerResumenStock: async () => {
        const response = await api.get('/inventario-aceites/resumen-stock');
        return response.data;
    },

    // ===== COMPRAS =====
    registrarCompra: async (data) => {
        const response = await api.post('/inventario-aceites/compras', data);
        return response.data;
    },

    listarCompras: async () => {
        const response = await api.get('/inventario-aceites/compras');
        return response.data;
    },

    listarComprasPorAceite: async (aceiteId) => {
        const response = await api.get(`/inventario-aceites/compras/aceite/${aceiteId}`);
        return response.data;
    },

    // ===== TRANSFERENCIAS / SURTIDO =====
    surtirDispensario: async (data) => {
        const response = await api.post('/inventario-aceites/surtir', data);
        return response.data;
    },

    listarTransferencias: async () => {
        const response = await api.get('/inventario-aceites/transferencias');
        return response.data;
    },

    listarTransferenciasPorDispensario: async (dispensarioId) => {
        const response = await api.get(`/inventario-aceites/transferencias/dispensario/${dispensarioId}`);
        return response.data;
    },

    // ===== INICIALIZACIÓN =====
    inicializarInventario: async () => {
        const response = await api.post('/inventario-aceites/inicializar');
        return response.data;
    }
};