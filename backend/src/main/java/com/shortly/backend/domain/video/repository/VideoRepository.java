package com.shortly.backend.domain.video.repository;

import com.shortly.backend.domain.user.entity.User;
import com.shortly.backend.domain.video.entity.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    
    Page<Video> findByOwner(User owner, Pageable pageable);
    
    @Query("SELECT v FROM Video v JOIN v.videoTags vt JOIN vt.tag t " +
           "WHERE t.name = :tagName")
    Page<Video> findByTagName(@Param("tagName") String tagName, Pageable pageable);
    
    @Query("SELECT v FROM Video v WHERE " +
           "LOWER(v.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Video> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    List<Video> findByOwnerOrderByCreatedAtDesc(User owner);
} 