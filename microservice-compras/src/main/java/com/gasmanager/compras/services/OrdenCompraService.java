package com.gasmanager.compras.services;

import com.gasmanager.compras.clients.InventarioClient;
import com.gasmanager.compras.dto.DetalleOrdenCompraDTO;
import com.gasmanager.compras.dto.OrdenCompraDTO;
import com.gasmanager.compras.dto.RecepcionCompraDTO;
import com.gasmanager.compras.entities.DetalleOrdenCompra;
import com.gasmanager.compras.entities.OrdenCompra;
import com.gasmanager.compras.entities.Proveedor;
import com.gasmanager.compras.enums.EstadoOrdenCompra;
import com.gasmanager.compras.enums.TipoProductoCompra;
import com.gasmanager.compras.exceptions.ResourceNotFoundException;
import com.gasmanager.compras.exceptions.ValidationException;
import com.gasmanager.compras.repositories.DetalleOrdenCompraRepository;
import com.gasmanager.compras.repositories.OrdenCompraRepository;
import com.gasmanager.compras.repositories.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrdenCompraService {

    private final OrdenCompraRepository ordenCompraRepository;
    private final DetalleOrdenCompraRepository detalleOrdenCompraRepository;
    private final ProveedorRepository proveedorRepository;
    private final InventarioClient inventarioClient;

    public OrdenCompraDTO crearOrdenCompra(OrdenCompraDTO ordenCompraDTO, Long usuarioId, String usuarioNombre) {
        // Validar proveedor
        Proveedor proveedor = proveedorRepository.findById(ordenCompraDTO.getProveedorId())
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + ordenCompraDTO.getProveedorId()));

        // Crear orden
        OrdenCompra orden = OrdenCompra.builder()
                .folioOrden(generarFolioOrden())
                .proveedor(proveedor)
                .fechaOrden(ordenCompraDTO.getFechaOrden() != null ? ordenCompraDTO.getFechaOrden() : LocalDate.now())
                .fechaEntrega(ordenCompraDTO.getFechaEntrega())
                .estado(EstadoOrdenCompra.PENDIENTE)
                .factura(ordenCompraDTO.getFactura())
                .observaciones(ordenCompraDTO.getObservaciones())
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        orden = ordenCompraRepository.save(orden);

        // Agregar detalles
        for (DetalleOrdenCompraDTO detalleDTO : ordenCompraDTO.getDetalles()) {
            DetalleOrdenCompra detalle = DetalleOrdenCompra.builder()
                    .ordenCompra(orden)
                    .tipoProducto(detalleDTO.getTipoProducto())
                    .productoId(detalleDTO.getProductoId())
                    .productoNombre(detalleDTO.getProductoNombre())
                    .cantidad(detalleDTO.getCantidad())
                    .precioUnitario(detalleDTO.getPrecioUnitario())
                    .build();
            detalle.calcularMontos();
            orden.addDetalle(detalle);
            detalleOrdenCompraRepository.save(detalle);
        }

        orden.calcularTotales();
        orden = ordenCompraRepository.save(orden);

        return mapToDTO(orden);
    }

    @Transactional
    public OrdenCompraDTO recibirOrdenCompra(RecepcionCompraDTO recepcionDTO, Long usuarioId, String usuarioNombre) {
        OrdenCompra orden = ordenCompraRepository.findById(recepcionDTO.getOrdenId())
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada con ID: " + recepcionDTO.getOrdenId()));

        if (orden.getEstado() == EstadoOrdenCompra.RECIBIDA) {
            throw new ValidationException("La orden ya ha sido recibida");
        }

        if (orden.getEstado() == EstadoOrdenCompra.CANCELADA) {
            throw new ValidationException("No se puede recibir una orden cancelada");
        }

        // Actualizar inventario por cada detalle
        for (DetalleOrdenCompra detalle : orden.getDetalles()) {
            actualizarInventario(detalle, usuarioNombre);
        }

        orden.setEstado(EstadoOrdenCompra.RECIBIDA);
        orden.setFechaEntrega(recepcionDTO.getFechaRecepcion() != null ? recepcionDTO.getFechaRecepcion() : LocalDate.now());
        if (recepcionDTO.getFactura() != null) {
            orden.setFactura(recepcionDTO.getFactura());
        }
        if (recepcionDTO.getObservaciones() != null) {
            String obs = orden.getObservaciones() != null ? orden.getObservaciones() + "\n" : "";
            orden.setObservaciones(obs + "[RECEPCIÓN] " + recepcionDTO.getObservaciones());
        }
        orden.setUpdatedBy(usuarioNombre);

        orden = ordenCompraRepository.save(orden);
        return mapToDTO(orden);
    }

    private void actualizarInventario(DetalleOrdenCompra detalle, String usuarioNombre) {
        try {
            switch (detalle.getTipoProducto()) {
                case COMBUSTIBLE_MAGNA:
                    inventarioClient.descontarStockCombustible("MAGNA", detalle.getCantidad(),
                            "Compra - Orden: " + detalle.getOrdenCompra().getFolioOrden());
                    break;
                case COMBUSTIBLE_PREMIUM:
                    inventarioClient.descontarStockCombustible("PREMIUM", detalle.getCantidad(),
                            "Compra - Orden: " + detalle.getOrdenCompra().getFolioOrden());
                    break;
                case COMBUSTIBLE_DIESEL:
                    inventarioClient.descontarStockCombustible("DIESEL", detalle.getCantidad(),
                            "Compra - Orden: " + detalle.getOrdenCompra().getFolioOrden());
                    break;
                case ACEITE_MOTOR:
                    inventarioClient.aumentarStockAceite(detalle.getProductoId(),
                            detalle.getCantidad().intValue(),
                            "Compra - Orden: " + detalle.getOrdenCompra().getFolioOrden());
                    break;
                default:
                    System.out.println("Producto no requiere actualización de inventario: " + detalle.getTipoProducto());
                    break;
            }
            System.out.println("Inventario actualizado para: " + detalle.getProductoNombre());
        } catch (Exception e) {
            System.err.println("Error actualizando inventario: " + e.getMessage());
            throw new ValidationException("Error al actualizar inventario: " + e.getMessage());
        }
    }

    public OrdenCompraDTO cancelarOrdenCompra(Long id, String motivo, Long usuarioId, String usuarioNombre) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada con ID: " + id));

        if (orden.getEstado() == EstadoOrdenCompra.RECIBIDA) {
            throw new ValidationException("No se puede cancelar una orden ya recibida");
        }

        orden.setEstado(EstadoOrdenCompra.CANCELADA);
        String obs = orden.getObservaciones() != null ? orden.getObservaciones() + "\n" : "";
        orden.setObservaciones(obs + "[CANCELADA] Motivo: " + motivo);
        orden.setUpdatedBy(usuarioNombre);

        orden = ordenCompraRepository.save(orden);
        return mapToDTO(orden);
    }

    @Transactional(readOnly = true)
    public List<OrdenCompraDTO> listarOrdenes() {
        return ordenCompraRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrdenCompraDTO obtenerOrdenCompra(Long id) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada con ID: " + id));
        return mapToDTO(orden);
    }

    @Transactional(readOnly = true)
    public List<OrdenCompraDTO> listarOrdenesPorProveedor(Long proveedorId) {
        return ordenCompraRepository.findByProveedorId(proveedorId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrdenCompraDTO> listarOrdenesPorEstado(EstadoOrdenCompra estado) {
        return ordenCompraRepository.findByEstado(estado).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrdenCompraDTO> listarOrdenesPendientes() {
        return ordenCompraRepository.findByEstado(EstadoOrdenCompra.PENDIENTE).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private String generarFolioOrden() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long secuencial = ordenCompraRepository.count() + 1;
        return String.format("OC-%s-%04d", fecha, secuencial);
    }

    private OrdenCompraDTO mapToDTO(OrdenCompra orden) {
        List<DetalleOrdenCompraDTO> detalles = orden.getDetalles().stream()
                .map(this::mapDetalleToDTO)
                .collect(Collectors.toList());

        return OrdenCompraDTO.builder()
                .id(orden.getId())
                .folioOrden(orden.getFolioOrden())
                .proveedorId(orden.getProveedor().getId())
                .proveedorNombre(orden.getProveedor().getNombre())
                .fechaOrden(orden.getFechaOrden())
                .fechaEntrega(orden.getFechaEntrega())
                .subtotal(orden.getSubtotal())
                .iva(orden.getIva())
                .total(orden.getTotal())
                .estado(orden.getEstado())
                .factura(orden.getFactura())
                .observaciones(orden.getObservaciones())
                .detalles(detalles)
                .createdAt(orden.getCreatedAt())
                .updatedAt(orden.getUpdatedAt())
                .build();
    }

    private DetalleOrdenCompraDTO mapDetalleToDTO(DetalleOrdenCompra detalle) {
        return DetalleOrdenCompraDTO.builder()
                .id(detalle.getId())
                .tipoProducto(detalle.getTipoProducto())
                .productoId(detalle.getProductoId())
                .productoNombre(detalle.getProductoNombre())
                .cantidad(detalle.getCantidad())
                .precioUnitario(detalle.getPrecioUnitario())
                .subtotal(detalle.getSubtotal())
                .iva(detalle.getIva())
                .total(detalle.getTotal())
                .build();
    }
}