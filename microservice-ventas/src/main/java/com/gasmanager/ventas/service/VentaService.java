package com.gasmanager.ventas.service;

import com.gasmanager.ventas.entities.core.Venta;
import com.gasmanager.ventas.enums.EstadoVenta;
import com.gasmanager.ventas.repositories.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;

    public Venta crearVenta(Venta venta) {
        //Validamos folio unico
        if(venta.getFolio() != null && ventaRepository.findByFolio(venta.getFolio()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una venta con el folio: " +
                    venta.getFolio());
        }
        //Establecer valores por defecto.
        if(venta.getFechaHora() == null){
            venta.setFechaHora(LocalDateTime.now());
        }
        if(venta.getEstado() == null){
            venta.setEstado(EstadoVenta.PENDIENTE);
        }
        //Generar folio automatico si no viene
        if(venta.getFolio() == null || venta.getFolio().isEmpty()){
            String folio = generarFolioAutomatico();
            venta.setFolio(folio);
        }
        return ventaRepository.save(venta);
    }

    // Obtener Venta por ID
    public Optional<Venta> obtenerVenta(Long id){
        return ventaRepository.findById(id);
    }

    //Obtener Venta por Folio
    public Optional<Venta> obtenerPorFolio(String folio){
        return ventaRepository.findByFolio(folio);
    }

    //Obtener Todas las Ventas
    public List<Venta> listarTodas(){
        return ventaRepository.findAll();
    }
    //Obtener Ventas Con paginacion
    public Page<Venta> listarTodas(Pageable page){
        return ventaRepository.findAll(page);
    }
    //Obtener Venta por Estado
    public List<Venta> listarPorEstado(EstadoVenta estado){
        return ventaRepository.findByEstado(estado);
    }
    //Obtener Ventas por Despachador
    public List<Venta> listarPorDespachador(Long despachadorId){
        return ventaRepository.findByDespachadorId(despachadorId);
    }
    //Obtener Ventas por Turno
    public List<Venta> listarPorTurno(Long turnoId){
        return ventaRepository.findByTurnoId(turnoId);
    }
    //Obtener Ventas Por Fecha
    public List<Venta> listarPorFecha(LocalDateTime inicio, LocalDateTime fin){
        return ventaRepository.findByFechaHoraBetween(inicio, fin);
    }
    // Actualizar Venta
    public Venta actualizarVenta(long id, Venta ventaActualizada) {
        Venta ventaExiste = ventaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No existe el venta con el id: " + id));

        if(ventaExiste.getEstado() == EstadoVenta.CANCELADA){
            throw new IllegalStateException("No se puede modificar una venta cancelada");
        }
        if(ventaActualizada.getEstado() != null){
            ventaExiste.setEstado(ventaActualizada.getEstado());
        }
        //if(ventaActualizada.get)
        if(ventaActualizada.getFacturada() != null){
            ventaExiste.setFacturada(ventaActualizada.getFacturada());
        }
        if(ventaActualizada.getFolioFactura() != null){
            ventaExiste.setFolioFactura(ventaActualizada.getFolioFactura());
        }
        if(ventaActualizada.getPuntosObtenidos() != null){
            ventaExiste.setPuntosObtenidos(ventaActualizada.getPuntosObtenidos());
        }
        if(ventaActualizada.getPuntosCanjeados() != null){
            ventaExiste.setPuntosCanjeados(ventaActualizada.getPuntosCanjeados());
        }
        return ventaRepository.save(ventaExiste);
    }

    //Cancelar Venta
    public boolean cancelarVenta(long id) {
        Optional<Venta> ventaOpt =  ventaRepository.findById(id);

        if(ventaOpt.isEmpty()){
            return false;
        }

        Venta venta = ventaOpt.get();
        venta.setEstado(EstadoVenta.CANCELADA);
        ventaRepository.save(venta);

        return true;
    }
    //Reactivar Venta
    public boolean reactivarVenta(Long id){
        Optional<Venta> ventaOpt =  ventaRepository.findById(id);

        if(ventaOpt.isEmpty()){
            return false;
        }

        Venta venta = ventaOpt.get();
        if(venta.getEstado() == EstadoVenta.CANCELADA){
            venta.setEstado(EstadoVenta.PENDIENTE);
            ventaRepository.save(venta);
            return true;
        }
        return false;
    }
    //Validar si Existe con Folio
    public boolean existeVentaConFolio(String folio){
        return ventaRepository.findByFolio(folio).isPresent();
    }
    //Validar Si Pertenece a Despachador
    public boolean ventaPerteneceADespachador(long id, Long despachadorId){
        Optional<Venta> ventaOpt =  ventaRepository.findById(id);
        return ventaOpt.isPresent() && ventaOpt.get().getDespachadorId().equals(despachadorId);
    }
    //Obtener Estadisticas
    public Object obtenerEstadisticas(){
        LocalDateTime inicioHoy = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime finHoy = LocalDateTime.now().withHour(23).withMinute(59).withSecond(0);

        List<Venta> ventasHoy = ventaRepository.findByFechaHoraBetween(inicioHoy, finHoy);

        double totalHoy = ventasHoy.stream()
                .mapToDouble(v -> v.getTotal() != null ? v.getTotal().doubleValue() : 0.0)
                .sum();
        return new Object(){
            public final long totalVentas = ventaRepository.count();
            public final long ventasHoy1 = ventasHoy.size();
            public final double totalHoy1 = totalHoy;
            public final long ventasCompletas = ventaRepository.countByEstado(EstadoVenta.COMPLETADA);
            public final long ventasPendientes = ventaRepository.countByEstado(EstadoVenta.PENDIENTE);
            public final long ventasCanceladas = ventaRepository.countByEstado(EstadoVenta.CANCELADA);
            public final long ventasFacturadas = ventaRepository.findByFacturada(true).size();
            public final long ventasCreadito = ventaRepository.findByEsCredito(true).size();
        };
    }
    public boolean puedeFacturar(Long ventaId){
        Optional<Venta> ventaOpt =  ventaRepository.findById(ventaId);
        if(ventaOpt.isEmpty()){
            return false;
        }
        Venta venta = ventaOpt.get();
        return venta.getEstado() == EstadoVenta.COMPLETADA &&
                !venta.getFacturada() &&
                venta.getTotal().compareTo(BigDecimal.ZERO) > 0;
    }
    public boolean puedeCancelar(Long ventaId){
        Optional<Venta> ventaOpt =  ventaRepository.findById(ventaId);
        if (ventaOpt.isEmpty()){
            return false;
        }
        Venta venta = ventaOpt.get();
        return venta.getEstado() != EstadoVenta.CANCELADA &&
                venta.getEstado() != EstadoVenta.FACTURADA;
    }

    //Metodo Auxiliar : Generar Folio Automativo
    private String generarFolioAutomatico() {
        LocalDateTime ahora = LocalDateTime.now();
        // Formato: VENTA-AAAAMMDD-HHMMSS-XXXX
        String fecha = String.format("%04d%02d%02d",
                ahora.getYear(), ahora.getMonthValue(), ahora.getDayOfMonth());
        String hora = String.format("%02d%02d%02d",
                ahora.getHour(), ahora.getMinute(), ahora.getSecond());

        // Contar cuántas ventas hay hoy para el número secuencial
        LocalDateTime inicioHoy = ahora.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime finHoy = ahora.withHour(23).withMinute(59).withSecond(59);
        long secuencial = ventaRepository.findByFechaHoraBetween(inicioHoy, finHoy).size() + 1;

        return String.format("VENTA-%s-%s-%04d", fecha, hora, secuencial);
    }

    public void agregarDetalleAVenta(Long ventaId,
                                     com.gasmanager.ventas.entities.core.DetalleVenta detalle){
        Optional<Venta> ventaOpt =  ventaRepository.findById(ventaId);
        if(ventaOpt.isEmpty()){
            throw new IllegalArgumentException("Venta no encontrada");
        }
        Venta venta = ventaOpt.get();
        detalle.setVenta(venta);
        venta.getDetalles().add(detalle);

        //Recalcular totales
        recalcularTotales(venta);
        ventaRepository.save(venta);
    }
    private void recalcularTotales(Venta venta){
        if(venta.getDetalles() == null || venta.getDetalles().isEmpty()){
            venta.setSubtotal(BigDecimal.ZERO);
            venta.setIva(BigDecimal.ZERO);
            venta.setTotal(BigDecimal.ZERO);
            return;
        }
        BigDecimal subtotal = venta.getDetalles().stream()
                .map(detalle -> detalle.getImporte() != null ? detalle.getImporte() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal iva = subtotal.multiply(new BigDecimal("0.16"));
        BigDecimal total = subtotal.add(iva);

        venta.setSubtotal(subtotal);
        venta.setIva(iva);
        venta.setTotal(total);

    }



}
