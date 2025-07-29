package com.shortly.backend.utils;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * 파일 처리 유틸리티 클래스
 */
public final class FileUtils {
    
    /**
     * 파일 확장자 추출
     */
    public static String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
    
    /**
     * 파일명에서 확장자 제거
     */
    public static String getFileNameWithoutExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return filename;
        }
        return filename.substring(0, filename.lastIndexOf("."));
    }
    
    /**
     * 고유한 파일명 생성
     */
    public static String generateUniqueFileName(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        return UUID.randomUUID().toString() + extension;
    }
    
    /**
     * 파일 크기 포맷팅
     */
    public static String formatFileSize(long bytes) {
        if (bytes == 0) return "0 Bytes";
        
        final String[] units = {"Bytes", "KB", "MB", "GB"};
        int digitGroups = (int) (Math.log10(bytes) / Math.log10(1024));
        
        return String.format("%.1f %s", bytes / Math.pow(1024, digitGroups), units[digitGroups]);
    }
    
    /**
     * 디렉토리 생성
     */
    public static void createDirectoryIfNotExists(String directoryPath) throws IOException {
        Path path = Paths.get(directoryPath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
    }
    
    /**
     * 파일 삭제
     */
    public static boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            return false;
        }
    }
    
    /**
     * 파일 존재 여부 확인
     */
    public static boolean fileExists(String filePath) {
        return Files.exists(Paths.get(filePath));
    }
    
    /**
     * 파일 크기 확인
     */
    public static long getFileSize(String filePath) {
        try {
            return Files.size(Paths.get(filePath));
        } catch (IOException e) {
            return 0;
        }
    }
    
    /**
     * 업로드 디렉토리 경로 생성
     */
    public static String getUploadDirectory() {
        return Constants.File.UPLOAD_DIR;
    }
    
    /**
     * 비디오 디렉토리 경로 생성
     */
    public static String getVideoDirectory() {
        return getUploadDirectory() + Constants.File.VIDEO_DIR;
    }
    
    /**
     * 썸네일 디렉토리 경로 생성
     */
    public static String getThumbnailDirectory() {
        return getUploadDirectory() + Constants.File.THUMBNAIL_DIR;
    }
    
    /**
     * 파일 저장
     */
    public static String saveFile(MultipartFile file, String directory) throws IOException {
        createDirectoryIfNotExists(directory);
        
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = generateUniqueFileName(originalFilename);
        String filePath = directory + uniqueFilename;
        
        File dest = new File(filePath);
        file.transferTo(dest);
        
        return uniqueFilename;
    }
    
    /**
     * 파일 경로 정규화
     */
    public static String normalizePath(String path) {
        return path.replace("\\", "/").replaceAll("/+", "/");
    }
    
    /**
     * 안전한 파일명 생성 (특수문자 제거)
     */
    public static String sanitizeFileName(String fileName) {
        if (fileName == null) return "";
        
        // 특수문자 제거 및 공백을 언더스코어로 변경
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_")
                     .replaceAll("_+", "_")
                     .trim();
    }
    
    private FileUtils() {
        // 유틸리티 클래스이므로 인스턴스화 방지
    }
} 