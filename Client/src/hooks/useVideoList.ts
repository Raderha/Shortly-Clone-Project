import { useState, useEffect } from 'react';
import { getAllVideos, VideoResponse, searchVideosByTag, searchVideosByKeyword } from '../api';

export const useVideoList = (token?: string) => {
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const result = await getAllVideos(0, 20, token);
      console.log('getAllVideos 응답:', result);
      setVideos(result.videos);
      setError(null);
    } catch (err) {
      console.error('영상 로드 오류:', err);
      setError('영상을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const searchByTag = async (tagName: string) => {
    try {
      setLoading(true);
      const result = await searchVideosByTag(tagName, 0, 20, token);
      setVideos(result.videos);
      setError(null);
    } catch (err) {
      console.error('태그별 영상 로드 오류:', err);
      setError('영상을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const searchByKeyword = async (keyword: string) => {
    try {
      setLoading(true);
      const result = await searchVideosByKeyword(keyword, 0, 20, token);
      setVideos(result.videos);
      setError(null);
    } catch (err) {
      console.error('키워드 검색 오류:', err);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const clearVideos = () => {
    setVideos([]);
    setError(null);
  };

  return {
    videos,
    loading,
    error,
    loadVideos,
    searchByTag,
    searchByKeyword,
    clearVideos,
  };
}; 