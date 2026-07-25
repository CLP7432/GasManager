package com.gasmanager.nomina.services;

import com.gasmanager.nomina.dto.IncidenciaDTO;
import com.gasmanager.nomina.entities.Empleado;
import com.gasmanager.nomina.entities.Incidencia;
import com.gasmanager.nomina.exceptions.ResourceNotFoundException;
import com.gasmanager.nomina.exceptions.ValidationException;
import com.gasmanager.nomina.repositories.EmpleadoRepository;
import com.gasmanager.nomina.repositories.IncidenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class IncidenciaService {

    private final IncidenciaRepository incidenciaRepository;
    private final EmpleadoRepository empleadoRepository;

    public IncidenciaDTO registrarIncidencia(IncidenciaDTO incidenciaDTO, Long usuarioId, String usuarioNombre) {
        Empleado empleado = empleadoRepository.findById(incidenciaDTO.getEmpleadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con ID: " + incidenciaDTO.getEmpleadoId()));

        Incidencia incidencia = Incidencia.builder()
                .empleado(empleado)
                .tipo(incidenciaDTO.getTipo())
                .fecha(incidenciaDTO.getFecha())
                .cantidad(incidenciaDTO.getCantidad())
                .monto(incidenciaDTO.getMonto())
                .observaciones(incidenciaDTO.getObservaciones())
                .autorizadoPor(incidenciaDTO.getAutorizadoPor())
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        incidencia = incidenciaRepository.save(incidencia);
        return mapToDTO(incidencia);
    }

    public IncidenciaDTO actualizarIncidencia(Long id, IncidenciaDTO incidenciaDTO, Long usuarioId, String usuarioNombre) {
        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con ID: " + id));

        incidencia.setTipo(incidenciaDTO.getTipo());
        incidencia.setFecha(incidenciaDTO.getFecha());
        incidencia.setCantidad(incidenciaDTO.getCantidad());
        incidencia.setMonto(incidenciaDTO.getMonto());
        incidencia.setObservaciones(incidenciaDTO.getObservaciones());
        incidencia.setAutorizadoPor(incidenciaDTO.getAutorizadoPor());
        incidencia.setUpdatedBy(usuarioNombre);

        incidencia = incidenciaRepository.save(incidencia);
        return mapToDTO(incidencia);
    }

    public void eliminarIncidencia(Long id) {
        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con ID: " + id));
        incidenciaRepository.delete(incidencia);
    }

    @Transactional(readOnly = true)
    public List<IncidenciaDTO> listarIncidenciasPorEmpleado(Long empleadoId) {
        return incidenciaRepository.findByEmpleadoId(empleadoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IncidenciaDTO> listarIncidencias() {
        return incidenciaRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IncidenciaDTO obtenerIncidencia(Long id) {
        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con ID: " + id));
        return mapToDTO(incidencia);
    }

    private IncidenciaDTO mapToDTO(Incidencia incidencia) {
        return IncidenciaDTO.builder()
                .id(incidencia.getId())
                .empleadoId(incidencia.getEmpleado().getId())
                .empleadoNombre(incidencia.getEmpleado().getNombreCompleto())
                .tipo(incidencia.getTipo())
                .fecha(incidencia.getFecha())
                .cantidad(incidencia.getCantidad())
                .monto(incidencia.getMonto())
                .observaciones(incidencia.getObservaciones())
                .autorizadoPor(incidencia.getAutorizadoPor())
                .createdAt(incidencia.getCreatedAt())
                .updatedAt(incidencia.getUpdatedAt())
                .build();
    }
}