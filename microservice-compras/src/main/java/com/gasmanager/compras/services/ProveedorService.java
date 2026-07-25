package com.gasmanager.compras.services;

import com.gasmanager.compras.dto.ProveedorDTO;
import com.gasmanager.compras.entities.Proveedor;
import com.gasmanager.compras.exceptions.ResourceNotFoundException;
import com.gasmanager.compras.exceptions.ValidationException;
import com.gasmanager.compras.repositories.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;

    public ProveedorDTO crearProveedor(ProveedorDTO proveedorDTO, Long usuarioId, String usuarioNombre) {
        if (proveedorDTO.getRfc() != null && proveedorRepository.existsByRfc(proveedorDTO.getRfc())) {
            throw new ValidationException("Ya existe un proveedor con el RFC: " + proveedorDTO.getRfc());
        }

        Proveedor proveedor = Proveedor.builder()
                .codigoProveedor(generarCodigoProveedor())
                .nombre(proveedorDTO.getNombre())
                .rfc(proveedorDTO.getRfc())
                .email(proveedorDTO.getEmail())
                .telefono(proveedorDTO.getTelefono())
                .contacto(proveedorDTO.getContacto())
                .direccion(proveedorDTO.getDireccion())
                .activo(true)
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        proveedor = proveedorRepository.save(proveedor);
        return mapToDTO(proveedor);
    }

    public ProveedorDTO actualizarProveedor(Long id, ProveedorDTO proveedorDTO, Long usuarioId, String usuarioNombre) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + id));

        proveedor.setNombre(proveedorDTO.getNombre());
        proveedor.setRfc(proveedorDTO.getRfc());
        proveedor.setEmail(proveedorDTO.getEmail());
        proveedor.setTelefono(proveedorDTO.getTelefono());
        proveedor.setContacto(proveedorDTO.getContacto());
        proveedor.setDireccion(proveedorDTO.getDireccion());
        proveedor.setUpdatedBy(usuarioNombre);

        proveedor = proveedorRepository.save(proveedor);
        return mapToDTO(proveedor);
    }

    public ProveedorDTO toggleActivo(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + id));
        proveedor.setActivo(!proveedor.getActivo());
        proveedor = proveedorRepository.save(proveedor);
        return mapToDTO(proveedor);
    }

    @Transactional(readOnly = true)
    public List<ProveedorDTO> listarProveedores() {
        return proveedorRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProveedorDTO> listarProveedoresActivos() {
        return proveedorRepository.findByActivoTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProveedorDTO obtenerProveedor(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + id));
        return mapToDTO(proveedor);
    }

    @Transactional(readOnly = true)
    public List<ProveedorDTO> buscarPorNombre(String nombre) {
        return proveedorRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void eliminarProveedor(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + id));
        proveedorRepository.delete(proveedor);
    }

    private String generarCodigoProveedor() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long secuencial = proveedorRepository.count() + 1;
        return String.format("PROV-%s-%04d", fecha, secuencial);
    }

    private ProveedorDTO mapToDTO(Proveedor proveedor) {
        return ProveedorDTO.builder()
                .id(proveedor.getId())
                .codigoProveedor(proveedor.getCodigoProveedor())
                .nombre(proveedor.getNombre())
                .rfc(proveedor.getRfc())
                .email(proveedor.getEmail())
                .telefono(proveedor.getTelefono())
                .contacto(proveedor.getContacto())
                .direccion(proveedor.getDireccion())
                .activo(proveedor.getActivo())
                .createdAt(proveedor.getCreatedAt())
                .updatedAt(proveedor.getUpdatedAt())
                .build();
    }
}