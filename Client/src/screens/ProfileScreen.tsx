import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { getMyVideos, getLikedVideos, VideoResponse } from '../api';

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
const THUMB_SIZE = 160;
const THUMB_GAP = 16;

const renderThumb = (video: VideoResponse, idx: number, navigation: any, allVideos: VideoResponse[]) => (
  <TouchableOpacity 
    key={video.id} 
    style={styles.thumbBox}
    onPress={() => navigation.navigate('VideoDetail', { 
      videoId: video.id, 
      allVideos: allVideos, 
      currentIndex: idx 
    })}
  >
    {video.thumbnailUrl ? (
      <Image 
        source={{ uri: `http://192.168.0.18:8080/api/videos/thumbnail/${video.thumbnailUrl}` }} 
        style={styles.thumbnail}
        resizeMode="cover"
      />
    ) : (
      <Icon name="image" size={40} color="#bbb" />
    )}
  </TouchableOpacity>
);

const renderHorizontalList = (data: VideoResponse[], navigation: any) => (
  <ScrollView 
    horizontal 
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.horizontalList}
  >
    {data.map((video, idx) => renderThumb(video, idx, navigation, data))}
  </ScrollView>
);

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, token, logout } = useAuth();
  const [myVideos, setMyVideos] = useState<VideoResponse[]>([]);
  const [likedVideos, setLikedVideos] = useState<VideoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const [myVideosData, likedVideosData] = await Promise.all([
        getMyVideos(token || undefined),
        getLikedVideos(token || undefined)
      ]);
      setMyVideos(myVideosData);
      setLikedVideos(likedVideosData);
    } catch (error) {
      console.error('동영상 가져오기 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [token]);

  // 화면이 포커스될 때마다 데이터 새로고침
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchVideos();
    });

    return unsubscribe;
  }, [navigation, token]);


  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* 유저 정보 */}
        <View style={styles.userInfo}>
          <Icon name="account-circle" size={48} color="#222" />
          <Text style={styles.userName}>{user?.username || '사용자'}</Text>
        </View>

        {/* 내 동영상 */}
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => navigation.navigate('MyVideo')}
        >
          <Text style={styles.sectionTitle}>내 동영상</Text>
          <Icon name="chevron-right" size={24} color="#222" />
        </TouchableOpacity>
        {!isLoading && (myVideos.length > 0 ? renderHorizontalList(myVideos, navigation) : <View style={styles.emptyContainer} />)}

        {/* 좋아요 */}
        <Text style={[styles.sectionTitle, { marginTop: 70 }]}>좋아요</Text>
        {!isLoading && (likedVideos.length > 0 ? renderHorizontalList(likedVideos, navigation) : <View style={styles.emptyContainer} />)}
      </ScrollView>

      {/* 하단 네비게이션 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={36} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate({ name: 'DetailOption', params: undefined })}>
          <Icon name="settings" size={36} color="#222" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 32 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 28, marginBottom: 24 },
  userName: { marginLeft: 14, fontSize: 20, fontWeight: 'bold', color: '#222' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  horizontalList: { paddingRight: 20, marginBottom: 8 },
  thumbBox: { 
    width: THUMB_SIZE, 
    height: THUMB_SIZE, 
    backgroundColor: '#eee', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: THUMB_GAP 
  },
  thumbnail: { width: '100%', height: '100%', borderRadius: 12 },
  emptyContainer: { height: THUMB_SIZE, marginBottom: 8 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 28, backgroundColor: '#fff' },
  homeButton: { padding: 8 },
  settingsButton: { padding: 8 },
});

export default ProfileScreen;
