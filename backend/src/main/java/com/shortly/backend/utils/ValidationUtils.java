package com.shortly.backend.utils;

import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

/**
 * 유효성 검사 유틸리티 클래스
 */
public final class ValidationUtils {
    
    /**
     * 파일 유효성 검사
     */
    public static ValidationResult validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ValidationResult.error("파일이 선택되지 않았습니다.");
        }
        
        // 파일 크기 검사
        if (file.getSize() > Constants.File.MAX_FILE_SIZE) {
            return ValidationResult.error(Constants.ErrorMessages.FILE_TOO_LARGE);
        }
        
        // 파일 확장자 검사
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidVideoFormat(originalFilename)) {
            return ValidationResult.error(Constants.ErrorMessages.INVALID_FILE_FORMAT);
        }
        
        return ValidationResult.success();
    }
    
    /**
     * 제목 유효성 검사
     */
    public static ValidationResult validateTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            return ValidationResult.error("제목을 입력해주세요.");
        }
        
        if (title.length() > Constants.Validation.MAX_TITLE_LENGTH) {
            return ValidationResult.error("제목은 " + Constants.Validation.MAX_TITLE_LENGTH + "자 이하여야 합니다.");
        }
        
        return ValidationResult.success();
    }
    
    /**
     * 설명 유효성 검사
     */
    public static ValidationResult validateDescription(String description) {
        if (description != null && description.length() > Constants.Validation.MAX_DESCRIPTION_LENGTH) {
            return ValidationResult.error("설명은 " + Constants.Validation.MAX_DESCRIPTION_LENGTH + "자 이하여야 합니다.");
        }
        
        return ValidationResult.success();
    }
    
    /**
     * 태그 유효성 검사
     */
    public static ValidationResult validateTags(List<String> tags) {
        if (tags == null) {
            return ValidationResult.success();
        }
        
        if (tags.size() > Constants.Validation.MAX_TAG_COUNT) {
            return ValidationResult.error("태그는 최대 " + Constants.Validation.MAX_TAG_COUNT + "개까지 입력할 수 있습니다.");
        }
        
        for (String tag : tags) {
            if (tag == null || tag.trim().isEmpty()) {
                return ValidationResult.error("빈 태그는 입력할 수 없습니다.");
            }
            
            if (tag.length() > Constants.Validation.MAX_TAG_LENGTH) {
                return ValidationResult.error("태그는 " + Constants.Validation.MAX_TAG_LENGTH + "자 이하여야 합니다.");
            }
        }
        
        return ValidationResult.success();
    }
    
    /**
     * 이메일 유효성 검사
     */
    public static ValidationResult validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return ValidationResult.error("이메일을 입력해주세요.");
        }
        
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (!email.matches(emailRegex)) {
            return ValidationResult.error("올바른 이메일 형식을 입력해주세요.");
        }
        
        return ValidationResult.success();
    }
    
    /**
     * 비밀번호 유효성 검사
     */
    public static ValidationResult validatePassword(String password) {
        if (password == null || password.length() < Constants.Validation.MIN_PASSWORD_LENGTH) {
            return ValidationResult.error("비밀번호는 " + Constants.Validation.MIN_PASSWORD_LENGTH + "자 이상이어야 합니다.");
        }
        
        if (password.length() > Constants.Validation.MAX_PASSWORD_LENGTH) {
            return ValidationResult.error("비밀번호는 " + Constants.Validation.MAX_PASSWORD_LENGTH + "자 이하여야 합니다.");
        }
        
        return ValidationResult.success();
    }
    
    /**
     * 비디오 파일 형식 검사
     */
    private static boolean isValidVideoFormat(String filename) {
        String extension = getFileExtension(filename);
        return Arrays.asList(Constants.File.SUPPORTED_VIDEO_FORMATS).contains(extension.toLowerCase());
    }
    
    /**
     * 이미지 파일 형식 검사
     */
    public static boolean isValidImageFormat(String filename) {
        String extension = getFileExtension(filename);
        return Arrays.asList(Constants.File.SUPPORTED_IMAGE_FORMATS).contains(extension.toLowerCase());
    }
    
    /**
     * 파일 확장자 추출
     */
    private static String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
    
    /**
     * 유효성 검사 결과 클래스
     */
    public static class ValidationResult {
        private final boolean isValid;
        private final String errorMessage;
        
        private ValidationResult(boolean isValid, String errorMessage) {
            this.isValid = isValid;
            this.errorMessage = errorMessage;
        }
        
        public static ValidationResult success() {
            return new ValidationResult(true, null);
        }
        
        public static ValidationResult error(String message) {
            return new ValidationResult(false, message);
        }
        
        public boolean isValid() {
            return isValid;
        }
        
        public String getErrorMessage() {
            return errorMessage;
        }
    }
    
    private ValidationUtils() {
        // 유틸리티 클래스이므로 인스턴스화 방지
    }
} 