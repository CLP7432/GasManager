package com.gasmanager.users.controllers;

import com.gasmanager.users.entities.security.Permiso;
import com.gasmanager.users.entities.security.Rol;
import com.gasmanager.users.services.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolController {

    private final RolService rolService;

    //Crear un rol
    @PostMapping
    public ResponseEntity<Rol> crearRol (@RequestBody Rol rol){
        return ResponseEntity.ok(rolService.crearRol(rol));
    }
    //Listar roles
    @GetMapping
    public ResponseEntity<List<Rol>> listarRoles(){
        return ResponseEntity.ok(rolService.listarRoles());
    }

    //asignar permiso a un rol
    @PostMapping("/{idRol}/permisos")
    public ResponseEntity<Rol> asignarPermiso(
            @PathVariable Integer idRol,
            @RequestBody Permiso permiso){
        Rol rolActualizado = rolService.asignarPermiso(idRol, permiso);

        return ResponseEntity.ok(rolActualizado);
    }
    //remover el permiso de un rol
    @DeleteMapping("/{idRol}/permisos")
    public ResponseEntity<Rol> removerPermiso(
            @PathVariable Integer idRol,
            @RequestBody Permiso permiso) {

        Rol rolActualizado = rolService.removerPermiso(idRol, permiso);
        return ResponseEntity.ok(rolActualizado);
    }

}
