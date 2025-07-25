import { useState } from 'react';
import { Alert } from 'react-native';

export const useSearch = () => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const handleSearch = async (searchFunction: (keyword: string) => Promise<void>) => {
    if (!searchKeyword.trim()) {
      Alert.alert('오류', '검색어를 입력해주세요.');
      return;
    }

    try {
      setIsSearchMode(true);
      await searchFunction(searchKeyword.trim());
      setIsSearchModalVisible(false);
    } catch (err) {
      console.error('검색 오류:', err);
      Alert.alert('오류', '검색 중 오류가 발생했습니다.');
    }
  };

  const clearSearch = async (loadVideosFunction: () => Promise<void>) => {
    setIsSearchMode(false);
    setSearchKeyword('');
    await loadVideosFunction();
  };

  const openSearchModal = () => setIsSearchModalVisible(true);
  const closeSearchModal = () => {
    setIsSearchModalVisible(false);
    setSearchKeyword('');
  };

  return {
    isSearchMode,
    searchKeyword,
    isSearchModalVisible,
    handleSearch,
    clearSearch,
    openSearchModal,
    closeSearchModal,
    setSearchKeyword,
    setIsSearchMode,
  };
}; 