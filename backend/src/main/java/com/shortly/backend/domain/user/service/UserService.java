package com.shortly.backend.domain.user.service;

import com.shortly.backend.domain.user.dto.LoginRequest;
import com.shortly.backend.domain.user.dto.SignupRequest;
import com.shortly.backend.domain.user.dto.UserResponse;
import com.shortly.backend.domain.user.entity.User;
import com.shortly.backend.domain.user.repository.UserRepository;
import com.shortly.backend.domain.video.entity.Tag;
import com.shortly.backend.domain.video.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public UserResponse signup(SignupRequest request) {
        // 중복 검사
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // 사용자 생성
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();
        
        User savedUser = userRepository.save(user);
        return UserResponse.from(savedUser);
    }
    
    public Authentication login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return authentication;
    }
    
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.from(user);
    }
    
    public User getCurrentUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    // 즐겨찾기 태그 관리 메서드들
    @Transactional
    public void addFavoriteTag(String tagName) {
        User currentUser = getCurrentUserEntity();
        Tag tag = tagRepository.findByName(tagName)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        
        if (!currentUser.hasFavoriteTag(tag)) {
            currentUser.addFavoriteTag(tag);
            userRepository.save(currentUser);
        }
    }
    
    @Transactional
    public void removeFavoriteTag(String tagName) {
        User currentUser = getCurrentUserEntity();
        Tag tag = tagRepository.findByName(tagName)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        
        currentUser.removeFavoriteTag(tag);
        userRepository.save(currentUser);
    }
    
    public List<String> getFavoriteTags() {
        User currentUser = getCurrentUserEntity();
        return currentUser.getFavoriteTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
    }
} 