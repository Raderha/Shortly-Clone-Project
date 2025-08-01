package com.shortly.backend.domain.comment.repository;

import com.shortly.backend.domain.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByVideoIdOrderByCreatedAtDesc(Long videoId);
    long countByVideoId(Long videoId);
    void deleteByVideoId(Long videoId);
} 