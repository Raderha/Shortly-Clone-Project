import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { VideoResponse, getAllVideos } from '../api';
import { getSubscribedVideos } from '../api/subscription';
import { useAuth } from '../contexts/AuthContext';
import { VideoCard } from '../components';
import Icon from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Subscriptions: undefined;
  Profile: undefined;
  VideoDetail: { videoId: number };
};

const SubscriptionsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { token } = useAuth();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscribedVideos();
  }, []);

  const loadSubscribedVideos = async () => {
    if (!token) {
      setError('로그인이 필요합니다');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 구독한 크리에이터들의 ID 목록 가져오기
      const creatorIds = await getSubscribedVideos(token) as number[];
      if (creatorIds.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }

      // 모든 영상 가져오기
      const allVideosResponse = await getAllVideos(0, 100, token);
      
      // VideoSearchResponse 구조에서 videos 배열 추출
      const allVideos = allVideosResponse?.videos || [];
      
      console.log('구독한 크리에이터 ID들:', creatorIds);
      console.log('전체 영상 개수:', allVideos.length);

      // 구독한 크리에이터들의 영상만 필터링
      const subscribedVideos = allVideos.filter(video => {
        const isSubscribedCreator = video.owner && creatorIds.includes(video.owner.id);
        console.log(`영상 ${video.id} (${video.owner?.username}): 구독 여부 = ${isSubscribedCreator}`);
        return isSubscribedCreator;
      });

      setVideos(subscribedVideos);
    } catch (error) {
      console.error('구독 영상 로드 실패:', error);
      setError('구독 영상을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPress = (videoId: number) => {
    navigation.navigate('VideoDetail', { videoId });
  };

  const handleRetry = () => {
    loadSubscribedVideos();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B57" />
          <Text style={styles.loadingText}>구독 영상을 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color="#FF6B57" />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={handleRetry}>
            다시 시도
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (videos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="folder-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>구독한 영상이 없습니다</Text>
          <Text style={styles.emptySubtitle}>
            영상을 보고 크리에이터를 구독해보세요!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>구독</Text>
      </View>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            onPress={() => handleVideoPress(item.id)}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.videoList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF6B57',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  videoList: {
    padding: 8,
  },
});

export default SubscriptionsScreen; 