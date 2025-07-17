package com.shortly.backend.domain.video.service;

import com.shortly.backend.domain.user.entity.User;
import com.shortly.backend.domain.user.service.UserService;
import com.shortly.backend.domain.video.dto.VideoResponse;
import com.shortly.backend.domain.video.dto.VideoSearchResponse;
import com.shortly.backend.domain.video.entity.Tag;
import com.shortly.backend.domain.video.entity.Video;
import com.shortly.backend.domain.video.entity.VideoLike;
import com.shortly.backend.domain.video.repository.TagRepository;
import com.shortly.backend.domain.video.repository.VideoLikeRepository;
import com.shortly.backend.domain.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VideoService {
    
    private final VideoRepository videoRepository;
    private final TagRepository tagRepository;
    private final VideoLikeRepository videoLikeRepository;
    private final UserService userService;
    private final FileService fileService;
    
    @Transactional
    public VideoResponse uploadVideo(String title, String description, List<String> tagNames, MultipartFile videoFile) {
        System.out.println("[VideoService] 업로드 시작 - 제목: " + title + ", 파일 크기: " + videoFile.getSize());
        User currentUser = userService.getCurrentUserEntity();
        System.out.println("[VideoService] 현재 사용자: " + currentUser.getUsername());
        
        // 파일 업로드
        System.out.println("[VideoService] 비디오 파일 업로드 시작");
        String videoUrl = fileService.uploadVideo(videoFile);
        System.out.println("[VideoService] 비디오 파일 업로드 완료: " + videoUrl);
        
        System.out.println("[VideoService] 썸네일 생성 시작");
        String thumbnailUrl = fileService.generateThumbnail(videoFile);
        System.out.println("[VideoService] 썸네일 생성 완료: " + thumbnailUrl);
        
        // 비디오 생성
        System.out.println("[VideoService] 비디오 엔티티 생성 시작");
        Video video = Video.builder()
                .title(title)
                .description(description)
                .url(videoUrl)
                .thumbnailUrl(thumbnailUrl)
                .owner(currentUser)
                .build();
        
        Video savedVideo = videoRepository.save(video);
        System.out.println("[VideoService] 비디오 저장 완료 - ID: " + savedVideo.getId());
        
        // 태그 처리
        System.out.println("[VideoService] 태그 처리 시작 - 태그 개수: " + (tagNames != null ? tagNames.size() : 0));
        if (tagNames != null && !tagNames.isEmpty()) {
            for (String tagName : tagNames) {
                if (tagName != null && !tagName.trim().isEmpty()) {
                    String trimmedTagName = tagName.trim();
                    System.out.println("[VideoService] 태그 처리 중: " + trimmedTagName);
                    Tag tag = tagRepository.findByName(trimmedTagName)
                            .orElseGet(() -> tagRepository.save(Tag.builder().name(trimmedTagName).build()));
                    savedVideo.addTag(tag);
                }
            }
        }
        
        System.out.println("[VideoService] VideoResponse 생성 시작");
        VideoResponse response = VideoResponse.from(savedVideo);
        System.out.println("[VideoService] 업로드 완료");
        return response;
    }
    
    public VideoSearchResponse searchVideos(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Video> videoPage = videoRepository.searchByKeyword(keyword, pageable);
        
        List<VideoResponse> videos = videoPage.getContent().stream()
                .map(VideoResponse::from)
                .collect(Collectors.toList());
        
        return VideoSearchResponse.builder()
                .videos(videos)
                .total(videoPage.getTotalElements())
                .page(page)
                .perPage(size)
                .build();
    }
    
    public VideoSearchResponse getAllVideos(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Video> videoPage = videoRepository.findAllByOrderByCreatedAtDesc(pageable);
    
        List<Video> rawVideos = videoPage.getContent();
        System.out.println("DB에서 조회된 Video 개수: " + rawVideos.size());
        for (Video v : rawVideos) {
            System.out.println("Video: " + v.getId() + ", title: " + v.getTitle() + ", owner: " + v.getOwner());
        }
    
        List<VideoResponse> videos = new ArrayList<>();
        for (Video v : rawVideos) {
            try {
                videos.add(VideoResponse.from(v));
            } catch (Exception e) {
                System.out.println("Video 변환 실패: " + v.getId() + ", 에러: " + e.getMessage());
                e.printStackTrace();
            }
        }
        System.out.println("VideoResponse 변환 후 개수: " + videos.size());
    
        return VideoSearchResponse.builder()
                .videos(videos)
                .total(videoPage.getTotalElements())
                .page(page)
                .perPage(size)
                .build();
    }
    
    public VideoResponse getVideoById(Long videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        return VideoResponse.from(video);
    }
    
    public VideoSearchResponse getVideosByTag(String tagName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Video> videoPage = videoRepository.findByTagName(tagName, pageable);
        
        List<VideoResponse> videos = videoPage.getContent().stream()
                .map(VideoResponse::from)
                .collect(Collectors.toList());
        
        return VideoSearchResponse.builder()
                .videos(videos)
                .total(videoPage.getTotalElements())
                .page(page)
                .perPage(size)
                .build();
    }
    
    @Transactional
    public void deleteVideo(Long videoId) {
        User currentUser = userService.getCurrentUserEntity();
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        
        if (!video.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own videos");
        }
        
        // 파일 삭제
        fileService.deleteVideo(video.getUrl());
        if (video.getThumbnailUrl() != null) {
            fileService.deleteThumbnail(video.getThumbnailUrl());
        }
        
        videoRepository.delete(video);
    }
    
    public List<VideoResponse> getMyVideos() {
        User currentUser = userService.getCurrentUserEntity();
        List<Video> videos = videoRepository.findByOwnerOrderByCreatedAtDesc(currentUser);
        return videos.stream()
                .map(VideoResponse::from)
                .collect(Collectors.toList());
    }
    
    public List<VideoResponse> getLikedVideos() {
        User currentUser = userService.getCurrentUserEntity();
        List<Video> videos = videoLikeRepository.findLikedVideosByUser(currentUser);
        return videos.stream()
                .map(VideoResponse::from)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void likeVideo(Long videoId) {
        User currentUser = userService.getCurrentUserEntity();
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        
        // 이미 좋아요했는지 확인
        if (videoLikeRepository.existsByUserAndVideo(currentUser, video)) {
            throw new RuntimeException("Video already liked");
        }
        
        // 좋아요 생성
        VideoLike videoLike = VideoLike.builder()
                .user(currentUser)
                .video(video)
                .build();
        
        videoLikeRepository.save(videoLike);
    }
    
    @Transactional
    public void unlikeVideo(Long videoId) {
        User currentUser = userService.getCurrentUserEntity();
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        
        // 좋아요 찾기
        VideoLike videoLike = videoLikeRepository.findByUserAndVideo(currentUser, video)
                .orElseThrow(() -> new RuntimeException("Video not liked"));
        
        // 좋아요 삭제
        videoLikeRepository.delete(videoLike);
    }
    
    public boolean isVideoLiked(Long videoId) {
        User currentUser = userService.getCurrentUserEntity();
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        
        return videoLikeRepository.existsByUserAndVideo(currentUser, video);
    }

    @Transactional
    public void generateThumbnailsForAllVideos() {
        List<Video> videos = videoRepository.findAll();
        for (Video video : videos) {
            if (video.getThumbnailUrl() == null || video.getThumbnailUrl().isEmpty()) {
                Path videoPath = Paths.get("uploads/videos", video.getUrl());
                if (Files.exists(videoPath)) {
                    String thumbnailFilename = UUID.randomUUID().toString() + ".jpg";
                    Path thumbnailFilePath = Paths.get("uploads/thumbnails", thumbnailFilename);
                    try {
                        System.out.println("[FFmpeg] 실행 시작: " + videoPath.toString());
                        System.out.println("[FFmpeg] 썸네일 경로: " + thumbnailFilePath.toString());
                        System.out.println("[FFmpeg] 썸네일 폴더 존재: " + Files.exists(thumbnailFilePath.getParent()));
                        ProcessBuilder pb = new ProcessBuilder(
                            "C:\\ffmpeg-2025-07-10-git-82aeee3c19-full_build\\bin\\ffmpeg.exe",
                            "-i", videoPath.toString(),
                            "-ss", "00:00:01",
                            "-vframes", "1",
                            "-vf", "scale=320:240",
                            "-update", "1",
                            thumbnailFilePath.toString()
                        );
                        pb.redirectErrorStream(true);
                        Process process = pb.start();

                        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                            String line;
                            while ((line = reader.readLine()) != null) {
                                System.out.println("[FFmpeg] " + line);
                            }
                        }
                        int exitCode = process.waitFor();
                        System.out.println("[FFmpeg] 종료 코드: " + exitCode);

                        if (exitCode == 0) {
                            boolean fileCreated = Files.exists(thumbnailFilePath);
                            System.out.println("[FFmpeg] 파일 생성 확인: " + fileCreated);
                            System.out.println("[FFmpeg] 파일 크기: " + (fileCreated ? Files.size(thumbnailFilePath) : "파일 없음"));
                            
                            if (fileCreated) {
                                video.setThumbnailUrl(thumbnailFilename);
                                videoRepository.save(video);
                                System.out.println("썸네일 생성 완료: " + video.getUrl());
                            } else {
                                System.out.println("[FFmpeg ERROR] 파일이 생성되지 않음: " + thumbnailFilePath);
                            }
                        } else {
                            System.out.println("[FFmpeg ERROR] 종료 코드: " + exitCode);
                        }
                    } catch (Exception e) {
                        System.out.println("[FFmpeg ERROR] " + e.getMessage());
                        e.printStackTrace();
                    }
                } else {
                    System.out.println("영상 파일 없음: " + video.getUrl());
                }
            }
        }
    }
} 