import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'http://222.102.217.76:8080/api';

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface VideoResponse {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  owner: {
    id: number;
    username: string;
    email: string;
  };
  tags: string[];
  createdAt: string;
}

// 회원가입 API
export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          message: result.message || '회원가입이 완료되었습니다.',
        };
      } else {
        return {
          success: false,
          message: result.message || '회원가입에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.',
      };
    }
  };

// 로그인 API
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (response.ok) {
        return {
          success: true,
          message: '로그인되었습니다.',
          token: result.data?.token,
          user: result.data?.user,
        };
      } else {
        return {
          success: false,
          message: result.message || '로그인에 실패했습니다.',
        };
      }
  } catch (error) {
    console.error('로그인 오류:', error);
    return {
      success: false,
      message: '네트워크 오류가 발생했습니다.',
    };
  }
}; 

// 토큰을 받아서 헤더에 추가하는 fetch wrapper
const authFetch = async (url: string, options: any = {}, token?: string) => {
  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
};

// 사용자의 동영상 가져오기
export const getMyVideos = async (token?: string): Promise<VideoResponse[]> => {
  try {
    const response = await authFetch(`${API_BASE_URL}/videos/my-videos`, { method: 'GET' }, token);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('getMyVideos HTTP 오류:', response.status, response.statusText, errorText);
      return [];
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('getMyVideos 네트워크 오류:', error);
    return [];
  }
};

// 좋아요한 영상 가져오기
export const getLikedVideos = async (token?: string): Promise<VideoResponse[]> => {
  try {
    const response = await authFetch(`${API_BASE_URL}/videos/liked-videos`, { method: 'GET' }, token);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('getLikedVideos HTTP 오류:', response.status, response.statusText, errorText);
      return [];
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('getLikedVideos 네트워크 오류:', error);
    return [];
  }
};

// 영상 좋아요
export const likeVideo = async (videoId: number, token?: string): Promise<boolean> => {
  try {
    const response = await authFetch(`${API_BASE_URL}/videos/${videoId}/like`, { method: 'POST' }, token);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('likeVideo HTTP 오류:', response.status, response.statusText, errorText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('likeVideo 네트워크 오류:', error);
    return false;
  }
};

// 영상 좋아요 취소
export const unlikeVideo = async (videoId: number, token?: string): Promise<boolean> => {
  try {
    const response = await authFetch(`${API_BASE_URL}/videos/${videoId}/like`, { method: 'DELETE' }, token);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('unlikeVideo HTTP 오류:', response.status, response.statusText, errorText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('unlikeVideo 네트워크 오류:', error);
    return false;
  }
};

// 영상 좋아요 상태 확인
export const isVideoLiked = async (videoId: number, token?: string): Promise<boolean> => {
  try {
    const response = await authFetch(`${API_BASE_URL}/videos/${videoId}/is-liked`, { method: 'GET' }, token);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('isVideoLiked HTTP 오류:', response.status, response.statusText, errorText);
      return false;
    }
    const result = await response.json();
    return result.data || false;
  } catch (error) {
    console.error('isVideoLiked 네트워크 오류:', error);
    return false;
  }
}; 