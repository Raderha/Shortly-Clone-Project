package com.shortly.backend.domain.video.controller;

import com.shortly.backend.domain.common.dto.ApiResponse;
import com.shortly.backend.domain.video.dto.VideoResponse;
import com.shortly.backend.domain.video.dto.VideoSearchResponse;
import com.shortly.backend.domain.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {
    
    private final VideoService videoService;
    
    @PostMapping
    public ApiResponse<VideoResponse> uploadVideo(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("tags") String tagsJson,
            @RequestParam("video") MultipartFile videoFile) {
        
        // JSON 문자열을 List<String>으로 변환
        List<String> tags = new ArrayList<>();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            tags = objectMapper.readValue(tagsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            System.out.println("태그 파싱 오류: " + e.getMessage());
        }
        
        VideoResponse videoResponse = videoService.uploadVideo(title, description, tags, videoFile);
        return ApiResponse.success("Video uploaded successfully", videoResponse);
    }
    
    @GetMapping("/search")
    public ApiResponse<VideoSearchResponse> searchVideos(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        
        VideoSearchResponse result = videoService.searchVideos(keyword, page, size);
        return ApiResponse.success("Videos searched successfully", result);
    }
    
    @GetMapping
    public ApiResponse<VideoSearchResponse> getAllVideos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        
        VideoSearchResponse result = videoService.getAllVideos(page, size);
        return ApiResponse.success("Videos retrieved successfully", result);
    }
    
    @GetMapping("/tag/{tagName}")
    public ApiResponse<VideoSearchResponse> getVideosByTag(
            @PathVariable String tagName,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        
        VideoSearchResponse result = videoService.getVideosByTag(tagName, page, size);
        return ApiResponse.success("Videos retrieved by tag successfully", result);
    }
    
    @DeleteMapping("/{videoId}")
    public ApiResponse<String> deleteVideo(@PathVariable Long videoId) {
        videoService.deleteVideo(videoId);
        return ApiResponse.success("Video deleted successfully", "Video deleted");
    }
    
    @GetMapping("/my-videos")
    public ApiResponse<List<VideoResponse>> getMyVideos() {
        List<VideoResponse> videos = videoService.getMyVideos();
        return ApiResponse.success("My videos retrieved successfully", videos);
    }
    
    // 좋아요 관련 API
    @GetMapping("/liked-videos")
    public ApiResponse<List<VideoResponse>> getLikedVideos() {
        List<VideoResponse> videos = videoService.getLikedVideos();
        return ApiResponse.success("Liked videos retrieved successfully", videos);
    }
    
    @PostMapping("/{videoId}/like")
    public ApiResponse<String> likeVideo(@PathVariable Long videoId) {
        videoService.likeVideo(videoId);
        return ApiResponse.success("Video liked successfully", "Video liked");
    }
    
    @DeleteMapping("/{videoId}/like")
    public ApiResponse<String> unlikeVideo(@PathVariable Long videoId) {
        videoService.unlikeVideo(videoId);
        return ApiResponse.success("Video unliked successfully", "Video unliked");
    }
    
    @GetMapping("/{videoId}/is-liked")
    public ApiResponse<Boolean> isVideoLiked(@PathVariable Long videoId) {
        boolean isLiked = videoService.isVideoLiked(videoId);
        return ApiResponse.success("Like status retrieved successfully", isLiked);
    }
    
    @PostMapping("/admin/generate-thumbnails")
    public ApiResponse<String> generateThumbnails() {
        videoService.generateThumbnailsForAllVideos();
        return ApiResponse.success("Thumbnails generated successfully", "Thumbnails generated");
    }
    
    @PostMapping("/admin/clear-thumbnails")
    public ApiResponse<String> clearThumbnails() {
        videoService.clearAllThumbnails();
        return ApiResponse.success("Thumbnails cleared successfully", "Thumbnails cleared");
    }
    
    // 정적 파일 접근을 위한 엔드포인트
    @GetMapping("/file/{filename}")
    public ResponseEntity<Resource> getVideoFile(@PathVariable String filename) {
        try {
            // backend 디렉토리에서 실행되므로 uploads/videos 경로로 설정
            Path filePath = Paths.get("uploads", "videos").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/thumbnail/{filename}")
    public ResponseEntity<Resource> getThumbnailFile(@PathVariable String filename) {
        try {
            // backend 디렉토리에서 실행되므로 uploads/thumbnails 경로로 설정
            Path filePath = Paths.get("uploads", "thumbnails").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 