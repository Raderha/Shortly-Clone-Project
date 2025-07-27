import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { uploadStyles } from '../styles/uploadStyles';

interface VideoPreviewProps {
  video: ImagePicker.ImagePickerAsset;
  onPress: () => void;
  disabled?: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ video, onPress, disabled = false }) => {
  return (
    <View style={uploadStyles.selectedVideoContainer}>
      <View style={uploadStyles.videoPreview}>
        <Icon name="videocam" size={48} color="#FF6F4D" />
        <Text style={uploadStyles.videoName} numberOfLines={2}>
          {video.fileName || '선택된 영상'}
        </Text>
        <Text style={uploadStyles.videoSize}>
          {video.fileSize ? (video.fileSize / (1024 * 1024)).toFixed(2) : '0'} MB
        </Text>
      </View>
      
      <TouchableOpacity 
        style={uploadStyles.changeVideoButton}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={uploadStyles.changeVideoText}>다른 영상 선택</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoPreview; 