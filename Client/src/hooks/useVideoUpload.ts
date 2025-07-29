import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { uploadVideo } from '../api';
import { useAuth } from '../contexts/AuthContext';

type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  VideoDetail: undefined;
};

export const useVideoUpload = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { token } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return false;
    }
    return true;
  };

  const pickVideo = async (): Promise<void> => {
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
        const video = result.assets[0];
        setSelectedVideo(video);
      }
    } catch (error) {
      console.error('영상 선택 오류:', error);
      Alert.alert('오류', '영상을 선택하는 중 오류가 발생했습니다.');
    }
  };

  const validateForm = (): boolean => {
    if (!selectedVideo) {
      Alert.alert('알림', '업로드할 영상을 선택해주세요.');
      return false;
    }

    if (!token) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return false;
    }

    const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    if (tagList.length === 0) {
      Alert.alert('오류', '최소 하나의 태그를 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleUploadVideo = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsUploading(true);
    
    try {
      console.log('[useVideoUpload] 선택된 영상 정보:', {
        uri: selectedVideo?.uri,
        fileName: selectedVideo?.fileName,
        fileSize: selectedVideo?.fileSize,
        type: selectedVideo?.type,
      });

      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      const formData = new FormData();
      formData.append('video', {
        uri: selectedVideo!.uri,
        type: 'video/mp4',
        name: selectedVideo!.fileName || 'video.mp4'
      } as any);
      formData.append('title', title || selectedVideo!.fileName || '새 영상');
      formData.append('description', '');
      formData.append('tags', JSON.stringify(tagList));
      
      console.log('[useVideoUpload] FormData 생성 완료');
      console.log('[useVideoUpload] 토큰:', token ? '있음' : '없음');
      
      const result = await uploadVideo(formData, token);
      console.log('[useVideoUpload] 업로드 결과:', result);
      
      if (result.success) {
        Alert.alert('성공', result.message, [
          { text: '확인', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        Alert.alert('오류', result.message);
      }
    } catch (error) {
      console.error('[useVideoUpload] 업로드 오류:', error);
      Alert.alert('오류', '영상 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = (): void => {
    setSelectedVideo(null);
    setTitle('');
    setTags('');
  };

  return {
    selectedVideo,
    isUploading,
    title,
    setTitle,
    tags,
    setTags,
    pickVideo,
    handleUploadVideo,
    resetForm,
  };
}; 