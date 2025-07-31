package com.shortly.backend.domain.subscription.service;

import com.shortly.backend.domain.subscription.entity.Subscription;
import com.shortly.backend.domain.subscription.repository.SubscriptionRepository;
import com.shortly.backend.domain.subscription.dto.CreatorDto;
import com.shortly.backend.domain.user.entity.User;
import com.shortly.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionService {
    
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    
    // 구독하기
    public boolean subscribe(Long subscriberId, Long creatorId) {
        User subscriber = userRepository.findById(subscriberId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("크리에이터를 찾을 수 없습니다"));
        
        // 이미 구독 중인지 확인
        if (subscriptionRepository.existsBySubscriberAndCreator(subscriber, creator)) {
            return false; // 이미 구독 중
        }
        
        // 구독 관계 생성
        Subscription subscription = Subscription.builder()
                .subscriber(subscriber)
                .creator(creator)
                .build();
        subscriptionRepository.save(subscription);
        
        return true;
    }
    
    // 구독 취소
    public boolean unsubscribe(Long subscriberId, Long creatorId) {
        User subscriber = userRepository.findById(subscriberId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("크리에이터를 찾을 수 없습니다"));
        
        // 구독 관계 삭제
        return subscriptionRepository.deleteBySubscriberAndCreator(subscriber, creator) > 0;
    }
    
    // 구독 상태 확인
    public boolean isSubscribed(Long subscriberId, Long creatorId) {
        User subscriber = userRepository.findById(subscriberId).orElse(null);
        User creator = userRepository.findById(creatorId).orElse(null);
        
        if (subscriber == null || creator == null) {
            return false;
        }
        
        return subscriptionRepository.existsBySubscriberAndCreator(subscriber, creator);
    }
    
    // 사용자가 구독한 크리에이터들의 ID 목록 조회
    public List<Long> getSubscribedCreatorIds(Long subscriberId) {
        User subscriber = userRepository.findById(subscriberId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        return subscriptionRepository.findCreatorIdsBySubscriber(subscriber);
    }
    
    // 사용자가 구독한 크리에이터들의 상세 정보 조회
    public List<CreatorDto> getSubscribedCreators(Long subscriberId) {
        User subscriber = userRepository.findById(subscriberId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        List<User> creators = subscriptionRepository.findCreatorsBySubscriber(subscriber);
        
        return creators.stream()
                .map(creator -> CreatorDto.builder()
                        .id(creator.getId())
                        .username(creator.getUsername())
                        .email(creator.getEmail())
                        .profilePicture(creator.getProfilePicture())
                        .createdAt(creator.getCreatedAt())
                        .updatedAt(creator.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }
} 