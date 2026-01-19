package com.gasmanager.users.services;

import com.gasmanager.users.entities.security.Permiso;
import com.gasmanager.users.entities.security.Rol;
import com.gasmanager.users.repositories.PermisoRepository;
import com.gasmanager.users.repositories.RolRepository;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RolService {

    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;

    public Rol crearRol(Rol rol) {
        Optional<Rol> existente = rolRepository.findByNombreRol(rol.getNombreRol());
        if (existente.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El rol ya existe");
        }
        return rolRepository.save(rol);
    }
    //listar todos los roles
    public List<Rol> listarRoles(){
        return rolRepository.findAll();
    }
    //asignar permiso a un rol
    public Rol asignarPermiso(Integer idRol, @NotNull Permiso permiso) {
        Rol rol = rolRepository.findById(idRol)
                        .orElseThrow( () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));
        Permiso permisoBD = permisoRepository.findById(permiso.getIdPermiso())
                        .orElseThrow( () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permiso no encontrado"));

        if(rol.getPermisos().contains(permisoBD)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El permiso ya esta asignado a este rol");
        }
        rol.getPermisos().add(permisoBD);
        return rolRepository.save(rol);
    }

    public Rol removerPermiso(Integer idRol, Permiso permiso) {
        Rol rol = rolRepository.findById(idRol)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));
        Permiso permisoDB = permisoRepository.findById(permiso.getIdPermiso())
                        .orElseThrow( () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permiso no encontrado"));
        if(!rol.getPermisos().contains(permisoDB)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El permiso no esta asignado a este rol");
        }
        rol.getPermisos().remove(permisoDB);
        return rolRepository.save(rol);
    }
}
