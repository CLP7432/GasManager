package com.gasmanager.ventas.controllers;

import com.gasmanager.ventas.entities.core.Venta;
import com.gasmanager.ventas.enums.EstadoVenta;
import com.gasmanager.ventas.repositories.VentaRepository;
import jakarta.validation.Valid;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin("http://localhost:5173")
public class VentaController {

    private final VentaRepository ventaRepository;

    public VentaController(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }
    //GET: Obtener todos las ventas (con paginacion )
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllVentas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fechaHora") String sortBy,
            @RequestParam(defaultValue = "desc") String direccion) {

        try{
            Sort.Direction sortDirection = direccion.equalsIgnoreCase("asc")
                    ? Sort.Direction.ASC
                    : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

            Page<Venta> ventasPage = ventaRepository.findAll(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("ventas", ventasPage.getContent());
            response.put("currentPage", ventasPage.getContent());
            response.put("totalItems", ventasPage.getTotalElements());
            response.put("totalPages", ventasPage.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //GET: Obtener venta por ID
    @GetMapping("/{id}")
    public ResponseEntity<Venta> getVentaById(
            @PathVariable Long id){

        Optional<Venta> ventaData = ventaRepository.findById(id);
        return ventaData.map(venta -> new ResponseEntity<>(venta, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //GET: Obtener venta por folio (para busquedas en react
    @GetMapping("/folio/{folio}")
    public ResponseEntity<Venta> getVentaByFolio(
            @PathVariable String folio){

        Optional<Venta> ventaData = ventaRepository.findByFolio(folio);
        return ventaData.map(venta -> new ResponseEntity<>(venta, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //POST: Crear nueva venta (desde React)
    @PostMapping
    public ResponseEntity<Venta> createVenta(@Valid @RequestBody Venta venta) {  // CORREGIDO: @RequestBody
        try {
            // Generar folio automático si no viene
            if (venta.getFolio() == null || venta.getFolio().isEmpty()) {
                String folio = "VENTA-" + LocalDateTime.now().getYear() + "-"
                        + String.format("%06d", ventaRepository.count() + 1);
                venta.setFolio(folio);
            }

            Venta nuevaVenta = ventaRepository.save(venta);
            return new ResponseEntity<>(nuevaVenta, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //PUT: Actualizar venta
    @PutMapping("/{id}")
    public ResponseEntity<Venta> updateVenta(
            @PathVariable long id, @Valid @RequestBody Venta venta){

        Optional<Venta> ventaData = ventaRepository.findById(id);

        if(ventaData.isPresent()){
            Venta ventaExistente = ventaData.get();
            //Actualiza los campos permitidos
            ventaExistente.setEstado(venta.getEstado());
            //ventaExistente.setObservaciones(venta.get)
            //... otros campos que se puedan actualizar

            return new ResponseEntity<>(ventaRepository.save(ventaExistente), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //DELETE: Eliminar venta (solo cambio de estado)
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteVenta(@PathVariable Long id){
        try{
            Optional<Venta> ventaData = ventaRepository.findById(id);
            if(ventaData.isPresent()){
                Venta venta = ventaData.get();
                venta.setEstado(EstadoVenta.CANCELADA);
                ventaRepository.save(venta);
            }
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Estos son ENDPOINTS Especificos para REACT

    //GET: Ventas por rango de fechas (para los reportes en React)
    @GetMapping("/filtro/fechas")
    public ResponseEntity<List<Venta>> getVentasByFecha(
            @RequestParam String inicio,
            @RequestParam String fin) {
        try {
            LocalDateTime fechaInicio = LocalDateTime.parse(inicio);
            LocalDateTime fechaFin = LocalDateTime.parse(fin);
            List<Venta> ventas = ventaRepository.findByFechaHoraBetween(fechaInicio, fechaFin);
            return new ResponseEntity<>(ventas, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // GET: Ventas por estado (para filtros en React)
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Venta>> getVentasByEstado(@PathVariable EstadoVenta estado) {
        List<Venta> ventas = ventaRepository.findByEstado(estado);
        return new ResponseEntity<>(ventas, HttpStatus.OK);
    }

    // GET: Ventas por despachador (para perfil en React)
    @GetMapping("/despachador/{despachadorId}")
    public ResponseEntity<List<Venta>> getVentasByDespachador(@PathVariable Long despachadorId) {
        List<Venta> ventas = ventaRepository.findByDespachadorId(despachadorId);
        return new ResponseEntity<>(ventas, HttpStatus.OK);
    }

    // GET: Ventas por turno (para detalles de turno en React)
    @GetMapping("/turno/{turnoId}")
    public ResponseEntity<List<Venta>> getVentasByTurno(@PathVariable Long turnoId) {
        List<Venta> ventas = ventaRepository.findByTurnoId(turnoId);
        return new ResponseEntity<>(ventas, HttpStatus.OK);
    }

    // GET: Ventas por dispensario (para control de surtidores en React)
    @GetMapping("/dispensario/{surtidorId}")
    public ResponseEntity<List<Venta>> getVentasByDispensario(@PathVariable Integer surtidorId) {
        List<Venta> ventas = ventaRepository.findBySurtidorId(surtidorId);
        return new ResponseEntity<>(ventas, HttpStatus.OK);
    }

    // GET: Reporte de ventas por día (para gráficas en React)
    @GetMapping("/reporte/ventas-por-dia")
    public ResponseEntity<List<Object[]>> getVentasPorDia(
            @RequestParam String inicio,
            @RequestParam String fin) {
        try {
            LocalDateTime fechaInicio = LocalDateTime.parse(inicio);
            LocalDateTime fechaFin = LocalDateTime.parse(fin);
            List<Object[]> reporte = ventaRepository.findVentasTotalesPorDia(fechaInicio, fechaFin);
            return new ResponseEntity<>(reporte, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // GET: Reporte de ventas por método de pago (para dashboard en React)
    @GetMapping("/reporte/ventas-por-metodo-pago")
    public ResponseEntity<List<Object[]>> getVentasPorMetodoPago(
            @RequestParam String inicio,
            @RequestParam String fin) {
        try {
            LocalDateTime fechaInicio = LocalDateTime.parse(inicio);
            LocalDateTime fechaFin = LocalDateTime.parse(fin);
            List<Object[]> reporte = ventaRepository.findVentasPorMetodoPago(fechaInicio, fechaFin);
            return new ResponseEntity<>(reporte, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // GET: Estadísticas generales (para dashboard en React)
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> getEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();

        // Contar ventas por estado
        estadisticas.put("ventasPendientes", ventaRepository.countByEstado(EstadoVenta.PENDIENTE));
        estadisticas.put("ventasCompletadas", ventaRepository.countByEstado(EstadoVenta.COMPLETADA));
        estadisticas.put("ventasCanceladas", ventaRepository.countByEstado(EstadoVenta.CANCELADA));

        // Total de ventas hoy
        LocalDateTime inicioHoy = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime finHoy = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        List<Venta> ventasHoy = ventaRepository.findByFechaHoraBetween(inicioHoy, finHoy);

        double totalHoy = ventasHoy.stream()
                .mapToDouble(v -> v.getTotal().doubleValue())
                .sum();

        estadisticas.put("ventasHoy", ventasHoy.size());
        estadisticas.put("totalHoy", totalHoy);

        return new ResponseEntity<>(estadisticas, HttpStatus.OK);
    }


}
