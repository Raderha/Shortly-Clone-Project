package com.shortly.backend.config;

import com.shortly.backend.domain.user.entity.User;
import com.shortly.backend.domain.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final String SECRET_KEY = "shortly-secret-key-shortly-secret-key-shortly-secret-key-shortly-secret-key"; // 32+ chars

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // 정적 파일 경로는 JWT 필터를 거치지 않도록 설정
        return path.startsWith("/uploads/") || 
               path.startsWith("/static/") || 
               path.startsWith("/public/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = resolveToken(request);
        System.out.println("JWT Filter - Request URI: " + request.getRequestURI());
        System.out.println("JWT Filter - Token: " + (token != null ? token.substring(0, Math.min(20, token.length())) + "..." : "null"));

        if (token != null) {
            try {
                Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
                System.out.println("JWT Filter - Claims parsed successfully: " + claims);
                String email = claims.get("email", String.class);
                System.out.println("JWT Filter - Email from token: " + email);

                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    System.out.println("JWT Filter - User found: " + user.getUsername());
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("JWT Filter - Authentication set successfully");
                } else {
                    System.out.println("JWT Filter - User not found for email: " + email);
                }
            } catch (Exception e) {
                System.out.println("JWT Filter - Token parsing failed: " + e.getMessage());
                e.printStackTrace();
                // 토큰 파싱 실패 시 무시 (익명 사용자로 처리)
            }
        } else {
            System.out.println("JWT Filter - No token found in request");
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 