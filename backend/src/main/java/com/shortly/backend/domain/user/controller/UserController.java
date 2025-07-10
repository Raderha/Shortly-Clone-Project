package com.shortly.backend.domain.user.controller;

import com.shortly.backend.domain.common.dto.ApiResponse;
import com.shortly.backend.domain.user.dto.UserResponse;
import com.shortly.backend.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    public UserResponse getCurrentUser() {
        return userService.getCurrentUser();
    }
    
    // 즐겨찾기 태그 관리 API
    @PostMapping("/favorites/tags")
    public ApiResponse<Void> addFavoriteTag(@RequestParam String tagName) {
        userService.addFavoriteTag(tagName);
        return ApiResponse.success("Tag added to favorites");
    }
    
    @GetMapping("/favorites/tags")
    public ApiResponse<List<String>> getFavoriteTags() {
        List<String> tags = userService.getFavoriteTags();
        return ApiResponse.success("Favorite tags retrieved successfully", tags);
    }
    
    @DeleteMapping("/favorites/tags/{tagName}")
    public ApiResponse<Void> removeFavoriteTag(@PathVariable String tagName) {
        userService.removeFavoriteTag(tagName);
        return ApiResponse.success("Tag removed from favorites");
    }
} 