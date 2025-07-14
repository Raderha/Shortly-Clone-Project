package com.shortly.backend.domain.video.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {
    
    @Value("${ffmpeg.path:/usr/bin/ffmpeg}")
    private String ffmpegPath;
    
    @Value("${ffprobe.path:/usr/bin/ffprobe}")
    private String ffprobePath;
    
    private final String uploadDir = "uploads/videos/";
    private final String thumbnailDir = "uploads/thumbnails/";
    
    public String uploadVideo(MultipartFile file) {
        try {
            // 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            
            // 파일 저장
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload video", e);
        }
    }
    
    public String generateThumbnail(MultipartFile videoFile) {
        try {
            // 디렉토리 생성
            Path thumbnailPath = Paths.get(thumbnailDir);
            if (!Files.exists(thumbnailPath)) {
                Files.createDirectories(thumbnailPath);
            }
            
            // 썸네일 파일명 생성
            String thumbnailFilename = UUID.randomUUID().toString() + ".jpg";
            Path thumbnailFilePath = thumbnailPath.resolve(thumbnailFilename);
            
            // 임시로 비디오 파일 저장
            Path tempVideoPath = Paths.get(uploadDir, UUID.randomUUID().toString() + ".mp4");
            Files.copy(videoFile.getInputStream(), tempVideoPath);
            
            try {
                // FFmpeg를 사용하여 썸네일 생성 (시스템에 FFmpeg가 설치되어 있다고 가정)
                ProcessBuilder pb = new ProcessBuilder(
                    "ffmpeg", "-i", tempVideoPath.toString(),
                    "-ss", "00:00:01", // 1초 지점에서 썸네일 추출
                    "-vframes", "1",
                    "-vf", "scale=320:240", // 썸네일 크기 조정
                    thumbnailFilePath.toString()
                );
                
                Process process = pb.start();
                int exitCode = process.waitFor();
                
                if (exitCode == 0) {
                    // 임시 비디오 파일 삭제
                    Files.deleteIfExists(tempVideoPath);
                    return thumbnailFilename;
                } else {
                    // FFmpeg 실패 시 기본 썸네일 생성
                    createDefaultThumbnail(thumbnailFilePath);
                    Files.deleteIfExists(tempVideoPath);
                    return thumbnailFilename;
                }
            } catch (Exception e) {
                // FFmpeg가 없거나 실패한 경우 기본 썸네일 생성
                createDefaultThumbnail(thumbnailFilePath);
                Files.deleteIfExists(tempVideoPath);
                return thumbnailFilename;
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate thumbnail", e);
        }
    }

    public String generateThumbnailFromFile(Path videoPath) throws IOException, InterruptedException {
        Path thumbnailPath = Paths.get(thumbnailDir);
        if (!Files.exists(thumbnailPath)) {
            Files.createDirectories(thumbnailPath);
        }
        String thumbnailFilename = UUID.randomUUID().toString() + ".jpg";
        Path thumbnailFilePath = thumbnailPath.resolve(thumbnailFilename);

        try {
            ProcessBuilder pb = new ProcessBuilder(
                "ffmpeg", "-i", videoPath.toString(),
                "-ss", "00:00:01",
                "-vframes", "1",
                "-vf", "scale=320:240",
                thumbnailFilePath.toString()
            );
            Process process = pb.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return thumbnailFilename;
            } else {
                // FFmpeg 실패 시 기본 썸네일 생성
                createDefaultThumbnail(thumbnailFilePath);
                return thumbnailFilename;
            }
        } catch (Exception e) {
            // FFmpeg가 없거나 실패한 경우 기본 썸네일 생성
            createDefaultThumbnail(thumbnailFilePath);
            return thumbnailFilename;
        }
    }
    
    private void createDefaultThumbnail(Path thumbnailPath) throws IOException {
        // 간단한 기본 썸네일 이미지 생성 (1x1 픽셀 검은색 이미지)
        byte[] defaultThumbnail = {
            (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, // JPEG 헤더
            0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
            0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
            (byte) 0xFF, (byte) 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06,
            0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
            0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B,
            0x0B, 0x0C, 0x19, 0x12, 0x13, 0x0F, 0x14, 0x1D,
            0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
            0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C,
            0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31, 0x34,
            0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
            0x3C, 0x2E, 0x33, 0x34, 0x32, (byte) 0xFF, (byte) 0xC0, 0x00,
            0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01,
            0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
            (byte) 0xFF, (byte) 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08,
            (byte) 0xFF, (byte) 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00,
            0x3F, 0x00, 0x37, (byte) 0xFF, (byte) 0xD9
        };
        Files.write(thumbnailPath, defaultThumbnail);
    }
    
    public void deleteVideo(String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete video", e);
        }
    }
    
    public void deleteThumbnail(String filename) {
        try {
            Path filePath = Paths.get(thumbnailDir, filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete thumbnail", e);
        }
    }
} 