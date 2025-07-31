package com.shortly.backend.domain.subscription.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatorDto {
    private Long id;
    private String username;
    private String email;
    private String profilePicture;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 