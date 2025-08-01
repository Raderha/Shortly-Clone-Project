package com.shortly.backend.domain.comment.controller;

import com.shortly.backend.domain.comment.dto.CommentRequest;
import com.shortly.backend.domain.comment.dto.CommentResponse;
import com.shortly.backend.domain.comment.service.CommentService;
import com.shortly.backend.domain.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    
    private final CommentService commentService;
    
    @GetMapping("/video/{videoId}")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(
            @PathVariable Long videoId,
            Authentication authentication) {
        String username = authentication.getName();
        List<CommentResponse> comments = commentService.getCommentsByVideoId(videoId, username);
        return ResponseEntity.ok(ApiResponse.success("댓글을 성공적으로 가져왔습니다.", comments));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @RequestBody CommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        CommentResponse comment = commentService.createComment(request, username);
        return ResponseEntity.ok(ApiResponse.success("댓글이 성공적으로 작성되었습니다.", comment));
    }
    
    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        CommentResponse comment = commentService.updateComment(commentId, request, username);
        return ResponseEntity.ok(ApiResponse.success("댓글이 성공적으로 수정되었습니다.", comment));
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        String username = authentication.getName();
        commentService.deleteComment(commentId, username);
        return ResponseEntity.ok(ApiResponse.success("댓글이 성공적으로 삭제되었습니다.", null));
    }
} 