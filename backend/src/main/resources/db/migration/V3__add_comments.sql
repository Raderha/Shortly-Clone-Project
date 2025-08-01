-- 댓글 기능을 위한 테이블 생성

-- 댓글 테이블
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,                   -- 댓글 내용
    user_id BIGINT NOT NULL,                 -- 댓글 작성자 ID
    video_id BIGINT NOT NULL,                -- 댓글이 달린 비디오 ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
); 