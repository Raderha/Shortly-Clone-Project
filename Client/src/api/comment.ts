import { API_ENDPOINTS } from './config';
import { authFetch, handleApiResponse, apiCallWithRetry } from './apiUtils';
import { CommentResponse, CommentRequest } from './types';

// 댓글 목록 가져오기
export const getComments = async (videoId: number, token?: string): Promise<CommentResponse[]> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.COMMENT.GET_BY_VIDEO(videoId), {
        method: 'GET',
        token,
      });
      
      if (!response.ok) {
        console.error('getComments HTTP 오류:', response.status, response.statusText);
        return [];
      }
      
      const result = await handleApiResponse<CommentResponse[]>(response);
      return result.data || [];
    } catch (error) {
      console.error('getComments 네트워크 오류:', error);
      return [];
    }
  });
};

// 댓글 작성
export const createComment = async (request: CommentRequest, token?: string): Promise<CommentResponse> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.COMMENT.CREATE, {
        method: 'POST',
        body: request,
        token,
      });
      
      const result = await handleApiResponse<CommentResponse>(response);
      return result.data;
    } catch (error) {
      console.error('createComment 네트워크 오류:', error);
      throw error;
    }
  });
};

// 댓글 수정
export const updateComment = async (commentId: number, request: CommentRequest, token?: string): Promise<CommentResponse> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.COMMENT.UPDATE(commentId), {
        method: 'PUT',
        body: request,
        token,
      });
      
      const result = await handleApiResponse<CommentResponse>(response);
      return result.data;
    } catch (error) {
      console.error('updateComment 네트워크 오류:', error);
      throw error;
    }
  });
};

// 댓글 삭제
export const deleteComment = async (commentId: number, token?: string): Promise<{ success: boolean; message: string }> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.COMMENT.DELETE(commentId), {
        method: 'DELETE',
        token,
      });
      
      if (response.ok) {
        return {
          success: true,
          message: '댓글이 삭제되었습니다.',
        };
      } else {
        const result = await handleApiResponse(response);
        return {
          success: false,
          message: result.message || '댓글 삭제에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('deleteComment 네트워크 오류:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.',
      };
    }
  });
}; 