import { useEffect } from 'react';
import { useVideoList } from './useVideoList';
import { useFavoriteTags } from './useFavoriteTags';
import { useSearch } from './useSearch';
import { useTagSelection } from './useTagSelection';

export const useHomeScreen = () => {
  const videoList = useVideoList();
  const favoriteTags = useFavoriteTags();
  const search = useSearch();
  const tagSelection = useTagSelection();

  // 초기 데이터 로드
  useEffect(() => {
    videoList.loadVideos();
  }, []);

  // 태그 선택 핸들러
  const handleTagPress = async (tagName: string) => {
    await tagSelection.handleTagPress(
      tagName,
      videoList.searchByTag,
      videoList.loadVideos
    );
  };

  // 검색 핸들러
  const handleSearch = async () => {
    await search.handleSearch(videoList.searchByKeyword);
  };

  // 검색 초기화
  const clearSearch = async () => {
    await search.clearSearch(videoList.loadVideos);
    tagSelection.clearSelectedTag();
  };

  // 태그 삭제 시 선택된 태그가 삭제되는 경우 처리
  const handleRemoveTag = async (tagName: string) => {
    await favoriteTags.handleRemoveTag(tagName);
    if (tagSelection.selectedTag === tagName) {
      tagSelection.clearSelectedTag();
      await videoList.loadVideos();
    }
  };

  return {
    // 비디오 관련
    videos: videoList.videos,
    loading: videoList.loading,
    error: videoList.error,
    loadVideos: videoList.loadVideos,

    // 즐겨찾기 태그 관련
    favoriteTags: favoriteTags.favoriteTags,
    isModalVisible: favoriteTags.isModalVisible,
    newTagName: favoriteTags.newTagName,
    handleAddTag: favoriteTags.handleAddTag,
    handleRemoveTag,
    openTagModal: favoriteTags.openTagModal,
    closeTagModal: favoriteTags.closeTagModal,
    setNewTagName: favoriteTags.setNewTagName,

    // 검색 관련
    isSearchMode: search.isSearchMode,
    searchKeyword: search.searchKeyword,
    isSearchModalVisible: search.isSearchModalVisible,
    handleSearch,
    clearSearch,
    openSearchModal: search.openSearchModal,
    closeSearchModal: search.closeSearchModal,
    setSearchKeyword: search.setSearchKeyword,

    // 태그 선택 관련
    selectedTag: tagSelection.selectedTag,
    handleTagPress,
  };
}; 