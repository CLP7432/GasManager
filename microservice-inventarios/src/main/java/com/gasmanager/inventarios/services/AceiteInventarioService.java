package com.gasmanager.inventarios.services;

import com.gasmanager.inventarios.dto.*;
import com.gasmanager.inventarios.entities.*;
import com.gasmanager.inventarios.exceptions.ResourceNotFoundException;
import com.gasmanager.inventarios.exceptions.ValidationException;
import com.gasmanager.inventarios.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AceiteInventarioService {

    private final AceiteBodegaRepository aceiteBodegaRepository;
    private final AceiteDispensarioRepository aceiteDispensarioRepository;
    private final CompraAceiteRepository compraAceiteRepository;
    private final TransferenciaAceiteRepository transferenciaAceiteRepository;
    private final AceiteRepository aceiteRepository;

    // ========== INICIALIZACIÓN ==========

    @Transactional
    public void inicializarInventarioAceites(Long usuarioId, String usuarioNombre) {
        List<Aceite> aceites = aceiteRepository.findByActivoTrue();

        for (Aceite aceite : aceites) {
            if (!aceiteBodegaRepository.existsByAceiteId(aceite.getId())) {
                AceiteBodega bodega = AceiteBodega.builder()
                        .aceiteId(aceite.getId())
                        .codigo(aceite.getCodigo())
                        .nombre(aceite.getNombre())
                        .stockActual(0)
                        .stockMinimo(5)
                        .stockMaximo(100)
                        .precioCompra(aceite.getPrecioCompra())
                        .precioVenta(aceite.getPrecioVenta())
                        .activo(true)
                        .createdBy(usuarioNombre)
                        .updatedBy(usuarioNombre)
                        .build();
                aceiteBodegaRepository.save(bodega);
            }
        }
        log.info("Inventario de aceites en bodega inicializado por: {}", usuarioNombre);
    }

    // ========== BODEGA - STOCK ==========

    @Transactional(readOnly = true)
    public List<AceiteBodegaDTO> listarBodega() {
        return aceiteBodegaRepository.findByActivoTrue().stream()
                .map(this::mapToBodegaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AceiteBodegaDTO obtenerBodegaPorAceite(Long aceiteId) {
        AceiteBodega bodega = aceiteBodegaRepository.findByAceiteId(aceiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Aceite no encontrado en bodega con ID: " + aceiteId));
        return mapToBodegaDTO(bodega);
    }

    @Transactional(readOnly = true)
    public List<AceiteBodegaDTO> listarStockBajoBodega() {
        return aceiteBodegaRepository.findStockBajo().stream()
                .map(this::mapToBodegaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AceiteBodegaDTO> listarStockCriticoBodega() {
        return aceiteBodegaRepository.findStockCritico().stream()
                .map(this::mapToBodegaDTO)
                .collect(Collectors.toList());
    }

    // ========== DISPENSARIOS - STOCK ==========

    @Transactional(readOnly = true)
    public List<AceiteDispensarioDTO> listarStockDispensario(Long dispensarioId) {
        return aceiteDispensarioRepository.findByDispensarioIdAndActivoTrue(dispensarioId).stream()
                .map(this::mapToDispensarioDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AceiteDispensarioDTO> listarStockBajoDispensarios() {
        return aceiteDispensarioRepository.findStockBajo().stream()
                .map(this::mapToDispensarioDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AceiteDispensarioDTO> listarStockBajoPorDispensario(Long dispensarioId) {
        return aceiteDispensarioRepository.findStockBajoByDispensario(dispensarioId).stream()
                .map(this::mapToDispensarioDTO)
                .collect(Collectors.toList());
    }

    // ========== COMPRAS ==========

    @Transactional
    public CompraAceiteDTO registrarCompra(CompraAceiteDTO compraDTO, Long usuarioId, String usuarioNombre) {
        Aceite aceite = aceiteRepository.findById(compraDTO.getAceiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Aceite no encontrado con ID: " + compraDTO.getAceiteId()));

        String folio = generarFolioCompra();
        compraDTO.setFolio(folio);

        BigDecimal subtotal = BigDecimal.valueOf(compraDTO.getCantidad()).multiply(compraDTO.getPrecioUnitario());
        BigDecimal iva = subtotal.multiply(new BigDecimal("0.16"));
        BigDecimal total = subtotal.add(iva);

        compraDTO.setSubtotal(subtotal);
        compraDTO.setIva(iva);
        compraDTO.setTotal(total);
        compraDTO.setFechaCompra(LocalDateTime.now());
        compraDTO.setRealizadoPorId(usuarioId);
        compraDTO.setRealizadoPorNombre(usuarioNombre);

        CompraAceite compra = CompraAceite.builder()
                .folio(compraDTO.getFolio())
                .aceiteId(compraDTO.getAceiteId())
                .aceiteNombre(aceite.getNombre())
                .proveedor(compraDTO.getProveedor())
                .cantidad(compraDTO.getCantidad())
                .precioUnitario(compraDTO.getPrecioUnitario())
                .subtotal(subtotal)
                .iva(iva)
                .total(total)
                .factura(compraDTO.getFactura())
                .fechaCompra(LocalDateTime.now())
                .realizadoPorId(usuarioId)
                .realizadoPorNombre(usuarioNombre)
                .observaciones(compraDTO.getObservaciones())
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        compra = compraAceiteRepository.save(compra);

        AceiteBodega bodega = aceiteBodegaRepository.findByAceiteId(compraDTO.getAceiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Aceite no encontrado en bodega"));

        bodega.setStockActual(bodega.getStockActual() + compraDTO.getCantidad());
        bodega.setUpdatedBy(usuarioNombre);
        aceiteBodegaRepository.save(bodega);

        log.info("Compra registrada: {} - {} unidades de {}",
                compra.getFolio(), compra.getCantidad(), compra.getAceiteNombre());

        return mapToCompraDTO(compra);
    }

    @Transactional(readOnly = true)
    public List<CompraAceiteDTO> listarCompras() {
        return compraAceiteRepository.findAll().stream()
                .map(this::mapToCompraDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CompraAceiteDTO> listarComprasPorAceite(Long aceiteId) {
        return compraAceiteRepository.findByAceiteIdOrderByFechaCompraDesc(aceiteId).stream()
                .map(this::mapToCompraDTO)
                .collect(Collectors.toList());
    }

    // ========== TRANSFERENCIAS / SURTIDO ==========

    @Transactional
    public List<TransferenciaAceiteDTO> surtirDispensario(SurtidoRequestDTO request, Long usuarioId, String usuarioNombre) {
        List<TransferenciaAceiteDTO> resultado = new ArrayList<>();

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new ValidationException("Debe seleccionar al menos un aceite para surtir");
        }

        for (SurtidoRequestDTO.ItemSurtidoDTO item : request.getItems()) {
            if (item.getCantidad() == null || item.getCantidad() <= 0) {
                continue;
            }

            AceiteBodega bodega = aceiteBodegaRepository.findByAceiteId(item.getAceiteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Aceite no encontrado en bodega: " + item.getAceiteId()));

            if (!bodega.isStockDisponible(item.getCantidad())) {
                throw new ValidationException("Stock insuficiente en bodega para: " + bodega.getNombre() +
                        ". Disponible: " + bodega.getStockActual() + ", Requerido: " + item.getCantidad());
            }

            AceiteDispensario dispensarioStock = aceiteDispensarioRepository
                    .findByDispensarioIdAndAceiteId(request.getDispensarioId(), item.getAceiteId())
                    .orElseGet(() -> {
                        Aceite aceite = aceiteRepository.findById(item.getAceiteId())
                                .orElseThrow(() -> new ResourceNotFoundException("Aceite no encontrado con ID: " + item.getAceiteId()));
                        return AceiteDispensario.builder()
                                .dispensarioId(request.getDispensarioId())
                                .aceiteId(item.getAceiteId())
                                .codigo(aceite.getCodigo())
                                .nombre(aceite.getNombre())
                                .stockActual(0)
                                .stockMinimo(2)
                                .stockMaximo(20)
                                .precioVenta(aceite.getPrecioVenta())
                                .activo(true)
                                .createdBy(usuarioNombre)
                                .updatedBy(usuarioNombre)
                                .build();
                    });

            bodega.setStockActual(bodega.getStockActual() - item.getCantidad());
            bodega.setUpdatedBy(usuarioNombre);
            aceiteBodegaRepository.save(bodega);

            dispensarioStock.aumentarStock(item.getCantidad());
            dispensarioStock.setUpdatedBy(usuarioNombre);
            aceiteDispensarioRepository.save(dispensarioStock);

            String folio = generarFolioTransferencia();
            TransferenciaAceite transferencia = TransferenciaAceite.builder()
                    .folio(folio)
                    .aceiteId(item.getAceiteId())
                    .aceiteNombre(item.getNombre())
                    .dispensarioOrigenId(null)
                    .dispensarioDestinoId(request.getDispensarioId())
                    .cantidad(item.getCantidad())
                    .tipo("TRANSFERENCIA")
                    .motivo("Surtido a dispensario")
                    .fechaMovimiento(LocalDateTime.now())
                    .realizadoPorId(usuarioId)
                    .realizadoPorNombre(usuarioNombre)
                    .observaciones(request.getObservaciones())
                    .createdBy(usuarioNombre)
                    .updatedBy(usuarioNombre)
                    .build();

            transferencia = transferenciaAceiteRepository.save(transferencia);
            resultado.add(mapToTransferenciaDTO(transferencia));

            log.info("Surtido realizado: {} - {} unidades de {} al dispensario {}",
                    folio, item.getCantidad(), item.getNombre(), request.getDispensarioId());
        }

        return resultado;
    }

    @Transactional(readOnly = true)
    public List<TransferenciaAceiteDTO> listarTransferencias() {
        return transferenciaAceiteRepository.findAll().stream()
                .map(this::mapToTransferenciaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransferenciaAceiteDTO> listarTransferenciasPorDispensario(Long dispensarioId) {
        return transferenciaAceiteRepository.findUltimasTransferenciasByDispensario(dispensarioId).stream()
                .map(this::mapToTransferenciaDTO)
                .collect(Collectors.toList());
    }

    // ========== REPORTES ==========

    @Transactional(readOnly = true)
    public List<AceiteDispensarioDTO> obtenerResumenStockPorDispensario() {
        List<Long> dispensariosIds = aceiteDispensarioRepository.findDistinctDispensarioIds();
        List<AceiteDispensarioDTO> resultado = new ArrayList<>();

        for (Long dispensarioId : dispensariosIds) {
            List<AceiteDispensario> stocks = aceiteDispensarioRepository.findByDispensarioIdAndActivoTrue(dispensarioId);
            for (AceiteDispensario stock : stocks) {
                AceiteDispensarioDTO dto = mapToDispensarioDTO(stock);
                dto.setDispensarioNombre("Dispensario " + dispensarioId);
                resultado.add(dto);
            }
        }

        return resultado;
    }

    // ========== REINICIOS ==========

    @Transactional
    public void reiniciarInventarioAceites(Long usuarioId, String usuarioNombre) {
        List<AceiteBodega> bodegas = aceiteBodegaRepository.findAll();
        for (AceiteBodega b : bodegas) {
            b.setStockActual(0);
            b.setUpdatedBy(usuarioNombre);
            aceiteBodegaRepository.save(b);
        }

        List<AceiteDispensario> dispensarios = aceiteDispensarioRepository.findAll();
        for (AceiteDispensario d : dispensarios) {
            d.setStockActual(0);
            d.setUpdatedBy(usuarioNombre);
            aceiteDispensarioRepository.save(d);
        }

        log.info("Inventario de aceites reiniciado a cero por: {}", usuarioNombre);
    }

    @Transactional
    public Map<String, Object> reiniciarInventarioCompleto(Long usuarioId, String usuarioNombre) {
        log.info("=== INICIANDO REINICIO COMPLETO ===");

        // 1. Contar antes de eliminar
        long comprasAntes = compraAceiteRepository.count();
        long transferenciasAntes = transferenciaAceiteRepository.count();
        log.info("Compras antes: {}", comprasAntes);
        log.info("Transferencias antes: {}", transferenciasAntes);

        // 2. Eliminar TODAS las transferencias (usando deleteAll)
        List<TransferenciaAceite> transferencias = transferenciaAceiteRepository.findAll();
        if (!transferencias.isEmpty()) {
            transferenciaAceiteRepository.deleteAll(transferencias);
            transferenciaAceiteRepository.flush();
            log.info("Transferencias eliminadas: {}", transferencias.size());
        }

        // 3. Eliminar TODAS las compras (usando deleteAll)
        List<CompraAceite> compras = compraAceiteRepository.findAll();
        if (!compras.isEmpty()) {
            compraAceiteRepository.deleteAll(compras);
            compraAceiteRepository.flush();
            log.info("Compras eliminadas: {}", compras.size());
        }

        // 4. Reiniciar stock en bodega a 0
        List<AceiteBodega> bodegas = aceiteBodegaRepository.findAll();
        for (AceiteBodega b : bodegas) {
            b.setStockActual(0);
            b.setUpdatedBy(usuarioNombre);
            aceiteBodegaRepository.save(b);
        }
        log.info("Stock en bodega reiniciado a 0: {} registros", bodegas.size());

        // 5. Reiniciar stock en dispensarios a 0
        List<AceiteDispensario> dispensarios = aceiteDispensarioRepository.findAll();
        for (AceiteDispensario d : dispensarios) {
            d.setStockActual(0);
            d.setUpdatedBy(usuarioNombre);
            aceiteDispensarioRepository.save(d);
        }
        log.info("Stock en dispensarios reiniciado a 0: {} registros", dispensarios.size());

        // 6. Contar después
        long comprasDespues = compraAceiteRepository.count();
        long transferenciasDespues = transferenciaAceiteRepository.count();

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("comprasEliminadas", comprasAntes - comprasDespues);
        resultado.put("transferenciasEliminadas", transferenciasAntes - transferenciasDespues);
        resultado.put("comprasRestantes", comprasDespues);
        resultado.put("transferenciasRestantes", transferenciasDespues);

        log.info("=== REINICIO COMPLETO FINALIZADO ===");
        log.info("Compras eliminadas: {}", comprasAntes - comprasDespues);
        log.info("Transferencias eliminadas: {}", transferenciasAntes - transferenciasDespues);
        log.info("Compras restantes: {}", comprasDespues);
        log.info("Transferencias restantes: {}", transferenciasDespues);

        return resultado;
    }

    // ========== ACTUALIZAR STOCK EN BODEGA ==========

    @Transactional
    public AceiteBodegaDTO actualizarStockBodega(Long aceiteId, Integer nuevoStock, String usuarioNombre) {
        AceiteBodega bodega = aceiteBodegaRepository.findByAceiteId(aceiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Aceite no encontrado en bodega con ID: " + aceiteId));

        if (nuevoStock < 0) {
            throw new ValidationException("El stock no puede ser negativo");
        }

        bodega.setStockActual(nuevoStock);
        bodega.setUpdatedBy(usuarioNombre);
        aceiteBodegaRepository.save(bodega);

        return mapToBodegaDTO(bodega);
    }

    // ========== MÉTODOS PRIVADOS ==========

    private String generarFolioCompra() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return String.format("COMPRA-%s-%s", fecha, uuid);
    }

    private String generarFolioTransferencia() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return String.format("TRANSF-%s-%s", fecha, uuid);
    }

    // ========== MAPPING ==========

    private AceiteBodegaDTO mapToBodegaDTO(AceiteBodega bodega) {
        return AceiteBodegaDTO.builder()
                .id(bodega.getId())
                .aceiteId(bodega.getAceiteId())
                .codigo(bodega.getCodigo())
                .nombre(bodega.getNombre())
                .stockActual(bodega.getStockActual())
                .stockMinimo(bodega.getStockMinimo())
                .stockMaximo(bodega.getStockMaximo())
                .precioCompra(bodega.getPrecioCompra())
                .precioVenta(bodega.getPrecioVenta())
                .proveedor(bodega.getProveedor())
                .ubicacion(bodega.getUbicacion())
                .activo(bodega.getActivo())
                .stockBajo(bodega.isStockBajo())
                .stockCritico(bodega.isStockCritico())
                .createdAt(bodega.getCreatedAt())
                .updatedAt(bodega.getUpdatedAt())
                .build();
    }

    private AceiteDispensarioDTO mapToDispensarioDTO(AceiteDispensario dispensario) {
        return AceiteDispensarioDTO.builder()
                .id(dispensario.getId())
                .dispensarioId(dispensario.getDispensarioId())
                .aceiteId(dispensario.getAceiteId())
                .codigo(dispensario.getCodigo())
                .nombre(dispensario.getNombre())
                .stockActual(dispensario.getStockActual())
                .stockMinimo(dispensario.getStockMinimo())
                .stockMaximo(dispensario.getStockMaximo())
                .precioVenta(dispensario.getPrecioVenta())
                .activo(dispensario.getActivo())
                .stockBajo(dispensario.isStockBajo())
                .stockCritico(dispensario.isStockCritico())
                .createdAt(dispensario.getCreatedAt())
                .updatedAt(dispensario.getUpdatedAt())
                .build();
    }

    private CompraAceiteDTO mapToCompraDTO(CompraAceite compra) {
        return CompraAceiteDTO.builder()
                .id(compra.getId())
                .folio(compra.getFolio())
                .aceiteId(compra.getAceiteId())
                .aceiteNombre(compra.getAceiteNombre())
                .proveedor(compra.getProveedor())
                .cantidad(compra.getCantidad())
                .precioUnitario(compra.getPrecioUnitario())
                .subtotal(compra.getSubtotal())
                .iva(compra.getIva())
                .total(compra.getTotal())
                .factura(compra.getFactura())
                .fechaCompra(compra.getFechaCompra())
                .realizadoPorId(compra.getRealizadoPorId())
                .realizadoPorNombre(compra.getRealizadoPorNombre())
                .observaciones(compra.getObservaciones())
                .createdAt(compra.getCreatedAt())
                .build();
    }

    private TransferenciaAceiteDTO mapToTransferenciaDTO(TransferenciaAceite transferencia) {
        String origenNombre = transferencia.getDispensarioOrigenId() == null ?
                "BODEGA" : "Dispensario " + transferencia.getDispensarioOrigenId();
        String destinoNombre = "Dispensario " + transferencia.getDispensarioDestinoId();

        return TransferenciaAceiteDTO.builder()
                .id(transferencia.getId())
                .folio(transferencia.getFolio())
                .aceiteId(transferencia.getAceiteId())
                .aceiteNombre(transferencia.getAceiteNombre())
                .dispensarioOrigenId(transferencia.getDispensarioOrigenId())
                .dispensarioOrigenNombre(origenNombre)
                .dispensarioDestinoId(transferencia.getDispensarioDestinoId())
                .dispensarioDestinoNombre(destinoNombre)
                .cantidad(transferencia.getCantidad())
                .tipo(transferencia.getTipo())
                .motivo(transferencia.getMotivo())
                .fechaMovimiento(transferencia.getFechaMovimiento())
                .realizadoPorId(transferencia.getRealizadoPorId())
                .realizadoPorNombre(transferencia.getRealizadoPorNombre())
                .observaciones(transferencia.getObservaciones())
                .createdAt(transferencia.getCreatedAt())
                .build();
    }
}