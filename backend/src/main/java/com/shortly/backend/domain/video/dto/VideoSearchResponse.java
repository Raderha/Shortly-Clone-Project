package com.shortly.backend.domain.video.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoSearchResponse {
    
    private List<VideoResponse> videos;
    private long total;
    private int page;
    private int perPage;
} 