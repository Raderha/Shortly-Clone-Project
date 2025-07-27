import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { uploadStyles } from '../styles/uploadStyles';

interface UploadFormProps {
  title: string;
  setTitle: (title: string) => void;
  tags: string;
  setTags: (tags: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ title, setTitle, tags, setTags }) => {
  return (
    <>
      {/* 제목 입력 */}
      <View style={uploadStyles.inputContainer}>
        <Text style={uploadStyles.inputLabel}>제목</Text>
        <TextInput
          style={uploadStyles.textInput}
          value={title}
          onChangeText={setTitle}
          placeholder="영상 제목을 입력하세요"
          placeholderTextColor="#999"
        />
      </View>
      
      {/* 태그 입력 */}
      <View style={uploadStyles.inputContainer}>
        <Text style={uploadStyles.inputLabel}>태그</Text>
        <TextInput
          style={uploadStyles.textInput}
          value={tags}
          onChangeText={setTags}
          placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 운동, 격투기, 권투)"
          placeholderTextColor="#999"
        />
        <Text style={uploadStyles.inputHint}>* 최소 하나의 태그가 필요합니다</Text>
      </View>
      
      {/* 영상 길이 안내 */}
      <View style={uploadStyles.infoContainer}>
        <Icon name="info" size={16} color="#666" />
        <Text style={uploadStyles.infoText}>영상 길이는 5초 이상 3분 이하여야 합니다</Text>
      </View>
    </>
  );
};

export default UploadForm; 