package com.shortly.backend.domain.video.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoUploadRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotEmpty(message = "At least one tag is required")
    private List<String> tags;
    
    // MultipartFile은 별도로 처리
    private MultipartFile video;
} 