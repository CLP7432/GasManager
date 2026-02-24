import axios from "axios";

// ========== 1. INSTANCIAS PARA DIFERENTES MICROSERVICIOS ==========

// Instancia para users (8090) - MANTENER compatibilidad
const api = axios.create({
    baseURL: 'http://localhost:8090/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Nueva instancia para ventas (8091)
const ventasApi = axios.create({
    baseURL: 'http://localhost:8091/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// ========== 2. FUNCIÓN PARA APLICAR INTERCEPTORES ==========

const setupInterceptors = (axiosInstance) => {
    // INTERCEPTOR PARA AGREGAR TOKEN AUTOMÁTICAMENTE
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // INTERCEPTOR PARA MANEJAR ERRORES DE AUTENTICACIÓN
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Solo sacar del sistema si es error de autenticación REAL
            if (error.response?.status === 401) {
                console.error("Token inválido o expirado");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            // 403 Forbidden podría ser "no tienes permiso para esta acción"
            else if (error.response?.status === 403) {
                console.error("Acceso denegado - Permisos insuficientes");
            }

            return Promise.reject(error);
        }
    );
};

// ========== 3. APLICAR INTERCEPTORES A AMBAS INSTANCIAS ==========

setupInterceptors(api);
setupInterceptors(ventasApi);

// ========== 4. EXPORTS ==========

// Export por defecto mantiene compatibilidad con código existente
export default api;

// Export nombrado para el nuevo microservicio de ventas
export { ventasApi };