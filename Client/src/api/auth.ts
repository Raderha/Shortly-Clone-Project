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