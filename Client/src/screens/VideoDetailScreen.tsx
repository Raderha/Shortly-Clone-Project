import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRoute } from '@react-navigation/native';
import { getAllVideos, VideoResponse } from '../api/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SERVER_URL = 'http://222.102.217.76:8080';

const VideoDetailScreen = () => {
  const route = useRoute();
  const { videoId } = route.params as { videoId: number };
  const [video, setVideo] = useState<VideoResponse | null>(null);

  useEffect(() => {
    getAllVideos(0, 50).then(result => {
      const found = result.videos.find(v => v.id === videoId);
      setVideo(found || null);
    });
  }, [videoId]);

  if (!video) return <Text>영상을 불러오는 중...</Text>;

  return (
    <View style={styles.container}>
      {/* 영상 (배경) */}
      <Video
        source={{ uri: `${SERVER_URL}/uploads/videos/${video.url}` }}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.CONTAIN} // 원본 비율 유지
        shouldPlay
        useNativeControls={false}
        isLooping
      />

      {/* 상단 바 */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="add-box" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 우측 중간 버튼 */}
      <View style={styles.rightButtons}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="thumb-up" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="chat-bubble-outline" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="share" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 하단 바 */}
      <View style={styles.bottomBar}>
        <Icon name="account-circle" size={28} color="#fff" />
        <Text style={styles.creatorName}>{video.owner.username}</Text>
        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>구독</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topBar: {
    position: 'absolute', top: 40, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, zIndex: 10,
  },
  rightButtons: {
    position: 'absolute', right: 16, top: '40%',
    alignItems: 'center', zIndex: 10,
  },
  iconButton: { marginVertical: 16 },
  bottomBar: {
    position: 'absolute', left: 0, right: 0, bottom: 60, // 기존 30에서 80으로 변경
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    zIndex: 10,
  },
  creatorName: { marginLeft: 8, marginRight: 8, fontSize: 16, color: '#fff' },
  subscribeButton: { backgroundColor: '#222', borderRadius: 4, paddingHorizontal: 12, paddingVertical: 4 },
  subscribeText: { color: '#fff', fontSize: 14 },
});

export default VideoDetailScreen;
