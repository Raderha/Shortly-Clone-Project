import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { uploadVideo } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

type RootStackParamList = {
    Home: undefined;
    Upload: undefined;
    Profile: undefined;
    VideoDetail: undefined;
  };

const UploadScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { token } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return false;
    }
    return true;
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedVideo(result.assets[0]);
      }
    } catch (error) {
      console.error('영상 선택 오류:', error);
      Alert.alert('오류', '영상을 선택하는 중 오류가 발생했습니다.');
    }
  };

  const handleUploadVideo = async () => {
    if (!selectedVideo) {
      Alert.alert('알림', '업로드할 영상을 선택해주세요.');
      return;
    }

    if (!token) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('[UploadScreen] 선택된 영상 정보:', {
        uri: selectedVideo.uri,
        fileName: selectedVideo.fileName,
        fileSize: selectedVideo.fileSize,
        type: selectedVideo.type
      });

      const formData = new FormData();
      formData.append('video', {
        uri: selectedVideo.uri,
        type: 'video/mp4',
        name: selectedVideo.fileName || 'video.mp4'
      } as any);
      formData.append('title', title || selectedVideo.fileName || '새 영상');
      formData.append('description', ''); // 빈 설명
      formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)));
      
      console.log('[UploadScreen] FormData 생성 완료');
      console.log('[UploadScreen] 토큰:', token ? '있음' : '없음');
      
      const result = await uploadVideo(formData, token);
      console.log('[UploadScreen] 업로드 결과:', result);
      
      if (result.success) {
        Alert.alert('성공', result.message, [
          { text: '확인', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        Alert.alert('오류', result.message);
      }
    } catch (error) {
      console.error('[UploadScreen] 업로드 오류:', error);
      Alert.alert('오류', '영상 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* 상단 바 */}
      <View style={styles.topBar}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>Shortly</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="close" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      {/* 메인 컨텐츠 */}
      <View style={styles.content}>
        {selectedVideo ? (
          <View style={styles.selectedVideoContainer}>
            <View style={styles.videoPreview}>
              <Icon name="videocam" size={48} color="#FF6F4D" />
              <Text style={styles.videoName} numberOfLines={2}>
                {selectedVideo.fileName || '선택된 영상'}
              </Text>
              <Text style={styles.videoSize}>
                {selectedVideo.fileSize ? (selectedVideo.fileSize / (1024 * 1024)).toFixed(2) : '0'} MB
              </Text>
            </View>
            
            {/* 제목 입력 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>제목</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="영상 제목을 입력하세요"
                placeholderTextColor="#999"
              />
            </View>
            
            {/* 태그 입력 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>태그</Text>
              <TextInput
                style={styles.textInput}
                value={tags}
                onChangeText={setTags}
                placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 운동, 격투기, 권투)"
                placeholderTextColor="#999"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.changeVideoButton}
              onPress={pickVideo}
              disabled={isUploading}
            >
              <Text style={styles.changeVideoText}>다른 영상 선택</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadArea}>
            <TouchableOpacity 
              style={styles.uploadAreaButton}
              onPress={pickVideo}
              disabled={isUploading}
            >
              <Icon name="add" size={48} color="#FF6F4D" />
              <Text style={styles.uploadAreaText}>영상 선택하기</Text>
              <Text style={styles.uploadSubText}>갤러리에서 업로드할 영상을 선택하세요</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 하단 업로드 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[
            styles.uploadButton,
            (!selectedVideo || isUploading) && styles.uploadButtonDisabled
          ]}
          onPress={handleUploadVideo}
          disabled={!selectedVideo || isUploading}
        >
                     {isUploading ? (
             <View style={styles.uploadingContainer}>
               <ActivityIndicator size="small" color="#fff" />
               <Text style={styles.uploadButtonText}>업로드 중...</Text>
             </View>
           ) : (
             <Text style={styles.uploadButtonText}>업로드</Text>
           )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 56,
  },
  logoBadge: {
    backgroundColor: '#FF6F4D',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  uploadArea: {
    width: '100%',
    alignItems: 'center',
  },
  uploadAreaButton: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#FF6F4D',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  uploadAreaText: {
    color: '#FF6F4D',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  uploadSubText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  selectedVideoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  videoPreview: {
    width: 200,
    height: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  videoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  videoSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  changeVideoButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  changeVideoText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomBar: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 32,
    height: 80,
    justifyContent: 'center',
  },
  uploadButton: {
    backgroundColor: '#FF6F4D',
    borderRadius: 8,
    paddingHorizontal: 40,
    paddingVertical: 12,
    minWidth: 120,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});

export default UploadScreen;
