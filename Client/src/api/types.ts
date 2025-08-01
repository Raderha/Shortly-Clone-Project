// 기본 API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// 인증 관련 타입
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
  user?: UserInfo;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
}

// 비디오 관련 타입
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  profilePicture?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoResponse {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  owner: UserResponse;
  tags: string[];
  createdAt: string;
  isLiked?: boolean; // 좋아요 상태 추가
}

export interface VideoUploadRequest {
  title: string;
  description: string;
  tags: string[];
  videoFile: File;
  thumbnailFile?: File;
}

export interface VideoSearchResponse {
  videos: VideoResponse[];
  total: number;
  page: number;
  perPage: number;
}

// 사용자 관련 타입
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 검색 관련 타입
export interface SearchParams {
  keyword?: string;
  tag?: string;
  page?: number;
  size?: number;
}

// API 요청 옵션 타입
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
  timeout?: number;
}

// 에러 타입
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// 업로드 관련 타입
export interface UploadResponse {
  success: boolean;
  message: string;
  video?: VideoResponse;
}

// 좋아요 관련 타입
export interface LikeResponse {
  success: boolean;
  message: string;
  isLiked?: boolean;
}

// 댓글 관련 타입
export interface CommentRequest {
  content: string;
  videoId: number;
}

export interface CommentResponse {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
    profilePicture?: string;
  };
  videoId: number;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
}