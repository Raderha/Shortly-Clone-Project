package com.shortly.backend.domain.video.repository;

import com.shortly.backend.domain.user.entity.User;
import com.shortly.backend.domain.video.entity.Video;
import com.shortly.backend.domain.video.entity.VideoLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoLikeRepository extends JpaRepository<VideoLike, Long> {
    
    Optional<VideoLike> findByUserAndVideo(User user, Video video);
    
    boolean existsByUserAndVideo(User user, Video video);
    
    @Query("SELECT v FROM Video v JOIN VideoLike vl ON v.id = vl.video.id WHERE vl.user = :user ORDER BY vl.createdAt DESC")
    List<Video> findLikedVideosByUser(@Param("user") User user);
} 