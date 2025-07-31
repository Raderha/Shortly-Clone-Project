import { apiRequest } from './apiUtils';
import { API_CONFIG } from './config';

// 구독하기
export const subscribeToCreator = async (creatorId: number, token: string) => {
  try {
    console.log('[subscription.ts] 구독 시도 - creatorId:', creatorId);
    const response = await apiRequest(`/subscriptions/${creatorId}`, {
      method: 'POST',
      token,
    });
    console.log('[subscription.ts] 구독 응답:', response);
    return response;
  } catch (error) {
    console.error('[subscription.ts] 구독하기 실패:', error);
    throw error;
  }
};

// 구독 취소
export const unsubscribeFromCreator = async (creatorId: number, token: string) => {
  try {
    console.log('[subscription.ts] 구독 취소 시도 - creatorId:', creatorId);
    const response = await apiRequest(`/subscriptions/${creatorId}`, {
      method: 'DELETE',
      token,
    });
    console.log('[subscription.ts] 구독 취소 응답:', response);
    return response;
  } catch (error) {
    console.error('[subscription.ts] 구독 취소 실패:', error);
    throw error;
  }
};

// 구독 상태 확인
export const checkSubscriptionStatus = async (creatorId: number, token: string) => {
  try {
    const response = await apiRequest(`/subscriptions/${creatorId}/status`, {
      method: 'GET',
      token,
    });
    return response;
  } catch (error) {
    console.error('구독 상태 확인 실패:', error);
    throw error;
  }
};

// 구독한 크리에이터들의 영상 조회
export const getSubscribedVideos = async (token: string) => {
  try {
    const response = await apiRequest(`/subscriptions/videos`, {
      method: 'GET',
      token,
    });
    return response;
  } catch (error) {
    console.error('구독한 영상 조회 실패:', error);
    throw error;
  }
};

// 구독한 크리에이터들의 상세 정보 조회
export const getSubscribedCreators = async (token: string) => {
  try {
    const response = await apiRequest(`/subscriptions/creators`, {
      method: 'GET',
      token,
    });
    return response;
  } catch (error) {
    console.error('구독한 크리에이터 조회 실패:', error);
    throw error;
  }
}; 