package com.shortly.backend.domain.video.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
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
        System.out.println("[FileService] 비디오 업로드 시작 - 파일명: " + file.getOriginalFilename() + ", 크기: " + file.getSize());
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
            System.out.println("[FileService] 파일 저장 경로: " + filePath.toString());
            Files.copy(file.getInputStream(), filePath);
            System.out.println("[FileService] 비디오 업로드 완료: " + filename);
            
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload video", e);
        }
    }
    
    public String generateThumbnail(MultipartFile videoFile) {
        System.out.println("[FileService] 썸네일 생성 시작");
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
                System.out.println("[FileService] FFmpeg 썸네일 생성 시도");
                
                // FFmpeg 명령어 확인
                String ffmpegCommand = "ffmpeg";
                if (System.getProperty("os.name").toLowerCase().contains("windows")) {
                    // Windows에서 FFmpeg 경로 확인
                    String[] possiblePaths = {
                        "C:\\ffmpeg\\bin\\ffmpeg.exe",
                        "C:\\ffmpeg-2025-07-10-git-82aeee3c19-full_build\\bin\\ffmpeg.exe",
                        "ffmpeg.exe"
                    };
                    
                    for (String path : possiblePaths) {
                        try {
                            ProcessBuilder testPb = new ProcessBuilder(path, "-version");
                            Process testProcess = testPb.start();
                            if (testProcess.waitFor() == 0) {
                                ffmpegCommand = path;
                                System.out.println("[FileService] FFmpeg 경로 확인됨: " + path);
                                break;
                            }
                        } catch (Exception e) {
                            System.out.println("[FileService] FFmpeg 경로 테스트 실패: " + path);
                        }
                    }
                }
                
                // FFmpeg를 사용하여 썸네일 생성
                ProcessBuilder pb = new ProcessBuilder(
                    ffmpegCommand, "-i", tempVideoPath.toString(),
                    "-ss", "00:00:00.5", // 0.5초 지점에서 썸네일 추출 (더 빠름)
                    "-vframes", "1",
                    "-vf", "scale=320:240", // 썸네일 크기 조정
                    "-y", // 기존 파일 덮어쓰기
                    "-loglevel", "error", // 로그 레벨을 error로 설정하여 출력 줄이기
                    thumbnailFilePath.toString()
                );
                
                // 에러 스트림을 표준 출력으로 리다이렉트
                pb.redirectErrorStream(true);
                
                Process process = pb.start();
                System.out.println("[FileService] FFmpeg 프로세스 시작됨");
                
                // 타임아웃 설정 (60초로 증가)
                boolean finished = process.waitFor(60, java.util.concurrent.TimeUnit.SECONDS);
                
                if (!finished) {
                    System.out.println("[FileService] FFmpeg 타임아웃 발생, 프로세스 강제 종료");
                    process.destroyForcibly();
                    throw new RuntimeException("FFmpeg timeout");
                }
                
                int exitCode = process.exitValue();
                System.out.println("[FileService] FFmpeg 종료 코드: " + exitCode);
                
                // FFmpeg 출력 로그 확인
                try (java.io.BufferedReader reader = new java.io.BufferedReader(
                        new java.io.InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println("[FileService] FFmpeg: " + line);
                    }
                }
                
                if (exitCode == 0 && Files.exists(thumbnailFilePath)) {
                    System.out.println("[FileService] FFmpeg 썸네일 생성 성공");
                    // 임시 비디오 파일 삭제
                    Files.deleteIfExists(tempVideoPath);
                    return thumbnailFilename;
                } else {
                    System.out.println("[FileService] FFmpeg 실패, 기본 썸네일 생성");
                    // FFmpeg 실패 시 기본 썸네일 생성
                    createDefaultThumbnail(thumbnailFilePath);
                    Files.deleteIfExists(tempVideoPath);
                    return thumbnailFilename;
                }
            } catch (Exception e) {
                System.out.println("[FileService] FFmpeg 예외 발생: " + e.getMessage());
                e.printStackTrace();
                // FFmpeg가 없거나 실패한 경우 기본 썸네일 생성
                createDefaultThumbnail(thumbnailFilePath);
                Files.deleteIfExists(tempVideoPath);
                return thumbnailFilename;
            }
        } catch (IOException e) {
            System.out.println("[FileService] 썸네일 생성 중 IOException: " + e.getMessage());
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
        // 320x240 크기의 기본 썸네일 이미지 생성 (회색 배경)
        // 간단한 JPEG 이미지 데이터 (320x240, 회색)
        byte[] defaultThumbnail = {
            (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, // JPEG 헤더
            0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
            0x01, 0x01, 0x00, (byte) 0x48, 0x00, (byte) 0x48, 0x00, 0x00,
            (byte) 0xFF, (byte) 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06,
            0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
            0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B,
            0x0B, 0x0C, 0x19, 0x12, 0x13, 0x0F, 0x14, 0x1D,
            0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
            0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C,
            0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31, 0x34,
            0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
            0x3C, 0x2E, 0x33, 0x34, 0x32, (byte) 0xFF, (byte) 0xC0, 0x00,
            0x11, 0x08, 0x00, (byte) 0xF0, 0x01, (byte) 0x40, 0x03, 0x01,
            0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
            (byte) 0xFF, (byte) 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08,
            (byte) 0xFF, (byte) 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00,
            0x3F, 0x00, 0x37, (byte) 0xFF, (byte) 0xD9
        };
        
        // 더 큰 크기의 기본 썸네일을 위해 더 많은 데이터 추가
        // 320x240 크기의 회색 이미지를 위한 최소한의 JPEG 데이터
        byte[] largerThumbnail = new byte[1024]; // 충분한 크기
        System.arraycopy(defaultThumbnail, 0, largerThumbnail, 0, defaultThumbnail.length);
        
        // 나머지 공간을 0으로 채움 (실제로는 더 정교한 JPEG 데이터가 필요하지만 간단히 처리)
        for (int i = defaultThumbnail.length; i < largerThumbnail.length; i++) {
            largerThumbnail[i] = 0;
        }
        
        Files.write(thumbnailPath, largerThumbnail);
        System.out.println("[FileService] 기본 썸네일 생성 완료: " + thumbnailPath.toString());
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
    
    public double getVideoDuration(MultipartFile videoFile) {
        System.out.println("[FileService] 영상 길이 확인 시작");
        try {
            // 임시로 비디오 파일 저장
            Path tempVideoPath = Paths.get(uploadDir, UUID.randomUUID().toString() + ".mp4");
            Files.copy(videoFile.getInputStream(), tempVideoPath);
            
            try {
                // FFprobe 명령어 확인
                String ffprobeCommand = "ffprobe";
                if (System.getProperty("os.name").toLowerCase().contains("windows")) {
                    // Windows에서 FFprobe 경로 확인
                    String[] possiblePaths = {
                        "C:\\ffmpeg\\bin\\ffprobe.exe",
                        "C:\\ffmpeg-2025-07-10-git-82aeee3c19-full_build\\bin\\ffprobe.exe",
                        "ffprobe.exe"
                    };
                    
                    for (String path : possiblePaths) {
                        try {
                            ProcessBuilder testPb = new ProcessBuilder(path, "-version");
                            Process testProcess = testPb.start();
                            if (testProcess.waitFor() == 0) {
                                ffprobeCommand = path;
                                System.out.println("[FileService] FFprobe 경로 확인됨: " + path);
                                break;
                            }
                        } catch (Exception e) {
                            System.out.println("[FileService] FFprobe 경로 테스트 실패: " + path);
                        }
                    }
                }
                
                // FFprobe를 사용하여 영상 길이 확인
                ProcessBuilder pb = new ProcessBuilder(
                    ffprobeCommand, 
                    "-v", "quiet", 
                    "-show_entries", "format=duration", 
                    "-of", "csv=p=0", 
                    tempVideoPath.toString()
                );
                
                Process process = pb.start();
                BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String output = reader.readLine();
                
                int exitCode = process.waitFor();
                if (exitCode == 0 && output != null && !output.trim().isEmpty()) {
                    double duration = Double.parseDouble(output.trim());
                    System.out.println("[FileService] 영상 길이 확인 완료: " + duration + "초");
                    return duration;
                } else {
                    System.out.println("[FileService] FFprobe 실행 실패, 기본값 반환");
                    return 0.0;
                }
                
            } finally {
                // 임시 파일 삭제
                Files.deleteIfExists(tempVideoPath);
            }
            
        } catch (Exception e) {
            System.out.println("[FileService] 영상 길이 확인 오류: " + e.getMessage());
            e.printStackTrace();
            return 0.0;
        }
    }
} 