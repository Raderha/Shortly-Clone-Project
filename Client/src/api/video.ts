import { API_ENDPOINTS } from './config';
import { authFetch, handleApiResponse, apiCallWithRetry } from './apiUtils';
import { VideoResponse, VideoSearchResponse, UploadResponse, LikeResponse } from './types';

// 사용자의 동영상 가져오기
export const getMyVideos = async (token?: string): Promise<VideoResponse[]> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.VIDEO.MY_VIDEOS, {
        method: 'GET',
        token,
      });
      
      if (!response.ok) {
        console.error('getMyVideos HTTP 오류:', response.status, response.statusText);
        return [];
      }
      
      const result = await handleApiResponse<VideoResponse[]>(response);
      return result.data || [];
    } catch (error) {
      console.error('getMyVideos 네트워크 오류:', error);
      return [];
    }
  });
};

// 좋아요한 영상 가져오기
export const getLikedVideos = async (token?: string): Promise<VideoResponse[]> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.VIDEO.LIKED_VIDEOS, {
        method: 'GET',
        token,
      });
      
      if (!response.ok) {
        console.error('getLikedVideos HTTP 오류:', response.status, response.statusText);
        return [];
      }
      
      const result = await handleApiResponse<VideoResponse[]>(response);
      return result.data || [];
    } catch (error) {
      console.error('getLikedVideos 네트워크 오류:', error);
      return [];
    }
  });
};

// 영상 좋아요
export const likeVideo = async (videoId: number, token?: string): Promise<LikeResponse> => {
  return apiCallWithRetry(async () => {
    try {
      console.log('[likeVideo] 좋아요 요청 시작:', videoId);
      const response = await authFetch(API_ENDPOINTS.VIDEO.LIKE(videoId), {
        method: 'POST',
        token,
      });
      
      console.log('[likeVideo] 응답 상태:', response.status, response.statusText);
      
      if (response.ok) {
        return {
          success: true,
          message: '좋아요가 추가되었습니다.',
          isLiked: true,
        };
      } else {
        const result = await handleApiResponse<LikeResponse>(response);
        return {
          success: false,
          message: result.message || '좋아요 처리에 실패했습니다.',
          isLiked: false,
        };
      }
    } catch (error) {
      console.error('likeVideo 네트워크 오류:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.',
        isLiked: false,
      };
    }
  });
};

// 영상 좋아요 취소
export const unlikeVideo = async (videoId: number, token?: string): Promise<LikeResponse> => {
  return apiCallWithRetry(async () => {
    try {
      console.log('[unlikeVideo] 좋아요 취소 요청 시작:', videoId);
      const response = await authFetch(API_ENDPOINTS.VIDEO.LIKE(videoId), {
        method: 'DELETE',
        token,
      });
      
      console.log('[unlikeVideo] 응답 상태:', response.status, response.statusText);
      
      if (response.ok) {
        return {
          success: true,
          message: '좋아요가 취소되었습니다.',
          isLiked: false,
        };
      } else {
        const result = await handleApiResponse<LikeResponse>(response);
        return {
          success: false,
          message: result.message || '좋아요 취소에 실패했습니다.',
          isLiked: true,
        };
      }
    } catch (error) {
      console.error('unlikeVideo 네트워크 오류:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.',
        isLiked: true,
      };
    }
  });
};

// 영상 좋아요 상태 확인
export const isVideoLiked = async (videoId: number, token?: string): Promise<boolean> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.VIDEO.IS_LIKED(videoId), {
        method: 'GET',
        token,
      });
      
      if (!response.ok) {
        console.error('isVideoLiked HTTP 오류:', response.status, response.statusText);
        return false;
      }
      
      const result = await handleApiResponse<boolean>(response);
      return result.data || false;
    } catch (error) {
      console.error('isVideoLiked 네트워크 오류:', error);
      return false;
    }
  });
};

// 동영상 삭제
export const deleteVideo = async (videoId: number, token?: string): Promise<{ success: boolean; message: string }> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.VIDEO.DELETE(videoId), {
        method: 'DELETE',
        token,
      });
      
      if (response.ok) {
        return {
          success: true,
          message: '영상이 삭제되었습니다.',
        };
      } else {
        const result = await handleApiResponse(response);
        return {
          success: false,
          message: result.message || '영상 삭제에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('deleteVideo 네트워크 오류:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.',
      };
    }
  });
};

// 영상 업로드 API
export const uploadVideo = async (formData: FormData, token?: string): Promise<UploadResponse> => {
  return apiCallWithRetry(async () => {
    try {
      console.log('[uploadVideo] 요청 시작');
      console.log('[uploadVideo] URL:', `${API_ENDPOINTS.VIDEO.UPLOAD}`);
      console.log('[uploadVideo] 토큰:', token ? '있음' : '없음');

      const response = await authFetch(API_ENDPOINTS.VIDEO.UPLOAD, {
        method: 'POST',
        body: formData,
        token,
      });

      console.log('[uploadVideo] 응답 상태:', response.status, response.statusText);
      
      const result = await handleApiResponse<VideoResponse>(response, '영상이 성공적으로 업로드되었습니다.');
      
      if (result.success) {
        return {
          success: true,
          message: '영상이 성공적으로 업로드되었습니다.',
          video: result.data,
        };
      }
      
      return {
        success: false,
        message: result.message || '영상 업로드에 실패했습니다.',
      };
    } catch (error) {
      console.error('[uploadVideo] 네트워크 오류:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.',
      };
    }
  });
};