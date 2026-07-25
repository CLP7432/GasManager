package com.gasmanager.inventarios.services;

import com.gasmanager.inventarios.dto.InventarioCombustibleDTO;
import com.gasmanager.inventarios.entities.CargaPipa;
import com.gasmanager.inventarios.entities.InventarioCombustible;
import com.gasmanager.inventarios.enums.TipoCombustible;
import com.gasmanager.inventarios.exceptions.ResourceNotFoundException;
import com.gasmanager.inventarios.exceptions.ValidationException;
import com.gasmanager.inventarios.repositories.CargaPipaRepository;
import com.gasmanager.inventarios.repositories.InventarioCombustibleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class InventarioCombustibleService {

    @Autowired
    private InventarioCombustibleRepository inventarioRepository;

    @Autowired
    private CargaPipaRepository cargaPipaRepository;

    // ========== INICIALIZACIÓN DE INVENTARIO ==========

    @Transactional
    public void inicializarInventario() {
        if (inventarioRepository.count() == 0) {
            InventarioCombustible magna = new InventarioCombustible(
                    TipoCombustible.MAGNA, "Gasolina Magna", new BigDecimal("50000"));
            magna.setStockActual(new BigDecimal("25000"));
            magna.setStockMinimo(new BigDecimal("5000"));
            magna.setActivo(true);

            InventarioCombustible premium = new InventarioCombustible(
                    TipoCombustible.PREMIUM, "Gasolina Premium", new BigDecimal("50000"));
            premium.setStockActual(new BigDecimal("25000"));
            premium.setStockMinimo(new BigDecimal("5000"));
            premium.setActivo(true);

            InventarioCombustible diesel = new InventarioCombustible(
                    TipoCombustible.DIESEL, "Diesel", new BigDecimal("50000"));
            diesel.setStockActual(new BigDecimal("25000"));
            diesel.setStockMinimo(new BigDecimal("5000"));
            diesel.setActivo(true);

            inventarioRepository.save(magna);
            inventarioRepository.save(premium);
            inventarioRepository.save(diesel);
        }
    }

    // ========== DESCONTAR STOCK (para ventas) ==========

    @Transactional
    public void descontarStock(TipoCombustible tipo, BigDecimal cantidad, String motivo, Long usuarioId, String usuarioNombre) {
        if (cantidad == null || cantidad.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("La cantidad a descontar debe ser mayor a 0");
        }

        InventarioCombustible inventario = inventarioRepository.findByTipoCombustible(tipo)
                .orElseThrow(() -> new ResourceNotFoundException("No existe inventario para: " + tipo));

        if (inventario.getStockActual().compareTo(cantidad) < 0) {
            throw new ValidationException(
                    "Stock insuficiente de " + inventario.getNombre() +
                            ". Actual: " + inventario.getStockActual() + "L, Requerido: " + cantidad + "L");
        }

        BigDecimal nuevoStock = inventario.getStockActual().subtract(cantidad);
        inventario.setStockActual(nuevoStock);
        inventario.setUltimaLectura(LocalDateTime.now());
        inventario.setUpdatedBy(usuarioNombre);
        inventarioRepository.save(inventario);
    }

    // ========== REGISTRO DE CARGA DE PIPA ==========

    @Transactional
    public CargaPipa registrarCargaPipa(CargaPipa carga, Long usuarioId, String usuarioNombre) {
        if (carga.getVolumen() == null || carga.getVolumen().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("El volumen debe ser mayor a 0");
        }

        if (carga.getTipoCombustible() == null) {
            throw new ValidationException("Debe especificar el tipo de combustible");
        }

        if (carga.getFolio() == null || carga.getFolio().isEmpty()) {
            carga.setFolio(generarFolioCarga());
        }

        if (cargaPipaRepository.existsByFolio(carga.getFolio())) {
            throw new ValidationException("Ya existe una carga con el folio: " + carga.getFolio());
        }

        if (carga.getPrecioCompra() != null && carga.getCostoTotal() == null) {
            carga.setCostoTotal(carga.getVolumen().multiply(carga.getPrecioCompra()));
        }

        InventarioCombustible inventario = inventarioRepository.findByTipoCombustible(carga.getTipoCombustible())
                .orElseThrow(() -> new ResourceNotFoundException("No existe inventario para el combustible: " + carga.getTipoCombustible()));

        BigDecimal nuevoStock = inventario.getStockActual().add(carga.getVolumen());
        if (inventario.getCapacidadTanque() != null && nuevoStock.compareTo(inventario.getCapacidadTanque()) > 0) {
            BigDecimal espacioDisponible = inventario.getCapacidadTanque().subtract(inventario.getStockActual());
            throw new ValidationException(
                    "No se puede cargar " + carga.getVolumen() + "L. " +
                            "Espacio disponible en tanque: " + espacioDisponible + "L");
        }

        carga.setFechaCarga(LocalDateTime.now());
        carga.setCargadoPor(usuarioNombre);
        carga.setCargadoPorId(usuarioId);
        carga.setCreatedBy(usuarioNombre);
        carga.setUpdatedBy(usuarioNombre);

        CargaPipa guardada = cargaPipaRepository.save(carga);

        inventario.setStockActual(nuevoStock);
        inventario.setUltimaLectura(LocalDateTime.now());
        inventario.setUpdatedBy(usuarioNombre);
        inventarioRepository.save(inventario);

        return guardada;
    }

    // ========== ACTUALIZAR STOCK MANUALMENTE ==========

    @Transactional
    public InventarioCombustible actualizarStockManual(Long id, BigDecimal nuevoStock, String motivo, Long usuarioId, String usuarioNombre) {
        InventarioCombustible inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado con ID: " + id));

        if (nuevoStock.compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("El stock no puede ser negativo");
        }

        if (inventario.getCapacidadTanque() != null && nuevoStock.compareTo(inventario.getCapacidadTanque()) > 0) {
            throw new ValidationException("El stock no puede exceder la capacidad del tanque: " + inventario.getCapacidadTanque() + "L");
        }

        inventario.setStockActual(nuevoStock);
        inventario.setUltimaLectura(LocalDateTime.now());
        inventario.setUpdatedBy(usuarioNombre);
        inventarioRepository.save(inventario);

        return inventario;
    }

    // ========== CONFIGURACIÓN DE TANQUES ==========

    @Transactional
    public List<InventarioCombustible> actualizarConfiguracionTanques(
            List<InventarioCombustibleDTO> configuracion,
            Long usuarioId,
            String usuarioNombre) {

        List<InventarioCombustible> actualizados = new ArrayList<>();

        for (InventarioCombustibleDTO dto : configuracion) {
            InventarioCombustible inventario = inventarioRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Inventario no encontrado para ID: " + dto.getId()));

            if (dto.getStockActual() != null && inventario.getCapacidadTanque() != null) {
                if (dto.getStockActual().compareTo(inventario.getCapacidadTanque()) > 0) {
                    throw new ValidationException(
                            "El stock de " + inventario.getNombre() +
                                    " no puede exceder la capacidad del tanque: " +
                                    inventario.getCapacidadTanque() + "L");
                }
            }

            if (dto.getStockActual() != null) {
                inventario.setStockActual(dto.getStockActual());
            }
            if (dto.getStockMinimo() != null) {
                inventario.setStockMinimo(dto.getStockMinimo());
            }
            if (dto.getCapacidadTanque() != null) {
                inventario.setCapacidadTanque(dto.getCapacidadTanque());
            }

            inventario.setUltimaLectura(LocalDateTime.now());
            inventario.setUpdatedBy(usuarioNombre);

            actualizados.add(inventarioRepository.save(inventario));
        }

        return actualizados;
    }

    @Transactional
    public void reiniciarInventario(Long usuarioId, String usuarioNombre) {
        List<InventarioCombustible> inventarios = inventarioRepository.findAll();

        for (InventarioCombustible inv : inventarios) {
            inv.setStockActual(BigDecimal.ZERO);
            inv.setUltimaLectura(LocalDateTime.now());
            inv.setUpdatedBy(usuarioNombre);
            inventarioRepository.save(inv);
        }
    }

    // ========== CONSULTAS ==========

    @Transactional(readOnly = true)
    public List<InventarioCombustible> listarInventario() {
        return inventarioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<InventarioCombustible> listarActivos() {
        return inventarioRepository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public List<InventarioCombustible> verificarStockBajo() {
        return inventarioRepository.findByStockActualLessThanStockMinimo();
    }

    @Transactional(readOnly = true)
    public InventarioCombustible obtenerPorTipo(TipoCombustible tipo) {
        return inventarioRepository.findByTipoCombustible(tipo)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado para: " + tipo));
    }

    @Transactional(readOnly = true)
    public InventarioCombustible obtenerPorId(Long id) {
        return inventarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado con ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<CargaPipa> listarCargasPipa() {
        return cargaPipaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public CargaPipa obtenerCargaPipa(Long id) {
        return cargaPipaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carga no encontrada con ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<CargaPipa> listarCargasPorTipo(TipoCombustible tipo) {
        return cargaPipaRepository.findByTipoCombustible(tipo);
    }

    // ========== MÉTODOS PRIVADOS ==========

    private String generarFolioCarga() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long secuencial = cargaPipaRepository.count() + 1;
        return String.format("CARGA-%s-%04d", fecha, secuencial);
    }

    // ========== DTO MAPPING ==========

    public InventarioCombustibleDTO mapToDTO(InventarioCombustible inventario) {
        InventarioCombustibleDTO dto = new InventarioCombustibleDTO();
        dto.setId(inventario.getId());
        dto.setTipoCombustible(inventario.getTipoCombustible().name());
        dto.setNombre(inventario.getNombre());
        dto.setCapacidadTanque(inventario.getCapacidadTanque());
        dto.setStockActual(inventario.getStockActual());
        dto.setStockMinimo(inventario.getStockMinimo());
        dto.setPorcentajeOcupacion(inventario.getPorcentajeOcupacion());
        dto.setUltimaLectura(inventario.getUltimaLectura());
        dto.setActivo(inventario.getActivo());
        return dto;
    }
}