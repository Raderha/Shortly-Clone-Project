-- 간단한 구독 기능을 위한 테이블 생성

-- 구독 관계 테이블 (간단한 버전)
CREATE TABLE subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subscriber_id BIGINT NOT NULL,           -- 구독하는 사용자 ID
    creator_id BIGINT NOT NULL,              -- 구독받는 사용자 ID (영상 업로더)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_subscription (subscriber_id, creator_id),
    FOREIGN KEY (subscriber_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
); 