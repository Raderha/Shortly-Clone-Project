package com.shortly.backend.domain.subscription.repository;

import com.shortly.backend.domain.subscription.entity.Subscription;
import com.shortly.backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    
    // 특정 사용자가 특정 크리에이터를 구독하고 있는지 확인
    Optional<Subscription> findBySubscriberAndCreator(User subscriber, User creator);
    
    // 사용자가 구독하고 있는 크리에이터 목록
    List<Subscription> findBySubscriber(User subscriber);
    
    // 크리에이터를 구독하고 있는 사용자 목록
    List<Subscription> findByCreator(User creator);
    
    // 구독 관계 존재 여부 확인
    boolean existsBySubscriberAndCreator(User subscriber, User creator);
    
    // 사용자가 구독한 크리에이터들의 ID 목록 조회
    @Query("SELECT s.creator.id FROM Subscription s WHERE s.subscriber = :subscriber")
    List<Long> findCreatorIdsBySubscriber(@Param("subscriber") User subscriber);
    
    // 구독 관계 삭제
    int deleteBySubscriberAndCreator(User subscriber, User creator);
} 