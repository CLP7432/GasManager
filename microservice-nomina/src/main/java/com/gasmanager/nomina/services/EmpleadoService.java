package com.gasmanager.nomina.services;

import com.gasmanager.nomina.dto.EmpleadoDTO;
import com.gasmanager.nomina.entities.Departamento;
import com.gasmanager.nomina.entities.Empleado;
import com.gasmanager.nomina.entities.Puesto;
import com.gasmanager.nomina.exceptions.ResourceNotFoundException;
import com.gasmanager.nomina.exceptions.ValidationException;
import com.gasmanager.nomina.repositories.DepartamentoRepository;
import com.gasmanager.nomina.repositories.EmpleadoRepository;
import com.gasmanager.nomina.repositories.PuestoRepository;
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
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final PuestoRepository puestoRepository;
    private final DepartamentoRepository departamentoRepository;

    // ========== CREAR EMPLEADO ==========
    public EmpleadoDTO crearEmpleado(EmpleadoDTO empleadoDTO, Long usuarioId, String usuarioNombre) {
        // Validar RFC único
        if (empleadoDTO.getRfc() != null && empleadoRepository.existsByRfc(empleadoDTO.getRfc())) {
            throw new ValidationException("Ya existe un empleado con el RFC: " + empleadoDTO.getRfc());
        }

        // Validar NSS único
        if (empleadoDTO.getNss() != null && empleadoRepository.existsByNss(empleadoDTO.getNss())) {
            throw new ValidationException("Ya existe un empleado con el NSS: " + empleadoDTO.getNss());
        }

        // Validar puesto
        Puesto puesto = null;
        if (empleadoDTO.getPuestoId() != null) {
            puesto = puestoRepository.findById(empleadoDTO.getPuestoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Puesto no encontrado con ID: " + empleadoDTO.getPuestoId()));
        }

        // Validar departamento
        Departamento departamento = null;
        if (empleadoDTO.getDepartamentoId() != null) {
            departamento = departamentoRepository.findById(empleadoDTO.getDepartamentoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con ID: " + empleadoDTO.getDepartamentoId()));
        }

        // Calcular salario mensual
        BigDecimal salarioMensual = empleadoDTO.getSalarioDiario().multiply(new BigDecimal("30"));

        Empleado empleado = Empleado.builder()
                .codigoEmpleado(generarCodigoEmpleado())
                .nombre(empleadoDTO.getNombre())
                .apellidoPaterno(empleadoDTO.getApellidoPaterno())
                .apellidoMaterno(empleadoDTO.getApellidoMaterno())
                .rfc(empleadoDTO.getRfc())
                .curp(empleadoDTO.getCurp())
                .nss(empleadoDTO.getNss())
                .email(empleadoDTO.getEmail())
                .telefono(empleadoDTO.getTelefono())
                .celular(empleadoDTO.getCelular())
                .fechaNacimiento(empleadoDTO.getFechaNacimiento())
                .fechaIngreso(empleadoDTO.getFechaIngreso())
                .activo(true)
                .puesto(puesto)
                .departamento(departamento)
                .tipoContrato(empleadoDTO.getTipoContrato())
                .tipoJornada(empleadoDTO.getTipoJornada())
                .salarioDiario(empleadoDTO.getSalarioDiario())
                .salarioMensual(salarioMensual)
                .numeroCuenta(empleadoDTO.getNumeroCuenta())
                .banco(empleadoDTO.getBanco())
                .direccion(empleadoDTO.getDireccion())
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        empleado = empleadoRepository.save(empleado);
        return mapToDTO(empleado);
    }

    // ========== ACTUALIZAR EMPLEADO ==========
    public EmpleadoDTO actualizarEmpleado(Long id, EmpleadoDTO empleadoDTO, Long usuarioId, String usuarioNombre) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con ID: " + id));

        // Validar puesto
        if (empleadoDTO.getPuestoId() != null) {
            Puesto puesto = puestoRepository.findById(empleadoDTO.getPuestoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Puesto no encontrado con ID: " + empleadoDTO.getPuestoId()));
            empleado.setPuesto(puesto);
        }

        // Validar departamento
        if (empleadoDTO.getDepartamentoId() != null) {
            Departamento departamento = departamentoRepository.findById(empleadoDTO.getDepartamentoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con ID: " + empleadoDTO.getDepartamentoId()));
            empleado.setDepartamento(departamento);
        }

        empleado.setNombre(empleadoDTO.getNombre());
        empleado.setApellidoPaterno(empleadoDTO.getApellidoPaterno());
        empleado.setApellidoMaterno(empleadoDTO.getApellidoMaterno());
        empleado.setRfc(empleadoDTO.getRfc());
        empleado.setCurp(empleadoDTO.getCurp());
        empleado.setNss(empleadoDTO.getNss());
        empleado.setEmail(empleadoDTO.getEmail());
        empleado.setTelefono(empleadoDTO.getTelefono());
        empleado.setCelular(empleadoDTO.getCelular());
        empleado.setFechaNacimiento(empleadoDTO.getFechaNacimiento());
        empleado.setFechaIngreso(empleadoDTO.getFechaIngreso());
        empleado.setTipoContrato(empleadoDTO.getTipoContrato());
        empleado.setTipoJornada(empleadoDTO.getTipoJornada());
        empleado.setSalarioDiario(empleadoDTO.getSalarioDiario());
        empleado.setSalarioMensual(empleadoDTO.getSalarioDiario().multiply(new BigDecimal("30")));
        empleado.setNumeroCuenta(empleadoDTO.getNumeroCuenta());
        empleado.setBanco(empleadoDTO.getBanco());
        empleado.setDireccion(empleadoDTO.getDireccion());
        empleado.setUpdatedBy(usuarioNombre);

        empleado = empleadoRepository.save(empleado);
        return mapToDTO(empleado);
    }

    // ========== DESACTIVAR EMPLEADO ==========
    public EmpleadoDTO desactivarEmpleado(Long id, LocalDate fechaBaja, String motivo, Long usuarioId, String usuarioNombre) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con ID: " + id));

        empleado.setActivo(false);
        empleado.setFechaBaja(fechaBaja != null ? fechaBaja : LocalDate.now());
        empleado.setUpdatedBy(usuarioNombre);

        empleado = empleadoRepository.save(empleado);
        return mapToDTO(empleado);
    }

    // ========== REACTIVAR EMPLEADO ==========
    public EmpleadoDTO reactivarEmpleado(Long id, Long usuarioId, String usuarioNombre) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con ID: " + id));

        empleado.setActivo(true);
        empleado.setFechaBaja(null);
        empleado.setUpdatedBy(usuarioNombre);

        empleado = empleadoRepository.save(empleado);
        return mapToDTO(empleado);
    }

    // ========== LISTAR EMPLEADOS ==========
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> listarEmpleados() {
        return empleadoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmpleadoDTO> listarEmpleadosActivos() {
        return empleadoRepository.findEmpleadosActivos().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ========== 🆕 OBTENER SOLO DESPACHADORES ==========
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> listarDespachadores() {
        return empleadoRepository.findDespachadores().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ========== 🆕 OBTENER SOLO SUPERVISORES ==========
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> listarSupervisores() {
        return empleadoRepository.findSupervisores().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ========== OBTENER EMPLEADO POR ID ==========
    @Transactional(readOnly = true)
    public EmpleadoDTO obtenerEmpleado(Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con ID: " + id));
        return mapToDTO(empleado);
    }

    // ========== OBTENER EMPLEADO POR RFC ==========
    @Transactional(readOnly = true)
    public EmpleadoDTO obtenerEmpleadoPorRFC(String rfc) {
        Empleado empleado = empleadoRepository.findByRfc(rfc)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con RFC: " + rfc));
        return mapToDTO(empleado);
    }

    // ========== LISTAR POR DEPARTAMENTO ==========
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> listarEmpleadosPorDepartamento(Long departamentoId) {
        return empleadoRepository.findByActivoTrueAndDepartamentoId(departamentoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ========== LISTAR POR PUESTO ==========
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> listarEmpleadosPorPuesto(Long puestoId) {
        return empleadoRepository.findByActivoTrueAndPuestoId(puestoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ========== MÉTODOS PRIVADOS ==========
    private String generarCodigoEmpleado() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long secuencial = empleadoRepository.count() + 1;
        return String.format("EMP-%s-%04d", fecha, secuencial);
    }

    private EmpleadoDTO mapToDTO(Empleado empleado) {
        // Determinar rol basado en el nombre del puesto
        String rol = "ADMINISTRATIVO";
        String rolLabel = "📋 Administrativo";

        if (empleado.getPuesto() != null) {
            String puestoNombre = empleado.getPuesto().getNombre().toLowerCase();
            if (puestoNombre.contains("despachador")) {
                rol = "DESPACHADOR";
                rolLabel = "⛽ Despachador";
            } else if (puestoNombre.contains("supervisor")) {
                rol = "SUPERVISOR";
                rolLabel = "✅ Supervisor";
            } else if (puestoNombre.contains("gerente")) {
                rol = "GERENTE";
                rolLabel = "👔 Gerente";
            }
        }

        return EmpleadoDTO.builder()
                .id(empleado.getId())
                .codigoEmpleado(empleado.getCodigoEmpleado())
                .nombre(empleado.getNombre())
                .apellidoPaterno(empleado.getApellidoPaterno())
                .apellidoMaterno(empleado.getApellidoMaterno())
                .rfc(empleado.getRfc())
                .curp(empleado.getCurp())
                .nss(empleado.getNss())
                .email(empleado.getEmail())
                .telefono(empleado.getTelefono())
                .celular(empleado.getCelular())
                .fechaNacimiento(empleado.getFechaNacimiento())
                .fechaIngreso(empleado.getFechaIngreso())
                .fechaBaja(empleado.getFechaBaja())
                .activo(empleado.getActivo())
                .puestoId(empleado.getPuesto() != null ? empleado.getPuesto().getId() : null)
                .puestoNombre(empleado.getPuesto() != null ? empleado.getPuesto().getNombre() : null)
                .departamentoId(empleado.getDepartamento() != null ? empleado.getDepartamento().getId() : null)
                .departamentoNombre(empleado.getDepartamento() != null ? empleado.getDepartamento().getNombre() : null)
                .tipoContrato(empleado.getTipoContrato())
                .tipoJornada(empleado.getTipoJornada())
                .salarioDiario(empleado.getSalarioDiario())
                .salarioMensual(empleado.getSalarioMensual())
                .numeroCuenta(empleado.getNumeroCuenta())
                .banco(empleado.getBanco())
                .direccion(empleado.getDireccion())
                .rol(rol)
                .rolLabel(rolLabel)
                .createdAt(empleado.getCreatedAt())
                .updatedAt(empleado.getUpdatedAt())
                .build();
    }
}