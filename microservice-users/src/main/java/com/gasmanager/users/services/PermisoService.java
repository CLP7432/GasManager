package com.gasmanager.users.services;

import com.gasmanager.users.entities.security.Permiso;
import com.gasmanager.users.repositories.PermisoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermisoService {

    private final PermisoRepository permisoRepository;

    //Creamos un permiso nuevo
    public Permiso crearPermiso(Permiso permiso) {
        if(permisoRepository.existsByCodigoPermiso(permiso.getCodigoPermiso())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El permiso ya existe");
        }
        return permisoRepository.save(permiso);
    }
    //Listamos todos los permisos
    public List<Permiso> listarPermisos() {
        return permisoRepository.findAll();
    }
    //Buscamos permiso por codigo
    public Permiso buscarPorCodigo(String codigoPermiso) {
        return permisoRepository.findByCodigoPermiso(codigoPermiso)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permiso no encontrado"));
    }

    //Eliminamos el permiso
    public void eliminarPermiso(Integer idPermiso) {
        if(!permisoRepository.existsById(idPermiso)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Permiso no encontrado");
        }
        permisoRepository.deleteById(idPermiso);
    }
}
