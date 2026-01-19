package com.gasmanager.users.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtTokenProvider {

    //Clave secreta para firmar los tokens
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    //Duracion del token (1 hora)
    private final long expirationMillis = 60 * 60 * 1000;

    //Generar token con claims personalizados
    public String generateToken(Integer idUsuario, String correo, String rol){
       Instant now = Instant.now();

        return Jwts.builder()
                .setSubject(correo)
                .claim("idUsuario", idUsuario)
                .claim("rol", rol)
                .setIssuedAt(Date.from(now))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(key)
                .compact();
    }
    public Jws<Claims> validate(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }

}


