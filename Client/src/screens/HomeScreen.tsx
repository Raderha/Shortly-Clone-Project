import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView as SafeAreaInsetView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// 커스텀 훅
import { useHomeScreen } from '../hooks';

// 컴포넌트들
import {
  HomeHeader,
  FavoritesBar,
  SelectedTagDisplay,
  VideoGrid,
  TabBar,
  SearchModal,
  TagModal,
} from '../components';

// Stack 네비게이터의 스크린 이름 타입 정의
type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  VideoDetail: { videoId: number };
};

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // 커스텀 훅으로 모든 비즈니스 로직 관리
  const {
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
    setSearchKeyword,
    setNewTagName,
  } = useHomeScreen();

  const handleVideoPress = (videoId: number) => {
    navigation.navigate('VideoDetail', { videoId });
  };

  const handleUploadPress = () => {
    navigation.navigate('Upload');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleClearTag = () => {
    handleTagPress(selectedTag!);
  };

  return (
    <SafeAreaInsetView style={styles.container} edges={["top", "left", "right", "bottom"]}>
      {/* 헤더 */}
      <HomeHeader onSearchPress={openSearchModal} />

      {/* 즐겨찾기 태그 바 */}
      <FavoritesBar
        favoriteTags={favoriteTags}
        selectedTag={selectedTag}
        onTagPress={handleTagPress}
        onRemoveTag={handleRemoveTag}
        onAddTagPress={openTagModal}
      />

      {/* 선택된 태그/검색 표시 */}
      <SelectedTagDisplay
        selectedTag={selectedTag}
        isSearchMode={isSearchMode}
        searchKeyword={searchKeyword}
        onClearTag={handleClearTag}
        onClearSearch={clearSearch}
      />

      {/* 비디오 그리드 */}
      <VideoGrid
        videos={videos}
        loading={loading}
        error={error}
        isSearchMode={isSearchMode}
        searchKeyword={searchKeyword}
        selectedTag={selectedTag}
        onVideoPress={handleVideoPress}
        onRetry={loadVideos}
      />

      {/* 하단 탭바 */}
      <TabBar
        onUploadPress={handleUploadPress}
        onProfilePress={handleProfilePress}
      />

      {/* 검색 모달 */}
      <SearchModal
        visible={isSearchModalVisible}
        searchKeyword={searchKeyword}
        onSearchKeywordChange={setSearchKeyword}
        onSearch={handleSearch}
        onClose={closeSearchModal}
      />

      {/* 태그 추가 모달 */}
      <TagModal
        visible={isModalVisible}
        newTagName={newTagName}
        onNewTagNameChange={setNewTagName}
        onAddTag={handleAddTag}
        onClose={closeTagModal}
      />
    </SafeAreaInsetView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
});