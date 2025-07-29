import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  ScrollView, 
  Alert,
  RefreshControl 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { getMyVideos, deleteVideo, VideoResponse } from '../api';

// Stack 네비게이터의 스크린 이름 타입 정의
type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  VideoDetail: { videoId: number; allVideos: VideoResponse[]; currentIndex: number };
  DetailOption: undefined; 
  MyVideo: undefined;
};

const { width } = Dimensions.get('window');
const THUMB_SIZE = 120;
const THUMB_GAP = 12;
const ITEMS_PER_ROW = 3;

const MyVideoScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, token } = useAuth();
  const [myVideos, setMyVideos] = useState<VideoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVideos = async () => {
    try {
      const videosData = await getMyVideos(token || undefined);
      setMyVideos(videosData);
    } catch (error) {
      console.error('동영상 가져오기 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVideos();
    setRefreshing(false);
  };

  const handleDeleteVideo = async (videoId: number, videoTitle: string) => {
    Alert.alert(
      '동영상 삭제',
      `"${videoTitle}" 동영상을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteVideo(videoId, token || undefined);
              if (success) {
                setMyVideos(prev => prev.filter(video => video.id !== videoId));
                Alert.alert('삭제 완료', '동영상이 삭제되었습니다.');
              } else {
                Alert.alert('삭제 실패', '동영상 삭제에 실패했습니다.');
              }
            } catch (error) {
              console.error('동영상 삭제 오류:', error);
              Alert.alert('삭제 실패', '동영상 삭제 중 오류가 발생했습니다.');
            }
          }
        }
      ]
    );
  };

  const renderVideoItem = (video: VideoResponse, index: number) => (
    <View key={video.id} style={styles.videoItem}>
      <TouchableOpacity 
        style={styles.videoThumbnail}
        onPress={() => navigation.navigate('VideoDetail', { 
          videoId: video.id, 
          allVideos: myVideos, 
          currentIndex: index 
        })}
      >
        {video.thumbnailUrl ? (
          <Image 
            source={{ uri: `http://192.168.0.18:8080/api/videos/thumbnail/${video.thumbnailUrl}` }} 
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <Icon name="image" size={40} color="#bbb" />
          </View>
        )}
        <View style={styles.playIcon}>
          <Icon name="play-arrow" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.videoDate}>
          {new Date(video.createdAt).toLocaleDateString('ko-KR')}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteVideo(video.id, video.title)}
      >
        <Icon name="delete" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  const renderVideoGrid = () => {
    const rows = [];
    for (let i = 0; i < myVideos.length; i += ITEMS_PER_ROW) {
      const row = myVideos.slice(i, i + ITEMS_PER_ROW);
      rows.push(
        <View key={i} style={styles.videoRow}>
          {row.map((video, index) => renderVideoItem(video, i + index))}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 동영상</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        ) : myVideos.length > 0 ? (
          <View style={styles.videoGrid}>
            {renderVideoGrid()}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="video-library" size={64} color="#ccc" />
            <Text style={styles.emptyText}>업로드된 동영상이 없습니다</Text>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => navigation.navigate('Upload')}
            >
              <Text style={styles.uploadButtonText}>동영상 업로드하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  videoGrid: {
    padding: 16,
  },
  videoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  videoItem: {
    width: (width - 48 - (ITEMS_PER_ROW - 1) * THUMB_GAP) / ITEMS_PER_ROW,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: THUMB_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    marginTop: 8,
    flex: 1,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    lineHeight: 18,
  },
  videoDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  uploadButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyVideoScreen;

