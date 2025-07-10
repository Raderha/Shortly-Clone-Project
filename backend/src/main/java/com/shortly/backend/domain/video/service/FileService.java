package com.shortly.backend.domain.video.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {
    
    private final String uploadDir = "uploads/videos/";
    private final String thumbnailDir = "uploads/thumbnails/";
    
    public String uploadVideo(MultipartFile file) {
        try {
            // 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            
            // 파일 저장
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload video", e);
        }
    }
    
    public String generateThumbnail(MultipartFile videoFile) {
        // 실제 구현에서는 FFmpeg 등을 사용하여 썸네일 생성
        // 여기서는 간단히 UUID 기반 파일명 반환
        return UUID.randomUUID().toString() + ".jpg";
    }
    
    public void deleteVideo(String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete video", e);
        }
    }
    
    public void deleteThumbnail(String filename) {
        try {
            Path filePath = Paths.get(thumbnailDir, filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete thumbnail", e);
        }
    }
} 