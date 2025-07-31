import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { VideoResponse, getAllVideos } from '../api';
import { getSubscribedVideos, getSubscribedCreators } from '../api/subscription';
import { useAuth } from '../contexts/AuthContext';
import { VideoCard, CreatorIcon } from '../components';
import Icon from 'react-native-vector-icons/Ionicons';
import { UserResponse } from '../api/types';

type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Subscriptions: undefined;
  Profile: undefined;
  VideoDetail: { videoId: number };
};

interface Creator {
  id: number;
  username: string;
  profileImage?: string;
}

const SubscriptionsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { token } = useAuth();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState<number | null>(null);

  useEffect(() => {
    loadSubscribedData();
  }, []);

  const loadSubscribedData = async () => {
    if (!token) {
      setError('로그인이 필요합니다');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 구독한 크리에이터들의 정보 가져오기
      const creatorsResponse = await getSubscribedCreators(token);
      const creatorsData = creatorsResponse as any[];
      const formattedCreators: Creator[] = creatorsData.map(creator => ({
        id: creator.id,
        username: creator.username,
        profileImage: creator.profilePicture,
      }));
      setCreators(formattedCreators);

      if (creatorsData.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }

      // 모든 영상 가져오기
      const allVideosResponse = await getAllVideos(0, 100, token);
      const allVideos = allVideosResponse?.videos || [];
      
      // 구독한 크리에이터들의 영상만 필터링
      const creatorIds = creatorsData.map(creator => creator.id);
      const subscribedVideos = allVideos.filter(video => 
        video.owner && creatorIds.includes(video.owner.id)
      );

      setVideos(subscribedVideos);
    } catch (error) {
      console.error('구독 데이터 로드 실패:', error);
      setError('구독 데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatorPress = (creatorId: number) => {
    if (selectedCreatorId === creatorId) {
      // 같은 크리에이터를 다시 클릭하면 전체 영상 표시
      setSelectedCreatorId(null);
    } else {
      setSelectedCreatorId(creatorId);
    }
  };

  const getFilteredVideos = () => {
    if (selectedCreatorId === null) {
      return videos; // 전체 영상 표시
    }
    return videos.filter(video => video.owner?.id === selectedCreatorId);
  };

  const handleVideoPress = (videoId: number) => {
    navigation.navigate('VideoDetail', { videoId });
  };

  const handleRetry = () => {
    loadSubscribedData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B57" />
          <Text style={styles.loadingText}>구독 데이터를 불러오는 중...</Text>
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

  if (creators.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="people-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>구독한 크리에이터가 없습니다</Text>
          <Text style={styles.emptySubtitle}>
            영상을 보고 크리에이터를 구독해보세요!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredVideos = getFilteredVideos();

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Icon name="play-circle" size={32} color="#FF6B57" />
          <Text style={styles.logoText}>Shortly</Text>
        </View>
      </View>

      {/* 구독한 크리에이터들 */}
      <View style={styles.creatorsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.creatorsScroll}
        >
          {creators.map((creator) => (
            <CreatorIcon
              key={creator.id}
              creator={creator}
              isSelected={selectedCreatorId === creator.id}
              onPress={() => handleCreatorPress(creator.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 영상 목록 */}
      {filteredVideos.length === 0 ? (
        <View style={styles.emptyVideosContainer}>
          <Icon name="videocam-outline" size={64} color="#ccc" />
          <Text style={styles.emptyVideosTitle}>
            {selectedCreatorId 
              ? '이 크리에이터의 영상이 없습니다' 
              : '구독한 영상이 없습니다'
            }
          </Text>
          <Text style={styles.emptyVideosSubtitle}>
            {selectedCreatorId 
              ? '다른 크리에이터를 선택해보세요' 
              : '크리에이터를 선택하여 영상을 확인해보세요'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
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
      )}
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  creatorsContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  creatorsScroll: {
    paddingHorizontal: 16,
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
  emptyVideosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyVideosTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  emptyVideosSubtitle: {
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