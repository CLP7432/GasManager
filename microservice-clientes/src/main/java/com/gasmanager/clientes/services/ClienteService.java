package com.gasmanager.clientes.services;

import com.gasmanager.clientes.dto.ClienteDTO;
import com.gasmanager.clientes.entities.Cliente;
import com.gasmanager.clientes.exceptions.ResourceNotFoundException;
import com.gasmanager.clientes.exceptions.ValidationException;
import com.gasmanager.clientes.repositories.ClienteRepository;
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
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteDTO crearCliente(ClienteDTO clienteDTO, Long usuarioId, String usuarioNombre) {
        if (clienteDTO.getRfc() != null && clienteRepository.existsByRfc(clienteDTO.getRfc())) {
            throw new ValidationException("Ya existe un cliente con el RFC: " + clienteDTO.getRfc());
        }

        if (clienteDTO.getEmail() != null && clienteRepository.existsByEmail(clienteDTO.getEmail())) {
            throw new ValidationException("Ya existe un cliente con el email: " + clienteDTO.getEmail());
        }

        if (clienteDTO.getRazonSocial() != null && !clienteDTO.getRazonSocial().isEmpty()) {
            List<Cliente> existentes = clienteRepository.findByRazonSocialContainingIgnoreCase(clienteDTO.getRazonSocial());
            for (Cliente existente : existentes) {
                if (existente.getRazonSocial() != null && existente.getRazonSocial().equalsIgnoreCase(clienteDTO.getRazonSocial())) {
                    throw new ValidationException("Ya existe un cliente con la razón social: " + clienteDTO.getRazonSocial());
                }
            }
        }

        Cliente cliente = Cliente.builder()
                .codigoCliente(generarCodigoCliente())
                .tipoPersona(clienteDTO.getTipoPersona())
                .razonSocial(clienteDTO.getRazonSocial())
                .nombreComercial(clienteDTO.getNombreComercial())
                .rfc(clienteDTO.getRfc())
                .curp(clienteDTO.getCurp())
                .email(clienteDTO.getEmail())
                .telefono(clienteDTO.getTelefono())
                .celular(clienteDTO.getCelular())
                .calle(clienteDTO.getCalle())
                .numeroExterior(clienteDTO.getNumeroExterior())
                .numeroInterior(clienteDTO.getNumeroInterior())
                .colonia(clienteDTO.getColonia())
                .ciudad(clienteDTO.getCiudad())
                .estado(clienteDTO.getEstado())
                .codigoPostal(clienteDTO.getCodigoPostal())
                .activo(true)
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        cliente = clienteRepository.save(cliente);
        return mapToDTO(cliente);
    }

    public ClienteDTO actualizarCliente(Long id, ClienteDTO clienteDTO, Long usuarioId, String usuarioNombre) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));

        if (clienteDTO.getRazonSocial() != null && !clienteDTO.getRazonSocial().isEmpty()) {
            List<Cliente> existentes = clienteRepository.findByRazonSocialContainingIgnoreCase(clienteDTO.getRazonSocial());
            for (Cliente existente : existentes) {
                if (!existente.getId().equals(id) &&
                        existente.getRazonSocial() != null &&
                        existente.getRazonSocial().equalsIgnoreCase(clienteDTO.getRazonSocial())) {
                    throw new ValidationException("Ya existe otro cliente con la razón social: " + clienteDTO.getRazonSocial());
                }
            }
        }

        cliente.setTipoPersona(clienteDTO.getTipoPersona());
        cliente.setRazonSocial(clienteDTO.getRazonSocial());
        cliente.setNombreComercial(clienteDTO.getNombreComercial());
        cliente.setRfc(clienteDTO.getRfc());
        cliente.setCurp(clienteDTO.getCurp());
        cliente.setEmail(clienteDTO.getEmail());
        cliente.setTelefono(clienteDTO.getTelefono());
        cliente.setCelular(clienteDTO.getCelular());
        cliente.setCalle(clienteDTO.getCalle());
        cliente.setNumeroExterior(clienteDTO.getNumeroExterior());
        cliente.setNumeroInterior(clienteDTO.getNumeroInterior());
        cliente.setColonia(clienteDTO.getColonia());
        cliente.setCiudad(clienteDTO.getCiudad());
        cliente.setEstado(clienteDTO.getEstado());
        cliente.setCodigoPostal(clienteDTO.getCodigoPostal());
        cliente.setUpdatedBy(usuarioNombre);

        cliente = clienteRepository.save(cliente);
        return mapToDTO(cliente);
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> listarClientes() {
        return clienteRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> listarClientesActivos() {
        return clienteRepository.findByActivoTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClienteDTO obtenerCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        return mapToDTO(cliente);
    }

    @Transactional(readOnly = true)
    public ClienteDTO obtenerClientePorRFC(String rfc) {
        Cliente cliente = clienteRepository.findByRfc(rfc)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con RFC: " + rfc));
        return mapToDTO(cliente);
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> buscarPorRazonSocial(String razonSocial) {
        return clienteRepository.findByRazonSocialContainingIgnoreCase(razonSocial).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ClienteDTO toggleActivo(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));

        cliente.setActivo(!cliente.getActivo());
        cliente = clienteRepository.save(cliente);
        return mapToDTO(cliente);
    }

    public void eliminarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        clienteRepository.delete(cliente);
    }

    private String generarCodigoCliente() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long secuencial = clienteRepository.count() + 1;
        return String.format("CLI-%s-%04d", fecha, secuencial);
    }

    private ClienteDTO mapToDTO(Cliente cliente) {
        return ClienteDTO.builder()
                .id(cliente.getId())
                .codigoCliente(cliente.getCodigoCliente())
                .tipoPersona(cliente.getTipoPersona())
                .razonSocial(cliente.getRazonSocial())
                .nombreComercial(cliente.getNombreComercial())
                .rfc(cliente.getRfc())
                .curp(cliente.getCurp())
                .email(cliente.getEmail())
                .telefono(cliente.getTelefono())
                .celular(cliente.getCelular())
                .calle(cliente.getCalle())
                .numeroExterior(cliente.getNumeroExterior())
                .numeroInterior(cliente.getNumeroInterior())
                .colonia(cliente.getColonia())
                .ciudad(cliente.getCiudad())
                .estado(cliente.getEstado())
                .codigoPostal(cliente.getCodigoPostal())
                .activo(cliente.getActivo())
                .createdAt(cliente.getCreatedAt())
                .updatedAt(cliente.getUpdatedAt())
                .build();
    }
}