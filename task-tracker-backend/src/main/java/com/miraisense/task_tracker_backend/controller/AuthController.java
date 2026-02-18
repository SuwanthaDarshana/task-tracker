package com.miraisense.task_tracker_backend.controller;

import com.miraisense.task_tracker_backend.dto.*;
import com.miraisense.task_tracker_backend.entity.RefreshToken;
import com.miraisense.task_tracker_backend.exception.AuthenticationException;
import com.miraisense.task_tracker_backend.security.JwtService;
import com.miraisense.task_tracker_backend.service.RefreshTokenService;
import com.miraisense.task_tracker_backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";

    @Value("${REFRESH_TOKEN_EXPIRATION:604800000}")
    private long refreshTokenExpiration;

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @PostMapping("/register")
    public ResponseEntity<StandardResponseDTO<UserResponseDTO>> register(@Valid @RequestBody UserRequestDTO request) {

        UserResponseDTO userResponseDTO = userService.register(request);
        return new ResponseEntity<>(
                StandardResponseDTO.<UserResponseDTO>builder()
                        .data(userResponseDTO)
                        .message("User registered successfully")
                        .statusCode(HttpStatus.CREATED.value())
                        .build(),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<StandardResponseDTO<AuthResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpServletResponse response) {

        AuthResponseDTO authResponseDTO = userService.login(request);

        // Create refresh token and set it as HttpOnly cookie
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(authResponseDTO.getUserId());
        addRefreshTokenCookie(response, refreshToken.getToken());

        return ResponseEntity.ok(
                StandardResponseDTO.<AuthResponseDTO>builder()
                        .data(authResponseDTO)
                        .message("Login successful")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<StandardResponseDTO<AuthResponseDTO>> refresh(HttpServletRequest request,
            HttpServletResponse response) {
        String refreshTokenValue = extractRefreshTokenFromCookies(request);

        if (refreshTokenValue == null) {
            throw new AuthenticationException("Refresh token not found. Please login again.");
        }

        // Verify old token & rotate (revoke old, issue new)
        RefreshToken newRefreshToken = refreshTokenService.verifyAndRotate(refreshTokenValue);

        // Generate new short-lived access token
        String accessToken = jwtService.generateToken(newRefreshToken.getUser().getEmail());

        // Set the new refresh token as HttpOnly cookie
        addRefreshTokenCookie(response, newRefreshToken.getToken());

        AuthResponseDTO authResponseDTO = AuthResponseDTO.builder()
                .userId(newRefreshToken.getUser().getId())
                .email(newRefreshToken.getUser().getEmail())
                .token(accessToken)
                .build();

        return ResponseEntity.ok(
                StandardResponseDTO.<AuthResponseDTO>builder()
                        .data(authResponseDTO)
                        .message("Token refreshed successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<StandardResponseDTO<Void>> logout(HttpServletRequest request,
            HttpServletResponse response) {
        String refreshTokenValue = extractRefreshTokenFromCookies(request);

        if (refreshTokenValue != null) {
            // Find the token and revoke all tokens for that user
            refreshTokenService.findByToken(refreshTokenValue)
                    .ifPresent(rt -> refreshTokenService.revokeAllUserTokens(rt.getUser().getId()));
        }

        // Clear the refresh token cookie
        clearRefreshTokenCookie(response);

        return ResponseEntity.ok(
                StandardResponseDTO.<Void>builder()
                        .message("Logged out successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    // --- Cookie Helpers ---

    private void addRefreshTokenCookie(HttpServletResponse response, String tokenValue) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE, tokenValue);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/api/v1/auth");
        cookie.setMaxAge((int) (refreshTokenExpiration / 1000));
        cookie.setAttribute("SameSite", cookieSecure ? "None" : "Lax");
        response.addCookie(cookie);
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/api/v1/auth");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", cookieSecure ? "None" : "Lax");
        response.addCookie(cookie);
    }

    private String extractRefreshTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null)
            return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> REFRESH_TOKEN_COOKIE.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
