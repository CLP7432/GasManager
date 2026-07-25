package com.gasmanager.users.services;

import com.gasmanager.users.entities.core.PasswordResetToken;
import com.gasmanager.users.entities.core.Usuario;
import com.gasmanager.users.repositories.PasswordResetTokenRepository;
import com.gasmanager.users.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    /// 1. Solicitar restablecimiento de contraseña
    public boolean solicitarResetPassword(String correo, String baseUrl) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isEmpty()) {
            return false; //Por seguridad no se revela el correo
        }
        Usuario usuario = usuarioOpt.get();

        //Elimina tokens previos del usuario
        tokenRepository.deleteByUsuario(usuario);

        //Crea un nuevo token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, usuario);
        tokenRepository.save(resetToken);

        //Enviar correo
        enviarCorreoReset(usuario, token, baseUrl);

        return true;
    }

    //2. Valdar Token
    public boolean validarToken(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            return false;
        }
        PasswordResetToken resetToken = tokenOpt.get();
        return resetToken.esValido();
    }

    //3. Restablecer contraseña
    public boolean resetPassword(String token, String nuevaPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            return false;
        }
        PasswordResetToken resetToken = tokenOpt.get();

        if (!resetToken.esValido()) {
            return false;
        }
        //Actualizar contraseña
        Usuario usuario = resetToken.getUsuario();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuario.setBloqueado(false);
        usuario.setIntentosFallidos(0);

        usuarioRepository.save(usuario);

        //Marcar token como usado
        resetToken.setUsado(true);
        resetToken.setFechaExpiracion(LocalDateTime.now());
        tokenRepository.save(resetToken);

        return true;
    }

    //Enviar correo de recuperacion
    private void enviarCorreoReset(Usuario usuario, String token, String baseUrl) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(usuario.getCorreo());
            message.setSubject("GasManager - Restablecimiento de Contraseña");

            String resetUrl = baseUrl + "/reset-password?token=" + token;

            String cuerpo = String.format(
                            "Hola %s,\n\n" +
                            "Has solicitado restablecer tu contraseña en GasManager.\n\n" +
                            "Para crear una nueva contraseña, haz clic en el siguiente enlace:\n" +
                            "%s\n\n" +
                            "Saludos, \nEquipo GasManager",
                    usuario.getNombre(),
                    resetUrl
            );
            message.setText(cuerpo);
            mailSender.send(message);
        }catch (Exception e){
            System.err.println("Error enviando correo:" + e.getMessage());
        }
    }
}























