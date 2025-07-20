import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'http://192.168.0.18:8080/api';

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

// 동영상 삭제
export const deleteVideo = async (videoId: number, token?: string): Promise<boolean> => {
  try {
    const response = await authFetch(`${API_BASE_URL}/videos/${videoId}`, { method: 'DELETE' }, token);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('deleteVideo HTTP 오류:', response.status, response.statusText, errorText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('deleteVideo 네트워크 오류:', error);
    return false;
  }
};

// 즐겨찾기 태그 추가
export const addFavoriteTag = async (tagName: string, token?: string): Promise<boolean> => {
  try {
    console.log('[addFavoriteTag] 태그 추가 시작:', tagName, '토큰:', token ? '있음' : '없음');
    const response = await authFetch(`${API_BASE_URL}/user/favorites/tags?tagName=${encodeURIComponent(tagName)}`, { method: 'POST' }, token);
    console.log('[addFavoriteTag] 응답 상태:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('addFavoriteTag HTTP 오류:', response.status, response.statusText, errorText);
      return false;
    }
    console.log('[addFavoriteTag] 태그 추가 성공');
    return true;
  } catch (error) {
    console.error('addFavoriteTag 네트워크 오류:', error);
    return false;
  }
};

// 즐겨찾기 태그 목록 가져오기
export const getFavoriteTags = async (token?: string): Promise<string[]> => {
  try {
    console.log('[getFavoriteTags] 태그 목록 조회 시작, 토큰:', token ? '있음' : '없음');
    const response = await authFetch(`${API_BASE_URL}/user/favorites/tags`, { method: 'GET' }, token);
    console.log('[getFavoriteTags] 응답 상태:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('getFavoriteTags HTTP 오류:', response.status, response.statusText, errorText);
      return [];
    }
    const result = await response.json();
    console.log('[getFavoriteTags] 응답 데이터:', result);
    return result.data || [];
  } catch (error) {
    console.error('getFavoriteTags 네트워크 오류:', error);
    return [];
  }
};

// 즐겨찾기 태그 삭제
export const removeFavoriteTag = async (tagName: string, token?: string): Promise<boolean> => {
  try {
    const response = await authFetch(`${API_BASE_URL}/user/favorites/tags/${encodeURIComponent(tagName)}`, { method: 'DELETE' }, token);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('removeFavoriteTag HTTP 오류:', response.status, response.statusText, errorText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('removeFavoriteTag 네트워크 오류:', error);
    return false;
  }
};

// 키워드로 영상 검색
export const searchVideosByKeyword = async (keyword: string, page: number = 0, size: number = 20): Promise<{
  videos: VideoResponse[];
  total: number;
  page: number;
  perPage: number;
}> => {
  try {
    const url = `${API_BASE_URL}/videos/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
    console.log('[searchVideosByKeyword] 요청 URL:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('searchVideosByKeyword HTTP 오류:', response.status, response.statusText, errorText);
      return { videos: [], total: 0, page, perPage: size };
    }
    
    const result = await response.json();
    console.log('[searchVideosByKeyword] 응답:', result);
    return result || { videos: [], total: 0, page, perPage: size };
  } catch (error) {
    console.error('searchVideosByKeyword 네트워크 오류:', error);
    return { videos: [], total: 0, page, perPage: size };
  }
};

// 태그로 영상 검색
export const searchVideosByTag = async (tagName: string, page: number = 0, size: number = 20): Promise<{
  videos: VideoResponse[];
  total: number;
  page: number;
  perPage: number;
}> => {
  try {
    const url = `${API_BASE_URL}/videos/tag/${encodeURIComponent(tagName)}?page=${page}&size=${size}`;
    console.log('[searchVideosByTag] 요청 URL:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('searchVideosByTag HTTP 오류:', response.status, response.statusText, errorText);
      return { videos: [], total: 0, page, perPage: size };
    }
    
    const result = await response.json();
    console.log('[searchVideosByTag] 응답:', result);
    return result || { videos: [], total: 0, page, perPage: size };
  } catch (error) {
    console.error('searchVideosByTag 네트워크 오류:', error);
    return { videos: [], total: 0, page, perPage: size };
  }
};

// 모든 영상 가져오기
export const getAllVideos = async (page: number = 0, size: number = 20): Promise<{
  videos: VideoResponse[];
  total: number;
  page: number;
  perPage: number;
}> => {
  try {
    const url = `${API_BASE_URL}/videos?page=${page}&size=${size}`;
    console.log('[getAllVideos] 요청 URL:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('getAllVideos HTTP 오류:', response.status, response.statusText, errorText);
      return { videos: [], total: 0, page, perPage: size };
    }
    
    const result = await response.json();
    console.log('[getAllVideos] 응답 전체:', result);
    if (result && Array.isArray(result.videos)) {
      console.log(`[getAllVideos] videos 배열 길이: ${result.videos.length}`);
    } else {
      console.log('[getAllVideos] videos 배열이 없음 또는 잘못된 응답');
    }
    // result.data가 아니라 result 자체를 반환
    return result || { videos: [], total: 0, page, perPage: size };
  } catch (error) {
    console.error('getAllVideos 네트워크 오류:', error);
    return { videos: [], total: 0, page, perPage: size };
  }
};

// 영상 업로드 API
export const uploadVideo = async (formData: FormData, token?: string): Promise<{
  success: boolean;
  message: string;
  video?: VideoResponse;
}> => {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // FormData를 사용할 때는 Content-Type을 설정하지 않습니다 (브라우저가 자동으로 설정)

    console.log('[uploadVideo] 요청 시작');
    console.log('[uploadVideo] URL:', `${API_BASE_URL}/videos`);
    console.log('[uploadVideo] 토큰:', token ? '있음' : '없음');

    const response = await fetch(`${API_BASE_URL}/videos`, {
      method: 'POST',
      headers,
      body: formData,
    });

    console.log('[uploadVideo] 응답 상태:', response.status, response.statusText);
    
    // 응답 텍스트를 먼저 확인
    const responseText = await response.text();
    console.log('[uploadVideo] 응답 텍스트:', responseText);

    let result;
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('[uploadVideo] JSON 파싱 오류:', parseError);
      console.error('[uploadVideo] 파싱할 텍스트:', responseText);
      return {
        success: false,
        message: '서버 응답을 처리할 수 없습니다.',
      };
    }
    
    if (response.ok) {
      return {
        success: true,
        message: '영상이 성공적으로 업로드되었습니다.',
        video: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || `업로드 실패 (${response.status})`,
      };
    }
  } catch (error) {
    console.error('[uploadVideo] 네트워크 오류:', error);
    return {
      success: false,
      message: '네트워크 오류가 발생했습니다.',
    };
  }
}; 