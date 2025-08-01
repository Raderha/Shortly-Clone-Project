package com.shortly.backend.domain.comment.service;

import com.shortly.backend.domain.comment.dto.CommentRequest;
import com.shortly.backend.domain.comment.dto.CommentResponse;
import com.shortly.backend.domain.comment.entity.Comment;
import com.shortly.backend.domain.comment.repository.CommentRepository;
import com.shortly.backend.domain.user.entity.User;
import com.shortly.backend.domain.user.repository.UserRepository;
import com.shortly.backend.domain.video.entity.Video;
import com.shortly.backend.domain.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    
    public List<CommentResponse> getCommentsByVideoId(Long videoId) {
        List<Comment> comments = commentRepository.findByVideoIdOrderByCreatedAtDesc(videoId);
        return comments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CommentResponse> getCommentsByVideoId(Long videoId, String username) {
        List<Comment> comments = commentRepository.findByVideoIdOrderByCreatedAtDesc(videoId);
        return comments.stream()
                .map(comment -> convertToResponse(comment, username))
                .collect(Collectors.toList());
    }
    
    public CommentResponse createComment(CommentRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
        
        Video video = videoRepository.findById(request.getVideoId())
                .orElseThrow(() -> new IllegalArgumentException("비디오를 찾을 수 없습니다."));
        
        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .video(video)
                .build();
        
        Comment savedComment = commentRepository.save(comment);
        return convertToResponse(savedComment, username);
    }
    
    public CommentResponse updateComment(Long commentId, CommentRequest request, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
        
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("댓글을 수정할 권한이 없습니다.");
        }
        
        comment = Comment.builder()
                .id(comment.getId())
                .content(request.getContent())
                .user(comment.getUser())
                .video(comment.getVideo())
                .createdAt(comment.getCreatedAt())
                .build();
        
        Comment updatedComment = commentRepository.save(comment);
        return convertToResponse(updatedComment, username);
    }
    
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
        
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("댓글을 삭제할 권한이 없습니다.");
        }
        
        commentRepository.delete(comment);
    }
    
    private CommentResponse convertToResponse(Comment comment) {
        return convertToResponse(comment, null);
    }
    
    private CommentResponse convertToResponse(Comment comment, String username) {
        boolean isOwner = username != null && comment.getUser().getUsername().equals(username);
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .user(CommentResponse.UserInfo.builder()
                        .id(comment.getUser().getId())
                        .username(comment.getUser().getUsername())
                        .profilePicture(comment.getUser().getProfilePicture())
                        .build())
                .videoId(comment.getVideo().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .isOwner(isOwner)
                .build();
    }
} 