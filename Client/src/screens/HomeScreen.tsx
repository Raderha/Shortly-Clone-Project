import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView as SafeAreaInsetView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { 
  getAllVideos, 
  VideoResponse, 
  getFavoriteTags, 
  addFavoriteTag, 
  removeFavoriteTag, 
  searchVideosByTag 
} from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

// Stack 네비게이터의 스크린 이름 타입 정의
type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  VideoDetail: { videoId: number };
};

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { token } = useAuth();
  
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [favoriteTags, setFavoriteTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      await loadVideos();
    } else {
      // 새로운 태그 선택
      setSelectedTag(tagName);
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

  return (
    <SafeAreaInsetView style={styles.container} edges={["top", "left", "right", "bottom"]}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <Text style={styles.logo}>Shortly</Text>
        <View style={styles.headerIcons}>
          <Icon name="notifications-outline" size={24} style={styles.icon} />
          <Icon name="search-outline" size={24} style={styles.icon} />
        </View>
      </View>

      {/* 즐겨찾기 바 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesBar}>
        {favoriteTags.map((tag, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.favoriteBtn, 
              selectedTag === tag && styles.selectedFavoriteBtn
            ]}
            onPress={() => handleTagPress(tag)}
            onLongPress={() => {
              Alert.alert(
                '즐겨찾기 삭제',
                `"${tag}" 태그를 즐겨찾기에서 삭제하시겠습니까?`,
                [
                  { text: '취소', style: 'cancel' },
                  { text: '삭제', onPress: () => handleRemoveTag(tag), style: 'destructive' }
                ]
              );
            }}
          >
            <Text style={[
              styles.favoriteBtnText,
              selectedTag === tag && styles.selectedFavoriteBtnText
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => setIsModalVisible(true)}
        >
          <Icon name="add" size={20} />
        </TouchableOpacity>
      </ScrollView>

      {/* 선택된 태그 표시 */}
      {selectedTag && (
        <View style={styles.selectedTagContainer}>
          <Text style={styles.selectedTagText}>
            "{selectedTag}" 태그의 영상
          </Text>
          <TouchableOpacity onPress={() => handleTagPress(selectedTag)}>
            <Icon name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* 영상 그리드 */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B57" />
            <Text style={styles.loadingText}>영상을 불러오는 중...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadVideos}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : videos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="videocam-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {selectedTag ? `"${selectedTag}" 태그의 영상이 없습니다` : '업로드된 영상이 없습니다'}
            </Text>
          </View>
        ) : (
          videos.map((video, index) => (
            <TouchableOpacity 
              key={video.id} 
              style={styles.videoCard} 
              onPress={() => navigation.navigate('VideoDetail', { 
                videoId: video.id
              })}
            >
              {video.thumbnailUrl ? (
                <Image 
                  source={{ uri: `http://192.168.0.18:8080/uploads/thumbnails/${video.thumbnailUrl}` }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderThumbnail}>
                  <Icon name="videocam-outline" size={32} color="#ccc" />
                </View>
              )}
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.videoOwner}>{video.owner.username}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        {/* 하단 여백 */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* 하단 탭바 */}
      <View style={styles.tabBar}>
        <Icon name="home-outline" size={28} />
        <TouchableOpacity onPress={() => navigation.navigate('Upload')}>
          <Icon name="add-circle-outline" size={28} />
        </TouchableOpacity>
        <Icon name="folder-outline" size={28} />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="person-outline" size={28} />
        </TouchableOpacity>
      </View>

      {/* 태그 입력 모달 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>즐겨찾기 태그 추가</Text>
            <TextInput
              style={styles.tagInput}
              placeholder="태그 이름을 입력하세요"
              value={newTagName}
              onChangeText={setNewTagName}
              autoFocus={true}
              onSubmitEditing={handleAddTag}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setIsModalVisible(false);
                  setNewTagName('');
                }}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]} 
                onPress={handleAddTag}
              >
                <Text style={styles.addButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaInsetView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  logo: { fontSize: 22, fontWeight: 'bold', color: '#FF6B57', backgroundColor: '#fff', padding: 6, borderRadius: 6 },
  headerIcons: { flexDirection: 'row' },
  icon: { marginLeft: 16 },
  favoritesBar: { flexGrow: 0, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10 },
  favoriteBtn: { backgroundColor: '#eee', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, minHeight: 36 },
  favoriteBtnText: { fontSize: 13, color: '#333', fontWeight: '500' },
  selectedFavoriteBtn: { backgroundColor: '#FF6B57' },
  selectedFavoriteBtnText: { color: '#fff', fontWeight: '600' },
  addBtn: { backgroundColor: '#eee', borderRadius: 16, padding: 8, justifyContent: 'center', alignItems: 'center', minHeight: 36, minWidth: 36 },
  selectedTagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  selectedTagText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
      grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: 12,
      paddingBottom: 80, // 하단 탭바 침범 방지
    },
      videoCard: { width: '48%', aspectRatio: 1, backgroundColor: '#f5f5f5', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  thumbnail: { width: '100%', height: '70%', borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  placeholderThumbnail: { width: '100%', height: '70%', backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  videoInfo: { padding: 8, flex: 1 },
  videoTitle: { fontSize: 12, fontWeight: '600', marginBottom: 4, color: '#333' },
  videoOwner: { fontSize: 10, color: '#666' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#FF6B57', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { marginTop: 12, fontSize: 16, color: '#666', textAlign: 'center' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderColor: '#eee', paddingBottom: 12 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  tagInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#FF6B57',
    borderWidth: 1,
    borderColor: '#FF6B57',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});