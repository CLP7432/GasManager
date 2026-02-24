package com.gasmanager.users.services;

import com.gasmanager.users.entities.core.SesionUsuario;
import com.gasmanager.users.repositories.SesionUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SesionUsuarioService {

    private final SesionUsuarioRepository sesionRepository;

    public SesionUsuario iniciarSesion(Integer idUsuario, String token){
        SesionUsuario sesion = new SesionUsuario();
        sesion.setIdUsuario(idUsuario);
        sesion.setToken(token);
        sesion.setFechaInicio(LocalDateTime.now());
        sesion.setFechaExpiracion(LocalDateTime.now().plusHours(2));
        sesion.setActivo(true);
        return sesionRepository.save(sesion);
    }

    public void cerrarSesion(String token){
        sesionRepository.findByToken(token).ifPresent(sesion ->{
            sesion.setActivo(false);
            sesionRepository.save(sesion);
        });
    }
    public boolean validarToken(String token) {
        System.out.println("=== SESION USUARIO SERVICE - Validando token: " + token);
        boolean activo = sesionRepository.findByToken(token)
                .map(sesion -> {
                    System.out.println("=== Sesión encontrada: " + sesion.isActivo());
                    return sesion.isActivo();
                })
                .orElse(false);
        System.out.println("=== Resultado validación: " + activo);
        return activo;
    }



}
