package com.gasmanager.clientes.services;

import com.gasmanager.clientes.dto.AbonoCreditoDTO;
import com.gasmanager.clientes.dto.CreditoDTO;
import com.gasmanager.clientes.entities.AbonoCredito;
import com.gasmanager.clientes.entities.Cliente;
import com.gasmanager.clientes.entities.Credito;
import com.gasmanager.clientes.enums.EstadoCredito;
import com.gasmanager.clientes.exceptions.ResourceNotFoundException;
import com.gasmanager.clientes.exceptions.ValidationException;
import com.gasmanager.clientes.repositories.AbonoCreditoRepository;
import com.gasmanager.clientes.repositories.ClienteRepository;
import com.gasmanager.clientes.repositories.CreditoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CreditoService {

    private final CreditoRepository creditoRepository;
    private final ClienteRepository clienteRepository;
    private final AbonoCreditoRepository abonoCreditoRepository;
    private final CalculoInteresService calculoInteresService;

    // ========== CREAR CRÉDITO ==========
    public CreditoDTO crearCredito(CreditoDTO creditoDTO, Long usuarioId, String usuarioNombre) {
        Cliente cliente = clienteRepository.findById(creditoDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + creditoDTO.getClienteId()));

        if (!cliente.getActivo()) {
            throw new ValidationException("El cliente está inactivo. No se puede crear un crédito.");
        }

        if (creditoDTO.getMontoTotal() == null || creditoDTO.getMontoTotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("El monto total debe ser mayor a 0");
        }

        // Calcular fecha de vencimiento
        LocalDate fechaVencimiento = null;
        if (creditoDTO.getFechaInicio() != null && creditoDTO.getPlazoMeses() != null && creditoDTO.getPlazoMeses() > 0) {
            fechaVencimiento = creditoDTO.getFechaInicio().plusMonths(creditoDTO.getPlazoMeses());
        }

        // El saldo pendiente es SOLO el capital (sin intereses)
        BigDecimal saldoPendiente = creditoDTO.getMontoTotal();
        if (creditoDTO.getMontoPagado() != null && creditoDTO.getMontoPagado().compareTo(BigDecimal.ZERO) > 0) {
            saldoPendiente = saldoPendiente.subtract(creditoDTO.getMontoPagado());
        }

        // El interés NO se suma al saldo pendiente al crear
        BigDecimal montoInteres = BigDecimal.ZERO;

        Credito credito = Credito.builder()
                .folioCredito(generarFolioCredito())
                .cliente(cliente)
                .montoTotal(creditoDTO.getMontoTotal())
                .montoPagado(creditoDTO.getMontoPagado() != null ? creditoDTO.getMontoPagado() : BigDecimal.ZERO)
                .saldoPendiente(saldoPendiente)
                .plazoMeses(creditoDTO.getPlazoMeses())
                .tasaInteres(creditoDTO.getTasaInteres() != null ? creditoDTO.getTasaInteres() : BigDecimal.ZERO)
                .tasaMora(creditoDTO.getTasaMora() != null ? creditoDTO.getTasaMora() : new BigDecimal("1.00"))
                .montoInteres(BigDecimal.ZERO)
                .montoInteresAcumulado(BigDecimal.ZERO)
                .montoMoraAcumulado(BigDecimal.ZERO)
                .fechaInicio(creditoDTO.getFechaInicio())
                .fechaVencimiento(fechaVencimiento)
                .fechaUltimoCalculoInteres(creditoDTO.getFechaInicio())
                .diasMora(0)
                .estado(creditoDTO.getEstado() != null ? creditoDTO.getEstado() : EstadoCredito.ACTIVO)
                .metodoPago(creditoDTO.getMetodoPago())
                .diaPago(creditoDTO.getDiaPago())
                .notas(creditoDTO.getNotas())
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        credito = creditoRepository.save(credito);

        log.info("Credito creado: {} - Cliente: {} - Monto: ${}",
                credito.getFolioCredito(),
                cliente.getRazonSocial(),
                credito.getMontoTotal());

        return mapToDTO(credito);
    }

    // ========== ACTUALIZAR CRÉDITO ==========
    public CreditoDTO actualizarCredito(Long id, CreditoDTO creditoDTO, Long usuarioId, String usuarioNombre) {
        Credito credito = creditoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crédito no encontrado con ID: " + id));

        if (credito.getEstado() == EstadoCredito.PAGADO) {
            throw new ValidationException("No se puede modificar un crédito pagado");
        }

        if (credito.getEstado() == EstadoCredito.CANCELADO) {
            throw new ValidationException("No se puede modificar un crédito cancelado");
        }

        if (creditoDTO.getPlazoMeses() != null) {
            credito.setPlazoMeses(creditoDTO.getPlazoMeses());
            if (credito.getFechaInicio() != null) {
                credito.setFechaVencimiento(credito.getFechaInicio().plusMonths(creditoDTO.getPlazoMeses()));
            }
        }

        if (creditoDTO.getTasaInteres() != null) {
            credito.setTasaInteres(creditoDTO.getTasaInteres());
        }

        if (creditoDTO.getTasaMora() != null) {
            credito.setTasaMora(creditoDTO.getTasaMora());
        }

        if (creditoDTO.getMetodoPago() != null) {
            credito.setMetodoPago(creditoDTO.getMetodoPago());
        }

        if (creditoDTO.getDiaPago() != null) {
            credito.setDiaPago(creditoDTO.getDiaPago());
        }

        if (creditoDTO.getNotas() != null) {
            credito.setNotas(creditoDTO.getNotas());
        }

        if (creditoDTO.getEstado() != null) {
            credito.setEstado(creditoDTO.getEstado());
        }

        credito.setUpdatedBy(usuarioNombre);
        credito = creditoRepository.save(credito);

        return mapToDTO(credito);
    }

    // ========== REGISTRAR ABONO ==========
    @Transactional
    public CreditoDTO registrarAbono(Long creditoId, AbonoCreditoDTO abonoDTO, Long usuarioId, String usuarioNombre) {
        Credito credito = creditoRepository.findById(creditoId)
                .orElseThrow(() -> new ResourceNotFoundException("Crédito no encontrado con ID: " + creditoId));

        if (credito.getEstado() == EstadoCredito.PAGADO) {
            throw new ValidationException("El crédito ya está pagado");
        }

        if (credito.getEstado() == EstadoCredito.CANCELADO) {
            throw new ValidationException("No se pueden registrar abonos en un crédito cancelado");
        }

        if (abonoDTO.getMonto() == null || abonoDTO.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("El monto del abono debe ser mayor a 0");
        }

        // Validar que el abono no supere el saldo pendiente
        if (abonoDTO.getMonto().compareTo(credito.getSaldoPendiente()) > 0) {
            throw new ValidationException("El monto del abono no puede exceder el saldo pendiente");
        }

        // IMPORTANTE: Calcular intereses antes de registrar el abono
        credito = calculoInteresService.procesarCalculoIntereses(credito);

        // Crear el abono
        AbonoCredito abono = AbonoCredito.builder()
                .folioAbono(generarFolioAbono())
                .credito(credito)
                .monto(abonoDTO.getMonto())
                .fechaAbono(abonoDTO.getFechaAbono() != null ? abonoDTO.getFechaAbono() : LocalDate.now())
                .metodoPago(abonoDTO.getMetodoPago())
                .referenciaPago(abonoDTO.getReferenciaPago())
                .notas(abonoDTO.getNotas())
                .createdBy(usuarioNombre)
                .updatedBy(usuarioNombre)
                .build();

        abono = abonoCreditoRepository.save(abono);

        // Actualizar el crédito
        BigDecimal nuevoMontoPagado = credito.getMontoPagado().add(abono.getMonto());
        BigDecimal nuevoSaldoPendiente = credito.getSaldoPendiente().subtract(abono.getMonto());

        credito.setMontoPagado(nuevoMontoPagado);
        credito.setSaldoPendiente(nuevoSaldoPendiente);
        credito.setFechaUltimoPago(abono.getFechaAbono());
        credito.setUpdatedBy(usuarioNombre);

        // Verificar si el crédito está pagado
        if (nuevoSaldoPendiente.compareTo(BigDecimal.ZERO) <= 0) {
            credito.setEstado(EstadoCredito.PAGADO);
            log.info("Credito {} pagado completamente", credito.getFolioCredito());
        }

        credito = creditoRepository.save(credito);

        log.info("Abono registrado: {} - ${} - Saldo restante: ${}",
                credito.getFolioCredito(),
                abono.getMonto(),
                credito.getSaldoPendiente());

        return mapToDTO(credito);
    }

    // ========== CANCELAR CRÉDITO ==========
    public CreditoDTO cancelarCredito(Long id, String motivo, Long usuarioId, String usuarioNombre) {
        Credito credito = creditoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crédito no encontrado con ID: " + id));

        if (credito.getEstado() == EstadoCredito.PAGADO) {
            throw new ValidationException("No se puede cancelar un crédito pagado");
        }

        credito.setEstado(EstadoCredito.CANCELADO);
        if (motivo != null && !motivo.isEmpty()) {
            String notasActuales = credito.getNotas() != null ? credito.getNotas() : "";
            credito.setNotas(notasActuales + "\n[CANCELADO] Motivo: " + motivo);
        }
        credito.setUpdatedBy(usuarioNombre);
        credito = creditoRepository.save(credito);

        log.info("Credito {} cancelado", credito.getFolioCredito());

        return mapToDTO(credito);
    }

    // ========== LISTAR CRÉDITOS ==========
    @Transactional(readOnly = true)
    public List<CreditoDTO> listarCreditos() {
        return creditoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CreditoDTO obtenerCredito(Long id) {
        Credito credito = creditoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crédito no encontrado con ID: " + id));

        // Calcular intereses antes de mostrar (para tener datos actualizados)
        credito = calculoInteresService.procesarCalculoIntereses(credito);

        return mapToDTO(credito);
    }

    @Transactional(readOnly = true)
    public List<CreditoDTO> listarCreditosPorCliente(Long clienteId) {
        return creditoRepository.findByClienteId(clienteId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CreditoDTO> listarCreditosPorEstado(EstadoCredito estado) {
        return creditoRepository.findByEstado(estado).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CreditoDTO> listarCreditosActivosConSaldo() {
        return creditoRepository.findCreditosActivosConSaldo().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CreditoDTO> listarCreditosConSaldoPendiente() {
        return creditoRepository.findAll().stream()
                .filter(c -> (c.getEstado() == EstadoCredito.ACTIVO || c.getEstado() == EstadoCredito.VENCIDO)
                        && c.getSaldoPendiente() != null
                        && c.getSaldoPendiente().compareTo(BigDecimal.ZERO) > 0)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CreditoDTO> listarCreditosVencidos() {
        // Primero actualizar los créditos vencidos
        actualizarCreditosVencidos();
        return creditoRepository.findByEstado(EstadoCredito.VENCIDO).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AbonoCreditoDTO> listarAbonosPorCredito(Long creditoId) {
        return abonoCreditoRepository.findByCreditoIdOrderByFechaAbonoDesc(creditoId).stream()
                .map(this::mapAbonoToDTO)
                .collect(Collectors.toList());
    }

    // ========== ACTUALIZAR CRÉDITOS VENCIDOS ==========
    @Transactional
    public int actualizarCreditosVencidos() {
        return creditoRepository.updateVencidosToVencido();
    }

    // ========== MÉTODOS PRIVADOS ==========
    private String generarFolioCredito() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long secuencial = creditoRepository.count() + 1;
        return String.format("CRED-%s-%04d", fecha, secuencial);
    }

    private String generarFolioAbono() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long secuencial = abonoCreditoRepository.count() + 1;
        return String.format("ABONO-%s-%04d", fecha, secuencial);
    }

    // ========== MAPPING A DTO ==========
    private CreditoDTO mapToDTO(Credito credito) {
        // Calcular el total con intereses y mora (solo para UI)
        BigDecimal totalConIntereses = credito.getMontoTotal()
                .add(credito.getMontoInteresAcumulado() != null ? credito.getMontoInteresAcumulado() : BigDecimal.ZERO)
                .add(credito.getMontoMoraAcumulado() != null ? credito.getMontoMoraAcumulado() : BigDecimal.ZERO);

        return CreditoDTO.builder()
                .id(credito.getId())
                .folioCredito(credito.getFolioCredito())
                .clienteId(credito.getCliente().getId())
                .clienteNombre(credito.getCliente().getRazonSocial() != null ?
                        credito.getCliente().getRazonSocial() : credito.getCliente().getNombreComercial())
                .montoTotal(credito.getMontoTotal())
                .montoPagado(credito.getMontoPagado())
                .saldoPendiente(credito.getSaldoPendiente())
                .plazoMeses(credito.getPlazoMeses())
                .tasaInteres(credito.getTasaInteres())
                .tasaMora(credito.getTasaMora())
                .montoInteres(credito.getMontoInteres())
                .montoInteresAcumulado(credito.getMontoInteresAcumulado())
                .montoMoraAcumulado(credito.getMontoMoraAcumulado())
                .totalConIntereses(totalConIntereses)
                .diasMora(credito.getDiasMora())
                .fechaInicio(credito.getFechaInicio())
                .fechaVencimiento(credito.getFechaVencimiento())
                .fechaUltimoPago(credito.getFechaUltimoPago())
                .estado(credito.getEstado())
                .metodoPago(credito.getMetodoPago())
                .diaPago(credito.getDiaPago())
                .notas(credito.getNotas())
                .abonos(credito.getAbonos() != null ?
                        credito.getAbonos().stream().map(this::mapAbonoToDTO).collect(Collectors.toList()) : null)
                .createdAt(credito.getCreatedAt())
                .updatedAt(credito.getUpdatedAt())
                .build();
    }

    private AbonoCreditoDTO mapAbonoToDTO(AbonoCredito abono) {
        return AbonoCreditoDTO.builder()
                .id(abono.getId())
                .folioAbono(abono.getFolioAbono())
                .creditoId(abono.getCredito().getId())
                .creditoFolio(abono.getCredito().getFolioCredito())
                .monto(abono.getMonto())
                .fechaAbono(abono.getFechaAbono())
                .metodoPago(abono.getMetodoPago())
                .referenciaPago(abono.getReferenciaPago())
                .notas(abono.getNotas())
                .createdAt(abono.getCreatedAt())
                .updatedAt(abono.getUpdatedAt())
                .build();
    }
}