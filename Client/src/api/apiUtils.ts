import { API_CONFIG } from './config';
import { ApiRequestOptions, ApiError } from './types';

// 타임아웃을 포함한 fetch 래퍼
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    throw error;
  }
};

// 인증 토큰을 포함한 fetch 래퍼
export const authFetch = async (
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<Response> => {
  const {
    method = 'GET',
    headers = {},
    body,
    token,
    timeout = API_CONFIG.TIMEOUT,
  } = options;

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    if (body instanceof FormData) {
      // FormData인 경우 Content-Type을 제거 (브라우저가 자동 설정)
      delete requestHeaders['Content-Type'];
      requestOptions.body = body;
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetchWithTimeout(url, requestOptions, timeout);
    
    // 401 Unauthorized 응답 처리 (토큰 만료)
    if (response.status === 401) {
      console.log('토큰이 만료되었습니다. 로그아웃 처리가 필요합니다.');
      // 여기서 이벤트를 발생시켜 AuthContext에서 로그아웃 처리할 수 있습니다
    }
    
    return response;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};

// 공통 에러 처리 함수
export const handleApiError = (error: any, defaultMessage: string = '요청 처리 중 오류가 발생했습니다.'): ApiError => {
  if (error instanceof Response) {
    return {
      status: error.status,
      message: `HTTP 오류: ${error.status} ${error.statusText}`,
    };
  }
  
  if (error instanceof Error) {
    return {
      status: 0,
      message: error.message || defaultMessage,
    };
  }
  
  return {
    status: 0,
    message: defaultMessage,
  };
};

// JSON 응답 파싱 함수
export const parseJsonResponse = async (response: Response): Promise<any> => {
  const responseText = await response.text();
  
  if (!responseText) {
    return {};
  }
  
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error('JSON 파싱 오류:', error);
    console.error('파싱할 텍스트:', responseText);
    throw new Error('서버 응답을 처리할 수 없습니다.');
  }
};

// 성공/실패 응답 처리 함수
export const handleApiResponse = async <T>(
  response: Response,
  successMessage?: string
): Promise<{ success: boolean; message: string; data?: T }> => {
  const result = await parseJsonResponse(response);
  
  if (response.ok) {
    return {
      success: true,
      message: successMessage || result.message || '요청이 성공적으로 처리되었습니다.',
      data: result.data || result,
    };
  } else {
    return {
      success: false,
      message: result.message || `요청 실패 (${response.status})`,
    };
  }
};

// 재시도 로직을 포함한 API 호출 함수
export const apiCallWithRetry = async <T>(
  apiCall: () => Promise<T>,
  retryAttempts: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      console.warn(`API 호출 실패 (시도 ${attempt}/${retryAttempts}):`, error);
      
      if (attempt === retryAttempts) {
        break;
      }
      
      // 재시도 전 잠시 대기 (지수 백오프)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw lastError;
};

// 공통 API 요청 함수
export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  console.log('[apiUtils] API 요청 시작:', endpoint, options.method);
  const response = await authFetch(endpoint, options);
  console.log('[apiUtils] HTTP 응답 상태:', response.status, response.statusText);
  
  const result = await parseJsonResponse(response);
  console.log('[apiUtils] 파싱된 응답:', result);
  
  if (!response.ok) {
    console.error('[apiUtils] API 요청 실패:', response.status, result);
    throw new Error(result.message || `요청 실패 (${response.status})`);
  }
  
  // 백엔드 ApiResponse 구조에 맞게 처리
  // { success: boolean, message: string, data?: T }
  if (result && typeof result === 'object' && 'success' in result) {
    // data가 null이거나 undefined인 경우 전체 응답 객체를 반환
    const finalResult = (result.data !== undefined && result.data !== null) ? result.data : result;
    console.log('[apiUtils] 최종 반환 결과:', finalResult);
    return finalResult;
  }
  
  console.log('[apiUtils] 최종 반환 결과:', result);
  return result;
};