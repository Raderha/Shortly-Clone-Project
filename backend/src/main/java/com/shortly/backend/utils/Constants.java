package com.shortly.backend.utils;

/**
 * 애플리케이션 전역 상수 정의
 */
public final class Constants {
    
    // API 관련 상수
    public static final class Api {
        public static final int DEFAULT_PAGE_SIZE = 20;
        public static final int MAX_PAGE_SIZE = 100;
        public static final String DEFAULT_SORT_BY = "createdAt";
        public static final String DEFAULT_SORT_DIRECTION = "desc";
    }
    
    // 파일 업로드 관련 상수
    public static final class File {
        public static final long MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
        public static final String[] SUPPORTED_VIDEO_FORMATS = {".mp4", ".mov", ".avi", ".mkv"};
        public static final String[] SUPPORTED_IMAGE_FORMATS = {".jpg", ".jpeg", ".png", ".gif"};
        public static final String UPLOAD_DIR = "uploads/";
        public static final String VIDEO_DIR = "videos/";
        public static final String THUMBNAIL_DIR = "thumbnails/";
    }
    
    // 유효성 검사 관련 상수
    public static final class Validation {
        public static final int MAX_TITLE_LENGTH = 100;
        public static final int MAX_DESCRIPTION_LENGTH = 500;
        public static final int MAX_TAG_COUNT = 10;
        public static final int MAX_TAG_LENGTH = 20;
        public static final int MIN_PASSWORD_LENGTH = 6;
        public static final int MAX_PASSWORD_LENGTH = 50;
    }
    
    // JWT 관련 상수
    public static final class Jwt {
        public static final String SECRET_KEY = "shortly_jwt_secret_key_2024";
        public static final long ACCESS_TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24시간
        public static final String TOKEN_PREFIX = "Bearer ";
        public static final String HEADER_STRING = "Authorization";
    }
    
    // 에러 메시지 상수
    public static final class ErrorMessages {
        public static final String FILE_TOO_LARGE = "파일 크기가 너무 큽니다.";
        public static final String INVALID_FILE_FORMAT = "지원하지 않는 파일 형식입니다.";
        public static final String UPLOAD_FAILED = "업로드에 실패했습니다.";
        public static final String LOGIN_REQUIRED = "로그인이 필요합니다.";
        public static final String INVALID_CREDENTIALS = "이메일 또는 비밀번호가 올바르지 않습니다.";
        public static final String USER_NOT_FOUND = "사용자를 찾을 수 없습니다.";
        public static final String VIDEO_NOT_FOUND = "비디오를 찾을 수 없습니다.";
        public static final String DUPLICATE_EMAIL = "이미 사용 중인 이메일입니다.";
    }
    
    // 성공 메시지 상수
    public static final class SuccessMessages {
        public static final String UPLOAD_SUCCESS = "업로드가 완료되었습니다.";
        public static final String LOGIN_SUCCESS = "로그인되었습니다.";
        public static final String LOGOUT_SUCCESS = "로그아웃되었습니다.";
        public static final String PASSWORD_CHANGED = "비밀번호가 변경되었습니다.";
        public static final String LIKE_SUCCESS = "좋아요가 추가되었습니다.";
        public static final String UNLIKE_SUCCESS = "좋아요가 제거되었습니다.";
    }
    
    private Constants() {
        // 유틸리티 클래스이므로 인스턴스화 방지
    }
} 