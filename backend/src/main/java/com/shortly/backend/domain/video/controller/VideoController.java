package com.shortly.backend.domain.video.controller;

import com.shortly.backend.domain.common.dto.ApiResponse;
import com.shortly.backend.domain.video.dto.VideoResponse;
import com.shortly.backend.domain.video.dto.VideoSearchResponse;
import com.shortly.backend.domain.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
            @RequestParam("tags") List<String> tags,
            @RequestParam("video") MultipartFile videoFile) {
        
        VideoResponse videoResponse = videoService.uploadVideo(title, description, tags, videoFile);
        return ApiResponse.success("Video uploaded successfully", videoResponse);
    }
    
    @GetMapping("/search")
    public VideoSearchResponse searchVideos(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        
        return videoService.searchVideos(keyword, page, size);
    }
    
    @GetMapping
    public VideoSearchResponse getAllVideos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        
        return videoService.getAllVideos(page, size);
    }
    
    @GetMapping("/tag/{tagName}")
    public VideoSearchResponse getVideosByTag(
            @PathVariable String tagName,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        
        return videoService.getVideosByTag(tagName, page, size);
    }
    
    @DeleteMapping("/{videoId}")
    public ApiResponse<Void> deleteVideo(@PathVariable Long videoId) {
        videoService.deleteVideo(videoId);
        return ApiResponse.success("Video deleted successfully");
    }
    
    @GetMapping("/my-videos")
    public ApiResponse<List<VideoResponse>> getMyVideos() {
        List<VideoResponse> videos = videoService.getMyVideos();
        return ApiResponse.success("My videos retrieved successfully", videos);
    }
    
    @GetMapping("/liked-videos")
    public ApiResponse<List<VideoResponse>> getLikedVideos() {
        List<VideoResponse> videos = videoService.getLikedVideos();
        return ApiResponse.success("Liked videos retrieved successfully", videos);
    }
    
    @PostMapping("/{videoId}/like")
    public ApiResponse<Void> likeVideo(@PathVariable Long videoId) {
        videoService.likeVideo(videoId);
        return ApiResponse.success("Video liked successfully");
    }
    
    @DeleteMapping("/{videoId}/like")
    public ApiResponse<Void> unlikeVideo(@PathVariable Long videoId) {
        videoService.unlikeVideo(videoId);
        return ApiResponse.success("Video unliked successfully");
    }
    
    @GetMapping("/{videoId}/is-liked")
    public ApiResponse<Boolean> isVideoLiked(@PathVariable Long videoId) {
        boolean isLiked = videoService.isVideoLiked(videoId);
        return ApiResponse.success("Like status retrieved successfully", isLiked);
    }

    @PostMapping("/admin/generate-thumbnails")
    public ApiResponse<Void> generateThumbnailsForAllVideos() {
        videoService.generateThumbnailsForAllVideos();
        return ApiResponse.success("썸네일 일괄 생성 완료");
    }
} 