package com.shortly.backend.domain.video.service;

import com.shortly.backend.domain.user.entity.User;
import com.shortly.backend.domain.user.service.UserService;
import com.shortly.backend.domain.video.dto.VideoResponse;
import com.shortly.backend.domain.video.dto.VideoSearchResponse;
import com.shortly.backend.domain.video.entity.Tag;
import com.shortly.backend.domain.video.entity.Video;
import com.shortly.backend.domain.video.repository.TagRepository;
import com.shortly.backend.domain.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VideoService {
    
    private final VideoRepository videoRepository;
    private final TagRepository tagRepository;
    private final UserService userService;
    private final FileService fileService;
    
    @Transactional
    public VideoResponse uploadVideo(String title, String description, List<String> tagNames, MultipartFile videoFile) {
        User currentUser = userService.getCurrentUserEntity();
        
        // 파일 업로드
        String videoUrl = fileService.uploadVideo(videoFile);
        String thumbnailUrl = fileService.generateThumbnail(videoFile);
        
        // 비디오 생성
        Video video = Video.builder()
                .title(title)
                .description(description)
                .url(videoUrl)
                .thumbnailUrl(thumbnailUrl)
                .owner(currentUser)
                .build();
        
        Video savedVideo = videoRepository.save(video);
        
        // 태그 처리
        for (String tagName : tagNames) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));
            savedVideo.addTag(tag);
        }
        
        return VideoResponse.from(savedVideo);
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
} 