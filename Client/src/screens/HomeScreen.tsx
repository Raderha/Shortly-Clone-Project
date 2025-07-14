import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView as SafeAreaInsetView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getAllVideos, VideoResponse } from '../api/auth';

// Stack 네비게이터의 스크린 이름 타입 정의
type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  VideoDetail: { videoId: number };
};

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
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
        <TouchableOpacity style={styles.favoriteBtn}><Text>즐겨찾기 1</Text></TouchableOpacity>
        <TouchableOpacity style={styles.favoriteBtn}><Text>즐겨찾기 2</Text></TouchableOpacity>
        <TouchableOpacity style={styles.favoriteBtn}><Text>즐겨찾기 3</Text></TouchableOpacity>
        <TouchableOpacity style={styles.addBtn}><Icon name="add" size={20} /></TouchableOpacity>
      </ScrollView>

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
            <Text style={styles.emptyText}>업로드된 영상이 없습니다</Text>
          </View>
        ) : (
          videos.map((video) => (
            <TouchableOpacity 
              key={video.id} 
              style={styles.videoCard} 
              onPress={() => navigation.navigate('VideoDetail', { videoId: video.id })}
            >
              {video.thumbnailUrl ? (
                <Image 
                  source={{ uri: `http://222.102.217.76:8080/uploads/thumbnails/${video.thumbnailUrl}` }}
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
    </SafeAreaInsetView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    logo: { fontSize: 22, fontWeight: 'bold', color: '#FF6B57', backgroundColor: '#fff', padding: 6, borderRadius: 6 },
    headerIcons: { flexDirection: 'row' },
    icon: { marginLeft: 16 },
    favoritesBar: { flexGrow: 0, paddingHorizontal: 12, marginBottom: 8 },
    favoriteBtn: { backgroundColor: '#eee', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8 },
    addBtn: { backgroundColor: '#eee', borderRadius: 16, padding: 6, justifyContent: 'center', alignItems: 'center' },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      padding: 12,
      paddingBottom: 80, // 하단 탭바 침범 방지
    },
    videoCard: { width: '45%', aspectRatio: 1, backgroundColor: '#f5f5f5', borderRadius: 12, margin: 8, overflow: 'hidden' },
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
  });