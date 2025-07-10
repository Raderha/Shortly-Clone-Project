package com.shortly.backend.domain.video.dto;

import com.shortly.backend.domain.user.dto.UserResponse;
import com.shortly.backend.domain.video.entity.Video;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoResponse {
    
    private Long id;
    private String title;
    private String description;
    private String url;
    private String thumbnailUrl;
    private UserResponse owner;
    private List<String> tags;
    private LocalDateTime createdAt;
    
    public static VideoResponse from(Video video) {
        return VideoResponse.builder()
                .id(video.getId())
                .title(video.getTitle())
                .description(video.getDescription())
                .url(video.getUrl())
                .thumbnailUrl(video.getThumbnailUrl())
                .owner(UserResponse.from(video.getOwner()))
                .tags(video.getVideoTags().stream()
                        .map(vt -> vt.getTag().getName())
                        .collect(Collectors.toList()))
                .createdAt(video.getCreatedAt())
                .build();
    }
} 