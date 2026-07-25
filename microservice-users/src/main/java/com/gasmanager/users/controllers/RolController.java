package com.gasmanager.users.controllers;

import com.gasmanager.users.entities.security.Permiso;
import com.gasmanager.users.entities.security.Rol;
import com.gasmanager.users.services.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/roles")
@RequiredArgsConstructor
public class RolController {

    private final RolService rolService;

    @PostMapping
    public ResponseEntity<Rol> crearRol(@RequestBody Rol rol){
        return ResponseEntity.ok(rolService.crearRol(rol));
    }

    @GetMapping
    public ResponseEntity<List<Rol>> listarRoles(){
        return ResponseEntity.ok(rolService.listarRoles());
    }

    @PostMapping("/{idRol}/permisos")
    public ResponseEntity<Rol> asignarPermiso(@PathVariable Integer idRol, @RequestBody Permiso permiso){
        return ResponseEntity.ok(rolService.asignarPermiso(idRol, permiso));
    }

    @DeleteMapping("/{idRol}/permisos")
    public ResponseEntity<Rol> removerPermiso(@PathVariable Integer idRol, @RequestBody Permiso permiso){
        return ResponseEntity.ok(rolService.removerPermiso(idRol, permiso));
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Rol>> listarActivos(){
        return ResponseEntity.ok(rolService.listarRolesActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rol> obtenerPorId(@PathVariable Integer id){
        return rolService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rol> actualizarRol(@PathVariable Integer id, @RequestBody Rol rol){
        try{
            return ResponseEntity.ok(rolService.actualizarRol(id, rol));
        }catch (IllegalArgumentException e){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRol(@PathVariable Integer id){
        if(rolService.eliminarRol(id)){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}