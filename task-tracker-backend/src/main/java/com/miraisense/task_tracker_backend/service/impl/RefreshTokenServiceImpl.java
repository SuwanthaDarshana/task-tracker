package com.miraisense.task_tracker_backend.service.impl;

import com.miraisense.task_tracker_backend.entity.RefreshToken;
import com.miraisense.task_tracker_backend.entity.User;
import com.miraisense.task_tracker_backend.exception.AuthenticationException;
import com.miraisense.task_tracker_backend.repository.RefreshTokenRepository;
import com.miraisense.task_tracker_backend.repository.UserRepository;
import com.miraisense.task_tracker_backend.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Value("${REFRESH_TOKEN_EXPIRATION:604800000}") // default 7 days in ms
    private long refreshTokenExpiration;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("User not found"));

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    @Transactional
    public RefreshToken verifyAndRotate(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new AuthenticationException("Invalid refresh token"));

        // If revoked, revoke ALL tokens for this user (possible token theft)
        if (refreshToken.isRevoked()) {
            refreshTokenRepository.revokeAllByUserId(refreshToken.getUser().getId());
            throw new AuthenticationException("Refresh token was revoked. All sessions have been invalidated.");
        }

        // If expired, delete and throw
        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new AuthenticationException("Refresh token expired. Please login again.");
        }

        // Rotate: revoke old token, issue new one
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        // Create new refresh token for the same user
        RefreshToken newRefreshToken = RefreshToken.builder()
                .user(refreshToken.getUser())
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(newRefreshToken);
    }

    @Override
    @Transactional
    public void revokeAllUserTokens(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Scheduled(cron = "0 0 3 * * *") // Run daily at 3 AM
    @Transactional
    public void purgeExpiredTokens() {
        refreshTokenRepository.deleteAllExpired(Instant.now());
        log.info("Purged expired refresh tokens");
    }
}
