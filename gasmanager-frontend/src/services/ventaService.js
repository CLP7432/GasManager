// src/services/ventaService.js
import { ventasApi } from './api'; // Importar la instancia específica para ventas

const VENTAS_BASE_URL = ''; // Ya está incluido en baseURL de ventasApi

class VentaService {

    // Obtener todas las ventas con paginación
    getAllVentas(page = 0, size = 10, sortBy = 'fechaHora', direction = 'desc') {
        return ventasApi.get('/ventas', {
            params: {
                page,
                size,
                sortBy,
                direction
            }
        });
    }

    // Obtener venta por ID
    getVentaById(id) {
        return ventasApi.get(`/ventas/${id}`);
    }

    // Obtener venta por folio
    getVentaByFolio(folio) {
        return ventasApi.get(`/ventas/folio/${folio}`);
    }

    // Crear nueva venta
    createVenta(ventaData) {
        return ventasApi.post('/ventas', ventaData);
    }

    // Actualizar venta
    updateVenta(id, ventaData) {
        return ventasApi.put(`/ventas/${id}`, ventaData);
    }

    // "Eliminar" venta (cambiar estado a cancelada)
    deleteVenta(id) {
        return ventasApi.delete(`/ventas/${id}`);
    }

    // Filtrar ventas por fechas
    getVentasByFecha(inicio, fin) {
        return ventasApi.get('/ventas/filtro/fechas', {
            params: { inicio, fin }
        });
    }

    // Obtener ventas por estado
    getVentasByEstado(estado) {
        return ventasApi.get(`/ventas/estado/${estado}`);
    }

    // Obtener ventas por despachador
    getVentasByDespachador(despachadorId) {
        return ventasApi.get(`/ventas/despachador/${despachadorId}`);
    }

    // Obtener ventas por turno
    getVentasByTurno(turnoId) {
        return ventasApi.get(`/ventas/turno/${turnoId}`);
    }

    // Obtener ventas por dispensario
    getVentasByDispensario(surtidorId) {
        return ventasApi.get(`/ventas/dispensario/${surtidorId}`);
    }

    // Reporte de ventas por día
    getVentasPorDia(inicio, fin) {
        return ventasApi.get('/ventas/reporte/ventas-por-dia', {
            params: { inicio, fin }
        });
    }

    // Reporte de ventas por método de pago
    getVentasPorMetodoPago(inicio, fin) {
        return ventasApi.get('/ventas/reporte/ventas-por-metodo-pago', {
            params: { inicio, fin }
        });
    }

    // Obtener estadísticas
    getEstadisticas() {
        return ventasApi.get('/ventas/estadisticas');
    }
}

// Exportar como instancia única (singleton)
export default new VentaService();