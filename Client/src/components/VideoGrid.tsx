import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { VideoResponse } from '../api/auth';

const SERVER_URL = 'http://192.168.0.18:8080';

interface VideoGridProps {
  videos: VideoResponse[];
  loading: boolean;
  error: string | null;
  isSearchMode: boolean;
  searchKeyword: string;
  selectedTag: string | null;
  onVideoPress: (videoId: number) => void;
  onRetry: () => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  loading,
  error,
  isSearchMode,
  searchKeyword,
  selectedTag,
  onVideoPress,
  onRetry,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B57" />
        <Text style={styles.loadingText}>영상을 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="videocam-outline" size={48} color="#ccc" />
        <Text style={styles.emptyText}>
          {isSearchMode 
            ? `"${searchKeyword}" 검색 결과가 없습니다` 
            : selectedTag 
              ? `"${selectedTag}" 태그의 영상이 없습니다` 
              : '업로드된 영상이 없습니다'
          }
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
      {videos.map((video) => (
        <TouchableOpacity 
          key={video.id} 
          style={styles.videoCard} 
          onPress={() => onVideoPress(video.id)}
        >
          {video.thumbnailUrl ? (
            <Image 
              source={{ uri: `${SERVER_URL}/api/videos/thumbnail/${video.thumbnailUrl}` }}
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
      ))}
      {/* 하단 여백 */}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    paddingBottom: 80, // 하단 탭바 침범 방지
  },
  videoCard: { 
    width: '48%', 
    aspectRatio: 1, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 12, 
    marginBottom: 12, 
    overflow: 'hidden' 
  },
  thumbnail: { 
    width: '100%', 
    height: '70%', 
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12 
  },
  placeholderThumbnail: { 
    width: '100%', 
    height: '70%', 
    backgroundColor: '#f0f0f0', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12 
  },
  videoInfo: { 
    padding: 8, 
    flex: 1 
  },
  videoTitle: { 
    fontSize: 12, 
    fontWeight: '600', 
    marginBottom: 4, 
    color: '#333' 
  },
  videoOwner: { 
    fontSize: 10, 
    color: '#666' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 12, 
    fontSize: 16, 
    color: '#666' 
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  errorText: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 16 
  },
  retryButton: { 
    backgroundColor: '#FF6B57', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 8 
  },
  retryButtonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  emptyText: { 
    marginTop: 12, 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center' 
  },
}); 