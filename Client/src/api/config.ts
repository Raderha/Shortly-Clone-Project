import { API_CONSTANTS } from '../constants';

// API 설정
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 
            process.env.EXPO_PUBLIC_API_BASE_URL || 
            'http://192.168.0.18:8080/api',
  TIMEOUT: API_CONSTANTS.TIMEOUT,
  RETRY_ATTEMPTS: API_CONSTANTS.RETRY_ATTEMPTS,
} as const;

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
  },
  
  // 비디오
  VIDEO: {
    UPLOAD: '/videos',
    MY_VIDEOS: '/videos/my-videos',
    LIKED_VIDEOS: '/videos/liked-videos',
    LIKE: (id: number) => `/videos/${id}/like`,
    IS_LIKED: (id: number) => `/videos/${id}/is-liked`,
    DELETE: (id: number) => `/videos/${id}`,
    SEARCH: '/videos/search',
    BY_TAG: (tag: string) => `/videos/tag/${encodeURIComponent(tag)}`,
    ALL: '/videos',
  },
  
  // 사용자
  USER: {
    CHANGE_PASSWORD: '/user/change-password',
    FAVORITE_TAGS: '/user/favorites/tags',
    FAVORITE_TAG: (tagName: string) => `/user/favorites/tags/${encodeURIComponent(tagName)}`,
  },
  
  // 댓글
  COMMENT: {
    GET_BY_VIDEO: (videoId: number) => `/comments/video/${videoId}`,
    CREATE: '/comments',
    UPDATE: (commentId: number) => `/comments/${commentId}`,
    DELETE: (commentId: number) => `/comments/${commentId}`,
  },
} as const;