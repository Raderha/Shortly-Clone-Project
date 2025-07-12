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
            
            // JWT 토큰 생성 (실제 구현에서는 JwtService 사용)
            String token = "JWT_TOKEN_" + System.currentTimeMillis();
            
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