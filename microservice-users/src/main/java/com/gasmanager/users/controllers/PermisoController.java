package com.gasmanager.users.controllers;

import com.gasmanager.users.entities.security.Permiso;
import com.gasmanager.users.services.PermisoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/permisos")
@RequiredArgsConstructor
public class PermisoController {

    private final PermisoService permisoService;

    @PostMapping
    public Permiso crearPermiso(@RequestBody Permiso permiso){
        return permisoService.crearPermiso(permiso);
    }

    @GetMapping
    public List<Permiso> listarPermisos(){
        return permisoService.listarPermisos();
    }

    @GetMapping("/codigo/{codigoPermiso}")
    public Permiso buscarPorCodigo(@PathVariable String codigoPermiso){
        return permisoService.buscarPorCodigo(codigoPermiso);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Permiso> actualizarPermiso(@PathVariable Integer id, @RequestBody Permiso permiso){
        try{
            return ResponseEntity.ok(permisoService.actualizarPermiso(id, permiso));
        }catch (IllegalArgumentException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPermiso(@PathVariable Integer id){
        if(permisoService.eliminarPermiso(id)){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Permiso> obtenerPorId(@PathVariable Integer id){
        return permisoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
