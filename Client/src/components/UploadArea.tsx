import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { uploadStyles } from '../styles/uploadStyles';

interface UploadAreaProps {
  onPress: () => void;
  disabled?: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onPress, disabled = false }) => {
  return (
    <View style={uploadStyles.uploadArea}>
      <TouchableOpacity 
        style={uploadStyles.uploadAreaButton}
        onPress={onPress}
        disabled={disabled}
      >
        <Icon name="add" size={48} color="#FF6F4D" />
        <Text style={uploadStyles.uploadAreaText}>영상 선택하기</Text>
        <Text style={uploadStyles.uploadSubText}>갤러리에서 업로드할 영상을 선택하세요</Text>
        <Text style={uploadStyles.uploadSubText}>영상 길이는 5초 이상 3분 이하여야 합니다</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadArea; 