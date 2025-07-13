package com.shortly.backend.domain.user.controller;

import com.shortly.backend.domain.common.dto.ApiResponse;
import com.shortly.backend.domain.common.dto.LoginResponse;
import com.shortly.backend.domain.user.dto.LoginRequest;
import com.shortly.backend.domain.user.dto.SignupRequest;
import com.shortly.backend.domain.user.dto.UserResponse;
import com.shortly.backend.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import io.jsonwebtoken.Jwts;
import java.util.Date;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/signup")
    public ApiResponse<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        UserResponse userResponse = userService.signup(request);
        return ApiResponse.success("User registered successfully", userResponse);
    }
    
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = userService.login(request);
            UserResponse userResponse = userService.getCurrentUser();

            // JJWT 0.11.5 방식으로 JWT 토큰 생성
            String secretKey = "shortly-secret-key-shortly-secret-key-shortly-secret-key-shortly-secret-key";
            Instant now = Instant.now();
            String token = Jwts.builder()
                .claim("email", userResponse.getEmail())
                .claim("userId", userResponse.getId())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(24, ChronoUnit.HOURS)))
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS256, secretKey.getBytes())
                .compact();

            LoginResponse loginResponse = LoginResponse.builder()
                    .token(token)
                    .user(userResponse)
                    .build();

            return ApiResponse.success("Login successful", loginResponse);
        } catch (Exception e) {
            return ApiResponse.error("Login failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        // 실제 구현에서는 토큰 블랙리스트 처리
        return ApiResponse.success("Successfully logged out");
    }
} 