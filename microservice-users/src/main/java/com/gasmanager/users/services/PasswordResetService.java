package com.gasmanager.users.services;

import com.gasmanager.users.entities.core.PasswordResetToken;
import com.gasmanager.users.entities.core.Usuario;
import com.gasmanager.users.entities.security.TipoAccion;
import com.gasmanager.users.repositories.AuditoriaAccionRepository;
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
    private final AuditoriaAccionRepository auditoriaRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    // 1. Solicitar restablecimiento de la contraseña
    public boolean solicitarResetPassword(String correo, String baseUrl) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isEmpty()) {
            return false;
        }
        Usuario usuario = usuarioOpt.get();

        //Eliminamos tokens previos
        tokenRepository.deleteByUsuario(usuario);

        //crear un nuevo token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, usuario);
        tokenRepository.save(resetToken);

        //Enviar correo
        enviarCorreoReset(usuario, token, baseUrl);

        //Registrar a la auditoria
        registrarAuditoria(
                usuario.getIdUsuario(),
                TipoAccion.ACTUALIZAR,
                "Solicitud de restablecimiento de contraseña",
                "Seguridad",
                "Web",
                null,
                "{\"tokenGenerado\":\"" + token + "\",\"correoEnviado\":\"" + correo + "\"}"
        );
        return true;
    }

    // 2. Validar token
    public boolean validarToken(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            return false;
        }
        PasswordResetToken resetToken = tokenOpt.get();
        return resetToken.esValido();
    }

    // 3. Restablecer la contraseña
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
        usuario.setBloqueado(false); //Desbloquear usuario
        usuario.setIntentosFallidos(0);
        usuarioRepository.save(usuario);

        //Marcar token como usado
        resetToken.setUsado(true);
        resetToken.setFechaExpiracion(LocalDateTime.now());
        tokenRepository.save(resetToken);

        //registramos a la auditoria
        registrarAuditoria(
                usuario.getIdUsuario(),
                TipoAccion.ACTUALIZAR,
                "Contraseña restablecida exitosamente",
                "Seguridad",
                "Web",
                null,
                "{\"usuarioDesbloqueado\":true,\"intentosReseteados\":true}"
        );
        return true;
    }

    //4. Enviamos correo (siimplificado)
    private void enviarCorreoReset(Usuario usuario, String token, String baseUrl) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(usuario.getCorreo());
            message.setSubject("GasManager - Restablecimiento de Contraseña");

            String resetUrl = baseUrl + "/reset-password?token=" + token;

            String cuerpo = String.format(
                    "Hola %s, \n\n" +
                            "Has solicitado restablecer tu contraseña en GasManager.\n\n" +
                            "Para crear una nueva contraseña, has clic en el siguiente enlace:\n" +
                            "%s\n\n" +
                            "Este enlace es valido por 24 horas.\n\n" +
                            "Saludos,\n Equipo GasManager",
                    usuario.getNombre(),
                    resetUrl
            );
            message.setText(cuerpo);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error enviando correo: " + e.getMessage());
        }
    }
    //5. Metodo auxiliar para la auditoria
    private void registrarAuditoria(
            Integer idUsuario, TipoAccion accion, String descripcion,
            String modulo, String origen, String datosAnt, String datosNue) {

        // Copia el método de auditoría de UsuarioService o hazlo público
        System.out.println("Auditoría: " + descripcion);
        // Implementa según tu método existente
    }
}
