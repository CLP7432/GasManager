package com.gasmanager.inventarios.services;

import com.gasmanager.inventarios.dto.AceiteDTO;
import com.gasmanager.inventarios.entities.Aceite;
import com.gasmanager.inventarios.exceptions.ResourceNotFoundException;
import com.gasmanager.inventarios.exceptions.ValidationException;
import com.gasmanager.inventarios.repositories.AceiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AceiteServiceImpl implements AceiteService {
    @Autowired
    private AceiteRepository aceiteRepository;

    @Override
    @Transactional
    public AceiteDTO crearAceite(AceiteDTO aceiteDTO, Long usuarioId, String usuarioNombre) {

        if (aceiteRepository.existsByCodigo(aceiteDTO.getCodigo())) {
            throw new ValidationException("Ya existe un aceite con el codigo" + aceiteDTO.getCodigo());
        }
        Aceite aceite = new Aceite();
        aceite.setCodigo(aceiteDTO.getCodigo());
        aceite.setNombre(aceiteDTO.getNombre());
        aceite.setPrecioVenta(aceiteDTO.getPrecioVenta());
        aceite.setDescripcion(aceiteDTO.getDescripcion());
        aceite.setMarca(aceiteDTO.getMarca());
        aceite.setTipoAceite(aceiteDTO.getTipoAceite());
        aceite.setPresentacion(aceiteDTO.getPresentacion());
        aceite.setPrecioCompra(aceiteDTO.getPrecioCompra());
        aceite.setStockMinimo(aceiteDTO.getStockMinimo() != null ? aceiteDTO.getStockMinimo() : 5);
        aceite.setStockMaximo(aceiteDTO.getStockMaximo() != null ? aceiteDTO.getStockMaximo() : 50);
        aceite.setUbicacion(aceiteDTO.getUbicacion());
        aceite.setCreatedBy(usuarioNombre);
        aceite.setUpdatedBy(usuarioNombre);

        aceite = aceiteRepository.save(aceite);

        return mapToDTO(aceite);
    }

    private AceiteDTO mapToDTO(Aceite aceite) {
        AceiteDTO dto = new AceiteDTO();
        dto.setId(aceite.getId());
        dto.setCodigo(aceite.getCodigo());
        dto.setNombre(aceite.getNombre());
        dto.setDescripcion(aceite.getDescripcion());
        dto.setMarca(aceite.getMarca());
        dto.setTipoAceite(aceite.getTipoAceite());
        dto.setPresentacion(aceite.getPresentacion());
        dto.setPrecioCompra(aceite.getPrecioCompra());
        dto.setPrecioVenta(aceite.getPrecioVenta());
        dto.setStockActual(aceite.getStockActual());
        dto.setStockMinimo(aceite.getStockMinimo());
        dto.setStockMaximo(aceite.getStockMaximo());
        dto.setUbicacion(aceite.getUbicacion());
        dto.setActivo(aceite.getActivo());
        dto.setCreatedAt(aceite.getCreatedAt());
        dto.setUpdatedAt(aceite.getUpdatedAt());
        return dto;
    }


    @Override
    @Transactional
    public AceiteDTO actualizarAceite(Long id, AceiteDTO aceiteDTO,
                                      Long usuarioId, String usuarioNombre) {

        Aceite aceite = aceiteRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Aceite no encontrado con ID: " + id));

        aceite.setNombre(aceiteDTO.getNombre());
        aceite.setDescripcion(aceiteDTO.getDescripcion());
        aceite.setMarca(aceiteDTO.getMarca());
        aceite.setTipoAceite(aceiteDTO.getTipoAceite());
        aceite.setPresentacion(aceiteDTO.getPresentacion());
        aceite.setPrecioCompra(aceiteDTO.getPrecioCompra());
        aceite.setPrecioVenta(aceiteDTO.getPrecioVenta());
        aceite.setStockMinimo(aceiteDTO.getStockMinimo());
        aceite.setStockMaximo(aceiteDTO.getStockMaximo() );
        aceite.setUbicacion(aceiteDTO.getUbicacion());
        aceite.setUpdatedBy(usuarioNombre);

        aceite = aceiteRepository.save(aceite);
        return mapToDTO(aceite);
    }

    @Override
    @Transactional
    public AceiteDTO actualizarStock(Long id, Integer nuevoStock, String motivo,
                                     Long usuarioId, String usuarioNombre) {
        if(nuevoStock < 0){
            throw new ValidationException("El stock no puede ser negativo");
        }
        Aceite aceite = aceiteRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Aceite no encontrado con ID: " + id));

        aceite.setStockActual(nuevoStock);
        aceite.setUpdatedBy(usuarioNombre);

        aceite = aceiteRepository.save(aceite);

        return mapToDTO(aceite);
    }


    @Override
    @Transactional(readOnly = true)
    public List<AceiteDTO> listarAceites() {

        return aceiteRepository
                .findAll()
                .stream()
                .map(aceite -> mapToDTO(aceite))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AceiteDTO obtenerAceite(Long id) {

        Aceite aceite = aceiteRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Aceite no encontrado con ID: " + id));

        return mapToDTO(aceite);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AceiteDTO> listarActivos() {
        return aceiteRepository
                .findByActivoTrue()
                .stream()
                .map(aceite -> mapToDTO(aceite))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AceiteDTO> listarConStockBajo() {
        return aceiteRepository.findByStockActualLessThanEqual(5)
                .stream()
                .map(aceite -> mapToDTO(aceite))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarAceite(Long id) {

        Aceite aceite = aceiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aceite no encontrado con ID: " + id));

        aceiteRepository.delete(aceite);
    }


    @Override
    @Transactional
    public AceiteDTO toggleActivo(Long id) {

        Aceite aceite = aceiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aceite no encontrado con ID: " + id));

        aceite.setActivo(!aceite.getActivo());
        aceite = aceiteRepository.save(aceite);

        return mapToDTO(aceite);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validarStockDisponible(Long id, Integer cantidadRequerida) {

        Aceite aceite = aceiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aceite no encontrado con ID: " + id));

        return aceite.getStockActual() >= aceite.getStockMinimo();
    }
}
