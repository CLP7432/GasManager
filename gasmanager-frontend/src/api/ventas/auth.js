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

// ========== SERVICIO DE VENTAS ==========
export const ventasService = {
    listar: async (page = 0, size = 10, sortBy = 'fechaHora', direction = 'desc') => {
        const response = await api.get('/ventas', {
            params: { page, size, sortBy, direction }
        });
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/ventas/${id}`);
        return response.data;
    },
    obtenerPorFolio: async (folio) => {
        const response = await api.get(`/ventas/folio/${folio}`);
        return response.data;
    },
    crear: async (venta) => {
        const response = await api.post('/ventas', venta);
        return response.data;
    },
    actualizar: async (id, venta) => {
        const response = await api.put(`/ventas/${id}`, venta);
        return response.data;
    },
    cancelar: async (id) => {
        const response = await api.delete(`/ventas/${id}`);
        return response.data;
    },
    listarPorEstado: async (estado) => {
        const response = await api.get(`/ventas/estado/${estado}`);
        return response.data;
    },
    listarPorDespachador: async (despachadorId) => {
        const response = await api.get(`/ventas/despachador/${despachadorId}`);
        return response.data;
    },
    listarPorTurno: async (turnoId) => {
        const response = await api.get(`/ventas/turno/${turnoId}`);
        return response.data;
    },
    obtenerEstadisticas: async () => {
        const response = await api.get('/ventas/estadisticas');
        return response.data;
    },
    puedeFacturar: async (id) => {
        const response = await api.get(`/ventas/${id}/puede-facturar`);
        return response.data;
    },
    puedeCancelar: async (id) => {
        const response = await api.get(`/ventas/${id}/puede-cancelar`);
        return response.data;
    }
};

// ========== SERVICIO DE TURNOS ==========
export const turnosService = {
    listar: async () => {
        const response = await api.get('/turnos');
        return response.data;
    },
    listarPorEstado: async (estado) => {
        const response = await api.get(`/turnos/estado/${estado}`);
        return response.data;
    },
    listarPorSupervisor: async (supervisorId) => {
        const response = await api.get(`/turnos/supervisor/${supervisorId}`);
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/turnos/${id}`);
        return response.data;
    },
    obtenerPorCodigo: async (codigo) => {
        const response = await api.get(`/turnos/codigo/${codigo}`);
        return response.data;
    },
    crear: async (turno) => {
        const response = await api.post('/turnos', turno);
        return response.data;
    },
    actualizar: async (id, turno) => {
        const response = await api.put(`/turnos/${id}`, turno);
        return response.data;
    },
    cerrar: async (id) => {
        const response = await api.post(`/turnos/${id}/cerrar`);
        return response.data;
    },
    obtenerTurnoActivo: async (supervisorId) => {
        const response = await api.get(`/turnos/supervisor/${supervisorId}/activo`);
        return response.data;
    },
    tieneTurnoActivo: async (supervisorId) => {
        const response = await api.get(`/turnos/supervisor/${supervisorId}/tiene-activo`);
        return response.data;
    }
};

// ========== SERVICIO DE DISPENSARIOS ==========
export const dispensariosService = {
    listar: async () => {
        const response = await api.get('/dispensarios');
        return response.data;
    },
    listarActivos: async () => {
        const response = await api.get('/dispensarios/activos');
        return response.data;
    },
    listarPorEstado: async (estado) => {
        const response = await api.get(`/dispensarios/estado/${estado}`);
        return response.data;
    },
    listarPorTipo: async (tipo) => {
        const response = await api.get(`/dispensarios/tipo/${tipo}`);
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/dispensarios/${id}`);
        return response.data;
    },
    obtenerPorNumero: async (numero) => {
        const response = await api.get(`/dispensarios/numero/${numero}`);
        return response.data;
    },
    crear: async (dispensario) => {
        const response = await api.post('/dispensarios', dispensario);
        return response.data;
    },
    actualizarLectura: async (id, lectura) => {
        const response = await api.put(`/dispensarios/${id}/lectura`, lectura);
        return response.data;
    },
    actualizarEstado: async (id, estado) => {
        const response = await api.put(`/dispensarios/${id}/estado`, estado);
        return response.data;
    },
    obtenerCompleto: async (id) => {
        const response = await api.get(`/dispensarios/completo/${id}`);
        return response.data;
    },
    crearCompleto: async (dispensario) => {
        console.log('📤 Enviando dispensario completo:', JSON.stringify(dispensario, null, 2));
        const response = await api.post('/dispensarios/completo', dispensario);
        console.log('📥 Respuesta:', response.data);
        return response.data;
    },
    actualizarCompleto: async (id, dispensario) => {
        const response = await api.put(`/dispensarios/completo/${id}`, dispensario);
        return response.data;
    },
    listarCompletos: async () => {
        const response = await api.get('/dispensarios/completos');
        return response.data;
    },
    eliminar: async (id) => {
        const response = await api.delete(`/dispensarios/${id}`);
        return response.data;
    },
    habilitar: async (id) => {
        const response = await api.put(`/dispensarios/${id}/habilitar`);
        return response.data;
    },
    deshabilitar: async (id) => {
        const response = await api.put(`/dispensarios/${id}/deshabilitar`);
        return response.data;
    },
    ponerEnMantenimiento: async (id) => {
        const response = await api.put(`/dispensarios/${id}/mantenimiento`);
        return response.data;
    },
    listarActivosParaVenta: async () => {
        const response = await api.get('/dispensarios/activos-para-venta');
        return response.data;
    }
};

// ========== SERVICIO DE MANGUERAS ==========
export const manguerasService = {
    listarActivas: async () => {
        const response = await api.get('/dispensarios/mangueras/activas');
        return response.data;
    },
    actualizarLectura: async (id, lectura) => {
        const response = await api.put(`/dispensarios/mangueras/${id}/lectura`, lectura);
        return response.data;
    }
};

// ========== SERVICIO DE CORTES ==========
export const cortesService = {
    obtenerLecturasIniciales: async (turnoId) => {
        const response = await api.get(`/cortes-detallado/lecturas-iniciales/${turnoId}`);
        return response.data;
    },
    procesarCorte: async (data) => {
        const response = await api.post('/cortes-detallado/procesar', data);
        return response.data;
    },
    listar: async () => {
        const response = await api.get('/cortes-detallado');
        return response.data;
    },
    listarPorEstado: async (estado) => {
        const response = await api.get(`/cortes/estado/${estado}`);
        return response.data;
    },
    obtenerPorId: async (id) => {
        const response = await api.get(`/cortes-detallado/${id}`);
        return response.data;
    },
    generarDesdeTurno: async (turnoId) => {
        const response = await api.post(`/cortes/turno/${turnoId}`);
        return response.data;
    },
    validar: async (id, supervisorId, supervisorNombre) => {
        const response = await api.post(`/cortes/${id}/validar?supervisorId=${supervisorId}&supervisorNombre=${supervisorNombre}`);
        return response.data;
    },
    cerrar: async (id) => {
        const response = await api.post(`/cortes/${id}/cerrar`);
        return response.data;
    }
};

// ========== CONFIGURACIÓN INICIAL ==========
export const configuracionService = {
    verificar: async () => {
        const response = await api.get('/cortes-detallado/verificar-configuracion');
        return response.data;
    },
    guardar: async (lecturas) => {
        const response = await api.post('/cortes-detallado/configuracion-inicial', lecturas);
        return response.data;
    }
};

// ========== SERVICIO DE PRECIOS DE COMBUSTIBLES ==========
export const preciosService = {
    listarCombustibles: async () => {
        const response = await api.get('/precios/combustibles');
        return response.data;
    },
    actualizarPrecio: async (id, nuevoPrecio, motivoCambio) => {
        const response = await api.put(`/precios/combustibles/${id}`, {
            nuevoPrecio: nuevoPrecio,
            motivoCambio: motivoCambio
        });
        return response.data;
    },
    obtenerPrecioPorTipo: async (tipo) => {
        const response = await api.get(`/precios/combustibles/precio/${tipo}`);
        return response.data;
    }
};

// ========== SERVICIO DE CLIENTES Y CRÉDITOS (para ventas) ==========
export const creditosVentasService = {
    listarActivosConSaldo: async () => {
        const response = await api.get('/creditos/activos-con-saldo');
        return response.data;
    },
    listarConSaldoPendiente: async () => {
        const response = await api.get('/creditos/con-saldo-pendiente');
        return response.data;
    }
};