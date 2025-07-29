import { API_ENDPOINTS } from './config';
import { authFetch, handleApiResponse, apiCallWithRetry } from './apiUtils';
import { VideoSearchResponse } from './types';

// 키워드로 영상 검색
export const searchVideosByKeyword = async (
  keyword: string, 
  page: number = 0, 
  size: number = 20,
  token?: string
): Promise<VideoSearchResponse> => {
  return apiCallWithRetry(async () => {
    try {
      const url = `${API_ENDPOINTS.VIDEO.SEARCH}?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
      console.log('[searchVideosByKeyword] 요청 URL:', url);
      
      const response = await authFetch(url, {
        method: 'GET',
        token,
      });
      
      if (!response.ok) {
        console.error('searchVideosByKeyword HTTP 오류:', response.status, response.statusText);
        return { videos: [], total: 0, page, perPage: size };
      }
      
      const result = await handleApiResponse<VideoSearchResponse>(response);
      console.log('[searchVideosByKeyword] 응답:', result);
      return result.data || { videos: [], total: 0, page, perPage: size };
    } catch (error) {
      console.error('searchVideosByKeyword 네트워크 오류:', error);
      return { videos: [], total: 0, page, perPage: size };
    }
  });
};

// 태그로 영상 검색
export const searchVideosByTag = async (
  tagName: string, 
  page: number = 0, 
  size: number = 20,
  token?: string
): Promise<VideoSearchResponse> => {
  return apiCallWithRetry(async () => {
    try {
      const url = `${API_ENDPOINTS.VIDEO.BY_TAG(tagName)}?page=${page}&size=${size}`;
      console.log('[searchVideosByTag] 요청 URL:', url);
      
      const response = await authFetch(url, {
        method: 'GET',
        token,
      });
      
      if (!response.ok) {
        console.error('searchVideosByTag HTTP 오류:', response.status, response.statusText);
        return { videos: [], total: 0, page, perPage: size };
      }
      
      const result = await handleApiResponse<VideoSearchResponse>(response);
      console.log('[searchVideosByTag] 응답:', result);
      return result.data || { videos: [], total: 0, page, perPage: size };
    } catch (error) {
      console.error('searchVideosByTag 네트워크 오류:', error);
      return { videos: [], total: 0, page, perPage: size };
    }
  });
};

// 모든 영상 가져오기
export const getAllVideos = async (
  page: number = 0, 
  size: number = 20,
  token?: string
): Promise<VideoSearchResponse> => {
  return apiCallWithRetry(async () => {
    try {
      const url = `${API_ENDPOINTS.VIDEO.ALL}?page=${page}&size=${size}`;
      console.log('[getAllVideos] 요청 URL:', url);
      console.log('[getAllVideos] 토큰:', token ? '있음' : '없음');
      
      const response = await authFetch(url, {
        method: 'GET',
        token,
      });
      
      if (!response.ok) {
        console.error('getAllVideos HTTP 오류:', response.status, response.statusText);
        return { videos: [], total: 0, page, perPage: size };
      }
      
      const result = await handleApiResponse<VideoSearchResponse>(response);
      console.log('[getAllVideos] 응답 전체:', result);
      
      if (result.data && Array.isArray(result.data.videos)) {
        console.log(`[getAllVideos] videos 배열 길이: ${result.data.videos.length}`);
        // 좋아요 상태 로깅
        result.data.videos.forEach((video, index) => {
          console.log(`[getAllVideos] 비디오 ${index + 1}: ID=${video.id}, 제목=${video.title}, 좋아요=${video.isLiked}`);
        });
      } else {
        console.log('[getAllVideos] videos 배열이 없음 또는 잘못된 응답');
      }
      
      return result.data || { videos: [], total: 0, page, perPage: size };
    } catch (error) {
      console.error('getAllVideos 네트워크 오류:', error);
      return { videos: [], total: 0, page, perPage: size };
    }
  });
};