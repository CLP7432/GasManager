package com.gasmanager.users.controllers;

import com.gasmanager.users.entities.security.Permiso;
import com.gasmanager.users.services.PermisoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/permisos")
@RequiredArgsConstructor
public class PermisoController {

    private final PermisoService permisoService;

    //creamos permisos nuevo
    @PostMapping
    public Permiso crearPermiso(@RequestBody Permiso permiso) {
        return permisoService.crearPermiso(permiso);
    }
    //Listar todos los permisos
    @GetMapping
    public List<Permiso> listarPermisos(){
        return permisoService.listarPermisos();
    }
    //Buscar permiso por codigo
    @GetMapping("/{codigoPermiso}")
    public Permiso buscarPorCodigo(@PathVariable String codigoPermiso) {
        return permisoService.buscarPorCodigo(codigoPermiso);
    }
    //eliminar permiso por ID
    @DeleteMapping("/{idPermiso}")
    public void eliminarPermiso(@PathVariable Integer idPermiso){
        permisoService.eliminarPermiso(idPermiso);
    }
}
