// API 관련 상수
export const API_CONSTANTS = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  UPLOAD_TIMEOUT: 30000,
} as const;

// 앱 관련 상수
export const APP_CONSTANTS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_VIDEO_FORMATS: ['mp4', 'mov', 'avi', 'mkv'],
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'gif'],
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TAG_COUNT: 10,
} as const;

// UI 관련 상수
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  INFINITE_SCROLL_THRESHOLD: 0.8,
} as const;

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  UPLOAD_FAILED: '업로드에 실패했습니다.',
  INVALID_FILE: '지원하지 않는 파일 형식입니다.',
  FILE_TOO_LARGE: '파일 크기가 너무 큽니다.',
  LOGIN_REQUIRED: '로그인이 필요합니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;

// 성공 메시지 상수
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: '업로드가 완료되었습니다.',
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',
  PASSWORD_CHANGED: '비밀번호가 변경되었습니다.',
} as const; 