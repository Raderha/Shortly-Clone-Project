import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { uploadStyles } from '../styles/uploadStyles';

interface UploadButtonProps {
  onPress: () => void;
  disabled: boolean;
  isUploading: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onPress, disabled, isUploading }) => {
  return (
    <View style={uploadStyles.bottomBar}>
      <TouchableOpacity 
        style={[
          uploadStyles.uploadButton,
          disabled && uploadStyles.uploadButtonDisabled
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        {isUploading ? (
          <View style={uploadStyles.uploadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={uploadStyles.uploadButtonText}>업로드 중...</Text>
          </View>
        ) : (
          <Text style={uploadStyles.uploadButtonText}>업로드</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UploadButton; 