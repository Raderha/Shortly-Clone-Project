package com.shortly.backend.domain.subscription.controller;

import com.shortly.backend.domain.common.dto.ApiResponse;
import com.shortly.backend.domain.subscription.service.SubscriptionService;
import com.shortly.backend.domain.subscription.dto.CreatorDto;
import com.shortly.backend.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    
    private final SubscriptionService subscriptionService;
    
    // 구독하기
    @PostMapping("/{creatorId}")
    public ResponseEntity<ApiResponse<String>> subscribe(
            Authentication authentication,
            @PathVariable Long creatorId) {
        try {
            User user = (User) authentication.getPrincipal();
            System.out.println("구독 시도 - 사용자: " + user.getId() + ", 크리에이터: " + creatorId);
            boolean success = subscriptionService.subscribe(user.getId(), creatorId);
            
            if (success) {
                System.out.println("구독 성공 - 사용자: " + user.getId() + ", 크리에이터: " + creatorId);
                return ResponseEntity.ok(ApiResponse.success("구독이 완료되었습니다"));
            } else {
                System.out.println("구독 실패 (이미 구독 중) - 사용자: " + user.getId() + ", 크리에이터: " + creatorId);
                return ResponseEntity.badRequest().body(ApiResponse.error("이미 구독 중입니다"));
            }
        } catch (Exception e) {
            System.err.println("구독 처리 실패: " + e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 구독 취소
    @DeleteMapping("/{creatorId}")
    public ResponseEntity<ApiResponse<String>> unsubscribe(
            Authentication authentication,
            @PathVariable Long creatorId) {
        try {
            User user = (User) authentication.getPrincipal();
            System.out.println("구독 취소 시도 - 사용자: " + user.getId() + ", 크리에이터: " + creatorId);
            boolean success = subscriptionService.unsubscribe(user.getId(), creatorId);
            
            if (success) {
                System.out.println("구독 취소 성공 - 사용자: " + user.getId() + ", 크리에이터: " + creatorId);
                ApiResponse<String> response = ApiResponse.success("구독이 취소되었습니다");
                System.out.println("구독 취소 응답: " + response);
                return ResponseEntity.ok(response);
            } else {
                System.out.println("구독 취소 실패 (구독 관계 없음) - 사용자: " + user.getId() + ", 크리에이터: " + creatorId);
                ApiResponse<String> response = ApiResponse.error("구독 관계가 없습니다");
                System.out.println("구독 취소 실패 응답: " + response);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println("구독 취소 처리 실패: " + e.getMessage());
            ApiResponse<String> response = ApiResponse.error(e.getMessage());
            System.out.println("구독 취소 예외 응답: " + response);
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // 구독 상태 확인
    @GetMapping("/{creatorId}/status")
    public ResponseEntity<ApiResponse<Boolean>> checkSubscriptionStatus(
            Authentication authentication,
            @PathVariable Long creatorId) {
        try {
            User user = (User) authentication.getPrincipal();
            boolean isSubscribed = subscriptionService.isSubscribed(user.getId(), creatorId);
            System.out.println("구독 상태 확인 - 사용자: " + user.getId() + ", 크리에이터: " + creatorId + ", 구독여부: " + isSubscribed);
            return ResponseEntity.ok(ApiResponse.success("구독 상태 조회 완료", isSubscribed));
        } catch (Exception e) {
            System.err.println("구독 상태 확인 실패: " + e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 구독한 크리에이터들의 영상 조회
    @GetMapping("/videos")
    public ResponseEntity<ApiResponse<List<Long>>> getSubscribedCreatorIds(
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<Long> creatorIds = subscriptionService.getSubscribedCreatorIds(user.getId());
            return ResponseEntity.ok(ApiResponse.success("구독한 크리에이터 목록 조회 완료", creatorIds));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 구독한 크리에이터들의 상세 정보 조회
    @GetMapping("/creators")
    public ResponseEntity<ApiResponse<List<CreatorDto>>> getSubscribedCreators(
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<CreatorDto> creators = subscriptionService.getSubscribedCreators(user.getId());
            return ResponseEntity.ok(ApiResponse.success("구독한 크리에이터 상세 정보 조회 완료", creators));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
} 