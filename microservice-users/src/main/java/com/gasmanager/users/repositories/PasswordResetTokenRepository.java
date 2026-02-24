package com.gasmanager.users.repositories;

import com.gasmanager.users.entities.core.PasswordResetToken;
import com.gasmanager.users.entities.core.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUsuario(Usuario usuario);

    void deleteByUsuario(Usuario usuario);

    boolean existsByTokenAndUsadoFalse(String token);
}
