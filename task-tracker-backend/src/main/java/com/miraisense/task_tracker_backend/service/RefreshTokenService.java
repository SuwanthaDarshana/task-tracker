package com.miraisense.task_tracker_backend.service;

import com.miraisense.task_tracker_backend.entity.RefreshToken;

import java.util.Optional;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(Long userId);

    RefreshToken verifyAndRotate(String token);

    void revokeAllUserTokens(Long userId);

    Optional<RefreshToken> findByToken(String token);
}
