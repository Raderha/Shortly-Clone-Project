import { APP_CONSTANTS } from '../constants';

// 파일 유효성 검사
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // 파일 크기 검사
  if (file.size > APP_CONSTANTS.MAX_FILE_SIZE) {
    return { isValid: false, error: '파일 크기가 너무 큽니다.' };
  }

  // 파일 확장자 검사
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !APP_CONSTANTS.SUPPORTED_VIDEO_FORMATS.includes(extension)) {
    return { isValid: false, error: '지원하지 않는 파일 형식입니다.' };
  }

  return { isValid: true };
};

// 제목 유효성 검사
export const validateTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title.trim()) {
    return { isValid: false, error: '제목을 입력해주세요.' };
  }

  if (title.length > APP_CONSTANTS.MAX_TITLE_LENGTH) {
    return { isValid: false, error: `제목은 ${APP_CONSTANTS.MAX_TITLE_LENGTH}자 이하여야 합니다.` };
  }

  return { isValid: true };
};

// 설명 유효성 검사
export const validateDescription = (description: string): { isValid: boolean; error?: string } => {
  if (description.length > APP_CONSTANTS.MAX_DESCRIPTION_LENGTH) {
    return { isValid: false, error: `설명은 ${APP_CONSTANTS.MAX_DESCRIPTION_LENGTH}자 이하여야 합니다.` };
  }

  return { isValid: true };
};

// 태그 유효성 검사
export const validateTags = (tags: string[]): { isValid: boolean; error?: string } => {
  if (tags.length > APP_CONSTANTS.MAX_TAG_COUNT) {
    return { isValid: false, error: `태그는 최대 ${APP_CONSTANTS.MAX_TAG_COUNT}개까지 입력할 수 있습니다.` };
  }

  for (const tag of tags) {
    if (!tag.trim()) {
      return { isValid: false, error: '빈 태그는 입력할 수 없습니다.' };
    }
  }

  return { isValid: true };
};

// 이메일 유효성 검사
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return { isValid: false, error: '이메일을 입력해주세요.' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: '올바른 이메일 형식을 입력해주세요.' };
  }

  return { isValid: true };
};

// 비밀번호 유효성 검사
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 6) {
    return { isValid: false, error: '비밀번호는 6자 이상이어야 합니다.' };
  }

  return { isValid: true };
}; 