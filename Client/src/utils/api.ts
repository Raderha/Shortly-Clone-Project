// API 관련 유틸리티 함수들
export const SERVER_URL = 'http://192.168.0.18:8080';

export const getThumbnailUrl = (thumbnailUrl: string | null): string | null => {
  if (!thumbnailUrl) return null;
  return `${SERVER_URL}/api/videos/thumbnail/${thumbnailUrl}`;
};

export const getVideoUrl = (videoUrl: string): string => {
  return `${SERVER_URL}/api/videos/stream/${videoUrl}`;
}; 