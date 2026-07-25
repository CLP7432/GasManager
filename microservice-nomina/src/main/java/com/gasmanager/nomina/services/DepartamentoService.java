package com.gasmanager.nomina.services;

import com.gasmanager.nomina.dto.DepartamentoDTO;
import com.gasmanager.nomina.entities.Departamento;
import com.gasmanager.nomina.exceptions.ResourceNotFoundException;
import com.gasmanager.nomina.exceptions.ValidationException;
import com.gasmanager.nomina.repositories.DepartamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;

    public DepartamentoDTO crearDepartamento(DepartamentoDTO departamentoDTO, Long usuarioId, String usuarioNombre) {
        if (departamentoRepository.existsByNombre(departamentoDTO.getNombre())) {
            throw new ValidationException("Ya existe un departamento con el nombre: " + departamentoDTO.getNombre());
        }

        Departamento departamento = Departamento.builder()
                .nombre(departamentoDTO.getNombre())
                .descripcion(departamentoDTO.getDescripcion())
                .activo(true)
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        departamento = departamentoRepository.save(departamento);
        return mapToDTO(departamento);
    }

    public DepartamentoDTO actualizarDepartamento(Long id, DepartamentoDTO departamentoDTO, Long usuarioId, String usuarioNombre) {
        Departamento departamento = departamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con ID: " + id));

        departamento.setNombre(departamentoDTO.getNombre());
        departamento.setDescripcion(departamentoDTO.getDescripcion());
        departamento.setUpdatedBy(usuarioNombre);

        departamento = departamentoRepository.save(departamento);
        return mapToDTO(departamento);
    }

    public DepartamentoDTO toggleActivo(Long id) {
        Departamento departamento = departamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con ID: " + id));
        departamento.setActivo(!departamento.getActivo());
        departamento = departamentoRepository.save(departamento);
        return mapToDTO(departamento);
    }

    @Transactional(readOnly = true)
    public List<DepartamentoDTO> listarDepartamentos() {
        return departamentoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DepartamentoDTO> listarDepartamentosActivos() {
        return departamentoRepository.findByActivoTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartamentoDTO obtenerDepartamento(Long id) {
        Departamento departamento = departamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con ID: " + id));
        return mapToDTO(departamento);
    }

    public void eliminarDepartamento(Long id) {
        Departamento departamento = departamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con ID: " + id));
        departamentoRepository.delete(departamento);
    }

    private DepartamentoDTO mapToDTO(Departamento departamento) {
        return DepartamentoDTO.builder()
                .id(departamento.getId())
                .nombre(departamento.getNombre())
                .descripcion(departamento.getDescripcion())
                .activo(departamento.getActivo())
                .createdAt(departamento.getCreatedAt())
                .updatedAt(departamento.getUpdatedAt())
                .build();
    }
}