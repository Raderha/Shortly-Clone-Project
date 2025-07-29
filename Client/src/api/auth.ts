import { API_ENDPOINTS } from './config';
import { authFetch, handleApiResponse, apiCallWithRetry } from './apiUtils';
import { SignupRequest, LoginRequest, AuthResponse } from './types';

// 회원가입 API
export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        body: data,
      });
      
      return await handleApiResponse<AuthResponse>(response, '회원가입이 완료되었습니다.');
    } catch (error) {
      console.error('회원가입 오류:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.',
      };
    }
  });
};

// 로그인 API
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  return apiCallWithRetry(async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: data,
      });
      
      const result = await handleApiResponse<AuthResponse>(response, '로그인되었습니다.');
      
      if (result.success && result.data) {
        return {
          success: true,
          message: '로그인되었습니다.',
          token: result.data.token,
          user: result.data.user,
        };
      }
      
      return result;
    } catch (error) {
      console.error('로그인 오류:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.',
      };
    }
  });
}; 