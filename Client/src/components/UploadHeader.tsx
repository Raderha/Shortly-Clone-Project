import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { uploadStyles } from '../styles/uploadStyles';

interface UploadHeaderProps {
  onClose: () => void;
}

const UploadHeader: React.FC<UploadHeaderProps> = ({ onClose }) => {
  return (
    <View style={uploadStyles.topBar}>
      <View style={uploadStyles.logoBadge}>
        <Text style={uploadStyles.logoText}>Shortly</Text>
      </View>
      <TouchableOpacity onPress={onClose}>
        <Icon name="close" size={28} color="#222" />
      </TouchableOpacity>
    </View>
  );
};

export default UploadHeader; 