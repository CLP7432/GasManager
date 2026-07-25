package com.gasmanager.ventas.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class DispensarioCreacionDTO {
    private String numero;
    private String nombre;
    private String ubicacion;
    private String estado;
    private Boolean tieneDosCaras;
    private Boolean activo;
    private List<CaraCreacionDTO> caras;

    @Data
    public static class CaraCreacionDTO {
        private String codigo;
        private String nombre;
        private Boolean activo;
        private List<MangueraCreacionDTO> mangueras;
    }

    @Data
    public static class MangueraCreacionDTO {
        private String codigo;
        private String nombre;
        private String tipoCombustible;
        private Long combustibleId;
        private BigDecimal lecturaActual;
        private Boolean activo;
    }
}