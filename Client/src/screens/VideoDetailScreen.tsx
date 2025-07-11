import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';

const SAMPLE_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4'; // 임시 샘플 영상

const VideoDetailScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* 영상 (배경) */}
      <Video
        source={{ uri: SAMPLE_VIDEO }}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      {/* 상단 바 */}
      <View style={styles.topBar} pointerEvents="box-none">
        <View style={styles.topLeft}>
          <TouchableOpacity>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkBox}>
            <Icon name="check-box" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Icon name="add-box" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 우측 중간 버튼 */}
      <View style={styles.rightButtons} pointerEvents="box-none">
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="thumb-up" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="chat-bubble-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="share" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 하단 바 */}
      <View style={styles.bottomBar} pointerEvents="box-none">
        <View style={styles.creatorInfo}>
          <Icon name="account-circle" size={28} color="#fff" />
          <Text style={styles.creatorName}>크리에이터</Text>
          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeText}>구독</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 56,
    zIndex: 10,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    marginLeft: 8,
  },
  rightButtons: {
    position: 'absolute',
    right: 16,
    top: '40%',
    alignItems: 'center',
    zIndex: 10,
  },
  iconButton: {
    marginVertical: 12,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 16,
    height: 56,
    zIndex: 10,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    color: '#fff',
  },
  subscribeButton: {
    backgroundColor: '#222',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  subscribeText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default VideoDetailScreen;
