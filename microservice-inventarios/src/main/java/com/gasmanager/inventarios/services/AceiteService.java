package com.gasmanager.inventarios.services;

import com.gasmanager.inventarios.dto.AceiteDTO;

import java.util.List;

public interface AceiteService {

    AceiteDTO crearAceite(
            AceiteDTO aceiteDTO,
            Long usuarioId,
            String usuarioNombre);

    AceiteDTO actualizarAceite(
            Long id,
            AceiteDTO aceiteDTO,
            Long usuarioId,
            String usuarioNombre);

    AceiteDTO actualizarStock(
            Long id,
            Integer nuevoStock,
            String motivo,
            Long usuarioId,
            String usuarioNombre);

    List<AceiteDTO> listarAceites();

    AceiteDTO obtenerAceite(Long id);

    List<AceiteDTO> listarActivos();

    List<AceiteDTO> listarConStockBajo();

    void eliminarAceite(Long id);

    AceiteDTO toggleActivo(Long id);

    boolean validarStockDisponible(Long id, Integer cantidadRequerida);
}
