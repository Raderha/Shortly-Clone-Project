import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { 
  getAllVideos, 
  VideoResponse, 
  getFavoriteTags, 
  addFavoriteTag, 
  removeFavoriteTag, 
  searchVideosByTag,
  searchVideosByKeyword
} from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export const useHomeScreen = () => {
  const { token } = useAuth();
  
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [favoriteTags, setFavoriteTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 검색 관련 상태
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  
  // 태그 입력 모달 상태
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    loadVideos();
    loadFavoriteTags();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const result = await getAllVideos(0, 20);
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

  const loadFavoriteTags = async () => {
    if (!token) {
      console.log('[loadFavoriteTags] 토큰이 없어서 조회하지 않음');
      return;
    }
    
    try {
      console.log('[loadFavoriteTags] 토큰으로 태그 조회 시작');
      const tags = await getFavoriteTags(token);
      console.log('[loadFavoriteTags] 조회된 태그:', tags);
      setFavoriteTags(tags);
    } catch (err) {
      console.error('즐겨찾기 태그 로드 오류:', err);
    }
  };

  const handleAddTag = async () => {
    console.log('[handleAddTag] 태그 추가 시작, 토큰:', token ? '있음' : '없음');
    
    if (!token) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    if (!newTagName.trim()) {
      Alert.alert('오류', '태그 이름을 입력해주세요.');
      return;
    }

    try {
      console.log('[handleAddTag] API 호출 시작:', newTagName.trim());
      const success = await addFavoriteTag(newTagName.trim(), token);
      console.log('[handleAddTag] API 응답:', success);
      if (success) {
        setNewTagName('');
        setIsModalVisible(false);
        await loadFavoriteTags(); // 태그 목록 새로고침
        Alert.alert('성공', '즐겨찾기에 추가되었습니다.');
      } else {
        Alert.alert('오류', '태그 추가에 실패했습니다.');
      }
    } catch (err) {
      console.error('태그 추가 오류:', err);
      Alert.alert('오류', '태그 추가 중 오류가 발생했습니다.');
    }
  };

  const handleRemoveTag = async (tagName: string) => {
    if (!token) return;

    try {
      const success = await removeFavoriteTag(tagName, token);
      if (success) {
        await loadFavoriteTags(); // 태그 목록 새로고침
        if (selectedTag === tagName) {
          setSelectedTag(null);
          await loadVideos(); // 전체 영상으로 돌아가기
        }
      }
    } catch (err) {
      console.error('태그 삭제 오류:', err);
      Alert.alert('오류', '태그 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleTagPress = async (tagName: string) => {
    if (selectedTag === tagName) {
      // 같은 태그를 다시 누르면 전체 영상으로 돌아가기
      setSelectedTag(null);
      setIsSearchMode(false);
      setSearchKeyword('');
      await loadVideos();
    } else {
      // 새로운 태그 선택
      setSelectedTag(tagName);
      setIsSearchMode(false);
      setSearchKeyword('');
      try {
        setLoading(true);
        const result = await searchVideosByTag(tagName, 0, 20);
        setVideos(result.videos);
        setError(null);
      } catch (err) {
        console.error('태그별 영상 로드 오류:', err);
        setError('영상을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      Alert.alert('오류', '검색어를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setIsSearchMode(true);
      setSelectedTag(null);
      const result = await searchVideosByKeyword(searchKeyword.trim(), 0, 20);
      setVideos(result.videos);
      setError(null);
      setIsSearchModalVisible(false);
    } catch (err) {
      console.error('키워드 검색 오류:', err);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setIsSearchMode(false);
    setSearchKeyword('');
    setSelectedTag(null);
    await loadVideos();
  };

  const openSearchModal = () => setIsSearchModalVisible(true);
  const closeSearchModal = () => {
    setIsSearchModalVisible(false);
    setSearchKeyword('');
  };

  const openTagModal = () => setIsModalVisible(true);
  const closeTagModal = () => {
    setIsModalVisible(false);
    setNewTagName('');
  };

  return {
    // 상태
    videos,
    favoriteTags,
    selectedTag,
    loading,
    error,
    isSearchMode,
    searchKeyword,
    isSearchModalVisible,
    isModalVisible,
    newTagName,
    
    // 액션
    loadVideos,
    handleAddTag,
    handleRemoveTag,
    handleTagPress,
    handleSearch,
    clearSearch,
    openSearchModal,
    closeSearchModal,
    openTagModal,
    closeTagModal,
    
    // 상태 업데이트
    setSearchKeyword,
    setNewTagName,
  };
}; 