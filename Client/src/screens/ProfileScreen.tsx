import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { getMyVideos, getLikedVideos, VideoResponse } from '../api/auth';

// Stack 네비게이터의 스크린 이름 타입 정의
 type RootStackParamList = {
   Home: undefined;
   Upload: undefined;
   Profile: undefined;
   VideoDetail: undefined;
   DetailOption: undefined; 
 };

const { width } = Dimensions.get('window');
const GRID_GAP = 16;
const GRID_COLUMNS = 3;
const THUMB_SIZE = (width - 40 - (GRID_GAP * (GRID_COLUMNS - 1))) / GRID_COLUMNS; // 40=paddingHorizontal*2

const renderThumb = (video: VideoResponse, idx: number) => (
  <View key={video.id} style={styles.thumbBox}>
    {video.thumbnailUrl ? (
      <Image 
        source={{ uri: `http://222.102.217.76:8080/uploads/thumbnails/${video.thumbnailUrl}` }} 
        style={styles.thumbnail}
        resizeMode="cover"
      />
    ) : (
      <Icon name="image" size={40} color="#bbb" />
    )}
  </View>
);

const renderGrid = (data: VideoResponse[]) => (
  <View style={styles.thumbGrid}>
    {data.map(renderThumb)}
  </View>
);

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, token } = useAuth();
  const [myVideos, setMyVideos] = useState<VideoResponse[]>([]);
  const [likedVideos, setLikedVideos] = useState<VideoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchVideos();
  }, [token]);
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* 유저 정보 */}
        <View style={styles.userInfo}>
          <Icon name="account-circle" size={48} color="#222" />
          <Text style={styles.userName}>{user?.username || '사용자'}</Text>
        </View>

        {/* 내 동영상 */}
        <Text style={styles.sectionTitle}>내 동영상</Text>
        {!isLoading && (myVideos.length > 0 ? renderGrid(myVideos) : <View style={styles.thumbGrid} />)}

        {/* 좋아요 */}
        <Text style={styles.sectionTitle}>좋아요</Text>
        {!isLoading && (likedVideos.length > 0 ? renderGrid(likedVideos) : <View style={styles.thumbGrid} />)}
      </ScrollView>

      {/* 하단 네비게이션 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={36} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate({ name: 'DetailOption', params: undefined })}>
          <Icon name="settings" size={36} color="#222" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 32 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 28, marginBottom: 18 },
  userName: { marginLeft: 14, fontSize: 20, fontWeight: 'bold', color: '#222' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginTop: 18, marginBottom: 10, color: '#222' },
  thumbGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  thumbBox: { width: THUMB_SIZE, height: THUMB_SIZE, backgroundColor: '#eee', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: GRID_GAP, marginBottom: GRID_GAP },
  thumbnail: { width: '100%', height: '100%', borderRadius: 12 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 28, backgroundColor: '#fff' },
});

export default ProfileScreen;
