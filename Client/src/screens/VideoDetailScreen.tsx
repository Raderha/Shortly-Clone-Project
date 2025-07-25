import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useRoute, useNavigation } from '@react-navigation/native';
import { VideoResponse, likeVideo, unlikeVideo, isVideoLiked, getAllVideos } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SERVER_URL = 'http://192.168.0.18:8080';
const { height, width } = Dimensions.get('window');

interface VideoItemProps {
  video: VideoResponse;
  isFocused: boolean;
  onLikePress: () => void;
  isLiked: boolean;
  isLikeLoading: boolean;
  onBack: () => void;
  onSubscribe: () => void;
  onVideoEnd: () => void;
  onNextVideo: () => void;
  onPrevVideo: () => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ 
  video, 
  isFocused, 
  onLikePress, 
  isLiked, 
  isLikeLoading, 
  onBack, 
  onSubscribe,
  onVideoEnd,
  onNextVideo,
  onPrevVideo
}) => {
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      console.log('비디오 상태:', {
        url: video.url,
        isPlaying: status.isPlaying,
        position: status.positionMillis,
        duration: status.durationMillis,
        isBuffering: status.isBuffering
      });
      
      setIsVideoLoading(false);
      setIsPlaying(status.isPlaying);
      
      // 영상이 끝났을 때 다음 영상으로 넘어가기
      if (status.didJustFinish) {
        console.log('영상 재생 완료, 다음 영상으로 넘어갑니다');
        onVideoEnd();
      }
    } else if (status.error) {
      console.error('Video error:', status.error);
      setHasError(true);
      setIsVideoLoading(false);
    } else {
      console.log('비디오 로딩 중:', video.url);
      setIsVideoLoading(true);
    }
  };

  const handleLoadStart = () => {
    console.log('비디오 로딩 시작:', video.url);
    setIsVideoLoading(true);
    setHasError(false);
  };

  const handleLoad = () => {
    console.log('비디오 로딩 완료:', video.url);
    setIsVideoLoading(false);
    setHasError(false);
  };

  const handleError = (error: string) => {
    console.error('Video load error:', error, 'for video:', video.url);
    setHasError(true);
    setIsVideoLoading(false);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsVideoLoading(true);
  };

  const handleCenterTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // 더블 터치 감지 시간 (ms)

    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      // 더블 터치 - 좋아요
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
        tapTimeout.current = null;
      }
      setLastTap(0);
      console.log('더블 터치 감지 - 좋아요');
      onLikePress();
    } else {
      setLastTap(now);
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
      }
      tapTimeout.current = setTimeout(() => {
        // 싱글 터치 - 재생/일시정지
        console.log('싱글 터치 감지 - 재생/일시정지');
        if (isPlaying) {
          videoRef.current?.pauseAsync();
        } else {
          videoRef.current?.playAsync();
        }
        tapTimeout.current = null;
      }, DOUBLE_TAP_DELAY);
    }
  };

  // 언마운트 시 타이머 정리
  React.useEffect(() => {
    return () => {
      if (tapTimeout.current) clearTimeout(tapTimeout.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      {!hasError ? (
        <Video
          ref={videoRef}
          source={{ uri: `${SERVER_URL}/api/videos/file/${video.url}` }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={isFocused}
          useNativeControls={false}
          isLooping={false}
          isMuted={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color="#fff" />
          <Text style={styles.errorText}>영상을 불러올 수 없습니다</Text>
          <Text style={styles.errorSubText}>{video.title || '제목 없음'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 로딩 인디케이터 */}
      {isVideoLoading && !hasError && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B57" />
          <Text style={styles.loadingText}>영상을 불러오는 중...</Text>
        </View>
      )}

      {/* 상단 터치 영역 - 이전 영상 */}
      <TouchableOpacity 
        style={styles.topTouchArea} 
        onPress={() => {
          console.log('상단 터치 감지 - 이전 영상으로 이동');
          onPrevVideo();
        }}
        activeOpacity={0.8}
      />

      {/* 중간 터치 영역 - 재생/일시정지 + 더블 터치 좋아요 */}
      <TouchableOpacity 
        style={styles.centerTouchArea} 
        onPress={handleCenterTap}
        activeOpacity={0.8}
      />

      {/* 하단 터치 영역 - 다음 영상 */}
      <TouchableOpacity 
        style={styles.bottomTouchArea} 
        onPress={() => {
          console.log('하단 터치 감지 - 다음 영상으로 이동');
          onNextVideo();
        }}
        activeOpacity={0.8}
      />

      {/* 상단 바 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="add-box" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 우측 중간 버튼 */}
      <View style={styles.rightButtons}>
        <TouchableOpacity 
          style={[styles.iconButton, isLiked && styles.likedButton]} 
          onPress={onLikePress}
          disabled={isLikeLoading}
        >
          <Icon 
            name={isLiked ? "thumb-up" : "thumb-up-alt"} 
            size={24} 
            color={isLiked ? "#FF6B57" : "#fff"} 
          />
          {isLikeLoading && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>...</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="chat-bubble-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="share" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 하단 바 */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.userInfo}>
          <Icon name="account-circle" size={28} color="#fff" />
          <Text style={styles.creatorName}>{video.owner?.username || '사용자'}</Text>
          <TouchableOpacity style={styles.subscribeButton} onPress={onSubscribe}>
            <Text style={styles.subscribeText}>구독</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.videoTitleContainer}>
          <Text style={styles.videoTitle} numberOfLines={2}>{video.title || '제목 없음'}</Text>
        </View>
      </View>
    </View>
  );
};

const VideoDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { videoId } = route.params as { videoId: number };
  const { token } = useAuth();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // 영상 목록 가져오기
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const result = await getAllVideos(0, 50); // 더 많은 영상 가져오기
        console.log('영상 목록 응답:', result);
        setVideos(result.videos);
        
        // 현재 영상의 인덱스 찾기
        const index = result.videos.findIndex(video => video.id === videoId);
        if (index !== -1) {
          setCurrentVideoIndex(index);
        }
      } catch (error) {
        console.error('영상 목록 가져오기 실패:', error);
        Alert.alert('오류', '영상 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [videoId]);

  // 좋아요 상태 확인
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!token || !videos[currentVideoIndex]) return;
      try {
        const liked = await isVideoLiked(videos[currentVideoIndex].id, token);
        setIsLiked(liked);
      } catch (error) {
        console.error('좋아요 상태 확인 실패:', error);
      }
    };
    checkLikeStatus();
  }, [token, videos, currentVideoIndex]);

  const handleLikePress = useCallback(async () => {
    if (!token || !videos[currentVideoIndex]) {
      Alert.alert('로그인 필요', '좋아요 기능을 사용하려면 로그인이 필요합니다.');
      return;
    }
    if (isLikeLoading) return;
    
    setIsLikeLoading(true);
    try {
      let success = false;
      if (isLiked) {
        success = await unlikeVideo(videos[currentVideoIndex].id, token);
        if (success) setIsLiked(false);
      } else {
        success = await likeVideo(videos[currentVideoIndex].id, token);
        if (success) setIsLiked(true);
      }
      if (!success) {
        Alert.alert('오류', isLiked ? '좋아요 취소에 실패했습니다.' : '좋아요에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLikeLoading(false);
    }
  }, [token, videos, currentVideoIndex, isLiked, isLikeLoading]);

  const handleVideoEnd = useCallback(() => {
    // 다음 영상으로 넘어가기
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      // 마지막 영상이면 처음으로 돌아가기
      setCurrentVideoIndex(0);
    }
  }, [currentVideoIndex, videos.length]);

  const handleNextVideo = useCallback(() => {
    console.log('다음 영상으로 이동');
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      // 마지막 영상이면 처음으로 돌아가기
      setCurrentVideoIndex(0);
    }
  }, [currentVideoIndex, videos.length]);

  const handlePrevVideo = useCallback(() => {
    console.log('이전 영상으로 이동');
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    } else {
      // 첫 번째 영상이면 마지막으로 이동
      setCurrentVideoIndex(videos.length - 1);
    }
  }, [currentVideoIndex, videos.length]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B57" />
        <Text style={styles.loadingText}>영상을 불러오는 중...</Text>
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>영상을 찾을 수 없습니다</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentVideo = videos[currentVideoIndex];
  if (!currentVideo || !currentVideo.url) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B57" />
        <Text style={styles.loadingText}>영상을 불러오는 중...</Text>
        {currentVideo && !currentVideo.url && (
          <Text style={styles.errorText}>비디오 URL을 찾을 수 없습니다</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <VideoItem
        video={currentVideo}
        isFocused={true}
        isLiked={isLiked}
        isLikeLoading={isLikeLoading}
        onLikePress={handleLikePress}
        onBack={() => navigation.goBack()}
        onSubscribe={() => {}}
        onVideoEnd={handleVideoEnd}
        onNextVideo={handleNextVideo}
        onPrevVideo={handlePrevVideo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', height },
  thumbnailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  thumbnailText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  topBar: {
    position: 'absolute', top: 40, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, zIndex: 10,
  },
  rightButtons: {
    position: 'absolute', right: 16, top: '40%',
    alignItems: 'center', zIndex: 10,
  },
  iconButton: { 
    marginVertical: 12,
    position: 'relative',
    padding: 8,
    borderRadius: 16,
  },
  likedButton: {
    backgroundColor: 'rgba(255, 107, 87, 0.2)',
    borderRadius: 16,
    padding: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    flexDirection: 'column', paddingHorizontal: 15,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  creatorName: { marginLeft: 8, marginRight: 8, fontSize: 16, color: '#fff' },
  subscribeButton: { backgroundColor: '#222', borderRadius: 4, paddingHorizontal: 12, paddingVertical: 4 },
  subscribeText: { color: '#fff', fontSize: 14 },
  videoTitleContainer: {
    width: '100%',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 5,
  },
  retryButton: {
    backgroundColor: '#FF6B57',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  topTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.3, // 화면 상단 30%
    zIndex: 5,
  },
  centerTouchArea: {
    position: 'absolute',
    top: height * 0.3, // 상단 터치 영역 다음
    left: 0,
    right: 0,
    height: height * 0.4, // 중간 터치 영역 높이
    zIndex: 5,
  },
  bottomTouchArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3, // 화면 하단 30%
    zIndex: 5,
  },
});

export default VideoDetailScreen;