import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getFavoriteTags, addFavoriteTag, removeFavoriteTag } from '../api';
import { useAuth } from '../contexts/AuthContext';

export const useFavoriteTags = () => {
  const { token } = useAuth();
  const [favoriteTags, setFavoriteTags] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    if (token) {
      loadFavoriteTags();
    } else {
      setFavoriteTags([]);
    }
  }, [token]);

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
      }
    } catch (err) {
      console.error('태그 삭제 오류:', err);
      Alert.alert('오류', '태그 삭제 중 오류가 발생했습니다.');
    }
  };

  const openTagModal = () => setIsModalVisible(true);
  const closeTagModal = () => {
    setIsModalVisible(false);
    setNewTagName('');
  };

  return {
    favoriteTags,
    isModalVisible,
    newTagName,
    handleAddTag,
    handleRemoveTag,
    openTagModal,
    closeTagModal,
    setNewTagName,
    loadFavoriteTags,
  };
}; 