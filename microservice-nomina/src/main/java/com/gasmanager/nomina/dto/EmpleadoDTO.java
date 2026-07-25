package com.gasmanager.nomina.dto;

import com.gasmanager.nomina.enums.TipoContrato;
import com.gasmanager.nomina.enums.TipoJornada;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoDTO {

    private Long id;
    private String codigoEmpleado;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    private String nombre;

    @NotBlank(message = "El apellido paterno es obligatorio")
    @Size(max = 50, message = "El apellido paterno no puede exceder 50 caracteres")
    private String apellidoPaterno;

    @Size(max = 50, message = "El apellido materno no puede exceder 50 caracteres")
    private String apellidoMaterno;

    @Pattern(regexp = "^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$", message = "RFC inválido")
    private String rfc;

    @Size(max = 18, message = "CURP inválida")
    private String curp;

    @Size(max = 20, message = "NSS inválido")
    private String nss;

    @Email(message = "Email inválido")
    private String email;

    @Size(max = 15, message = "Teléfono inválido")
    private String telefono;

    @Size(max = 15, message = "Celular inválido")
    private String celular;

    private LocalDate fechaNacimiento;

    @NotNull(message = "La fecha de ingreso es obligatoria")
    private LocalDate fechaIngreso;

    private LocalDate fechaBaja;
    private Boolean activo;

    private Long puestoId;
    private String puestoNombre;

    private Long departamentoId;
    private String departamentoNombre;

    private TipoContrato tipoContrato;
    private TipoJornada tipoJornada;

    @NotNull(message = "El salario diario es obligatorio")
    @DecimalMin(value = "0.01", message = "El salario diario debe ser mayor a 0")
    private BigDecimal salarioDiario;

    private BigDecimal salarioMensual;

    private String numeroCuenta;
    private String banco;
    private String direccion;

    // =====  CAMPOS PARA ROL Y DISPENSARIO =====
    private String rol;              // DESPACHADOR, SUPERVISOR, ADMINISTRATIVO, etc.
    private String rolLabel;         // Etiqueta amigable

    private Long dispensarioId;      // ID del dispensario (desde microservicio de Ventas)
    private String dispensarioNumero;
    private String dispensarioNombre;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}