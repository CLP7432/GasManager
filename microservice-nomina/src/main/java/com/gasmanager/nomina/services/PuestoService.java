package com.gasmanager.nomina.services;

import com.gasmanager.nomina.dto.PuestoDTO;
import com.gasmanager.nomina.entities.Puesto;
import com.gasmanager.nomina.exceptions.ResourceNotFoundException;
import com.gasmanager.nomina.exceptions.ValidationException;
import com.gasmanager.nomina.repositories.PuestoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PuestoService {

    private final PuestoRepository puestoRepository;

    public PuestoDTO crearPuesto(PuestoDTO puestoDTO, Long usuarioId, String usuarioNombre) {
        if (puestoRepository.existsByNombre(puestoDTO.getNombre())) {
            throw new ValidationException("Ya existe un puesto con el nombre: " + puestoDTO.getNombre());
        }

        BigDecimal salarioDiario = puestoDTO.getSalarioBase().divide(new BigDecimal("30"), 2, java.math.RoundingMode.HALF_UP);

        Puesto puesto = Puesto.builder()
                .nombre(puestoDTO.getNombre())
                .descripcion(puestoDTO.getDescripcion())
                .salarioBase(puestoDTO.getSalarioBase())
                .salarioDiario(salarioDiario)
                .riesgoPuesto(puestoDTO.getRiesgoPuesto())
                .activo(true)
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        puesto = puestoRepository.save(puesto);
        return mapToDTO(puesto);
    }

    public PuestoDTO actualizarPuesto(Long id, PuestoDTO puestoDTO, Long usuarioId, String usuarioNombre) {
        Puesto puesto = puestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puesto no encontrado con ID: " + id));

        puesto.setNombre(puestoDTO.getNombre());
        puesto.setDescripcion(puestoDTO.getDescripcion());
        puesto.setSalarioBase(puestoDTO.getSalarioBase());
        puesto.setSalarioDiario(puestoDTO.getSalarioBase().divide(new BigDecimal("30"), 2, java.math.RoundingMode.HALF_UP));
        puesto.setRiesgoPuesto(puestoDTO.getRiesgoPuesto());
        puesto.setUpdatedBy(usuarioNombre);

        puesto = puestoRepository.save(puesto);
        return mapToDTO(puesto);
    }

    public PuestoDTO toggleActivo(Long id) {
        Puesto puesto = puestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puesto no encontrado con ID: " + id));
        puesto.setActivo(!puesto.getActivo());
        puesto = puestoRepository.save(puesto);
        return mapToDTO(puesto);
    }

    @Transactional(readOnly = true)
    public List<PuestoDTO> listarPuestos() {
        return puestoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PuestoDTO> listarPuestosActivos() {
        return puestoRepository.findByActivoTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PuestoDTO obtenerPuesto(Long id) {
        Puesto puesto = puestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puesto no encontrado con ID: " + id));
        return mapToDTO(puesto);
    }

    public void eliminarPuesto(Long id) {
        Puesto puesto = puestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puesto no encontrado con ID: " + id));
        puestoRepository.delete(puesto);
    }

    private PuestoDTO mapToDTO(Puesto puesto) {
        return PuestoDTO.builder()
                .id(puesto.getId())
                .nombre(puesto.getNombre())
                .descripcion(puesto.getDescripcion())
                .salarioBase(puesto.getSalarioBase())
                .salarioDiario(puesto.getSalarioDiario())
                .riesgoPuesto(puesto.getRiesgoPuesto())
                .activo(puesto.getActivo())
                .createdAt(puesto.getCreatedAt())
                .updatedAt(puesto.getUpdatedAt())
                .build();
    }
}