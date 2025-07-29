import { API_ENDPOINTS } from './config';
import { authFetch, handleApiResponse, apiCallWithRetry } from './apiUtils';
import { ChangePasswordRequest } from './types';

// 비밀번호 변경 API
export const changePassword = async (
  data: ChangePasswordRequest,
  token?: string
): Promise<{ success: boolean; message: string }> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
        method: 'POST',
        body: data,
        token,
      });
      
      return await handleApiResponse(response, '비밀번호가 변경되었습니다.');
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      return { success: false, message: '네트워크 오류가 발생했습니다.' };
    }
  });
};

// 즐겨찾기 태그 추가
export const addFavoriteTag = async (tagName: string, token?: string): Promise<boolean> => {
  return apiCallWithRetry(async () => {
    try {
      console.log('[addFavoriteTag] 태그 추가 시작:', tagName, '토큰:', token ? '있음' : '없음');
      
      const url = `${API_ENDPOINTS.USER.FAVORITE_TAGS}?tagName=${encodeURIComponent(tagName)}`;
      const response = await authFetch(url, {
        method: 'POST',
        token,
      });
      
      console.log('[addFavoriteTag] 응답 상태:', response.status);
      
      if (!response.ok) {
        console.error('addFavoriteTag HTTP 오류:', response.status, response.statusText);
        return false;
      }
      
      console.log('[addFavoriteTag] 태그 추가 성공');
      return true;
    } catch (error) {
      console.error('addFavoriteTag 네트워크 오류:', error);
      return false;
    }
  });
};

// 즐겨찾기 태그 목록 가져오기
export const getFavoriteTags = async (token?: string): Promise<string[]> => {
  return apiCallWithRetry(async () => {
    try {
      console.log('[getFavoriteTags] 태그 목록 조회 시작, 토큰:', token ? '있음' : '없음');
      
      const response = await authFetch(API_ENDPOINTS.USER.FAVORITE_TAGS, {
        method: 'GET',
        token,
      });
      
      console.log('[getFavoriteTags] 응답 상태:', response.status);
      
      if (!response.ok) {
        console.error('getFavoriteTags HTTP 오류:', response.status, response.statusText);
        return [];
      }
      
      const result = await handleApiResponse<string[]>(response);
      console.log('[getFavoriteTags] 응답 데이터:', result);
      return result.data || [];
    } catch (error) {
      console.error('getFavoriteTags 네트워크 오류:', error);
      return [];
    }
  });
};

// 즐겨찾기 태그 삭제
export const removeFavoriteTag = async (tagName: string, token?: string): Promise<boolean> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.USER.FAVORITE_TAG(tagName), {
        method: 'DELETE',
        token,
      });
      
      return response.ok;
    } catch (error) {
      console.error('removeFavoriteTag 네트워크 오류:', error);
      return false;
    }
  });
};