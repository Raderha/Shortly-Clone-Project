import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useVideoUpload } from '../hooks/useVideoUpload';
import { 
  UploadHeader, 
  UploadArea, 
  VideoPreview, 
  UploadForm, 
  UploadButton 
} from '../components';
import { uploadStyles } from '../styles/uploadStyles';

type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  VideoDetail: undefined;
};

const UploadScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {
    selectedVideo,
    isUploading,
    title,
    setTitle,
    tags,
    setTags,
    pickVideo,
    handleUploadVideo,
  } = useVideoUpload();

  const handleClose = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={uploadStyles.container} edges={['top', 'bottom', 'left', 'right']}>
      <UploadHeader onClose={handleClose} />

      <View style={uploadStyles.content}>
        {selectedVideo ? (
          <>
            <VideoPreview 
              video={selectedVideo} 
              onPress={pickVideo} 
              disabled={isUploading} 
            />
            <UploadForm 
              title={title}
              setTitle={setTitle}
              tags={tags}
              setTags={setTags}
            />
          </>
        ) : (
          <UploadArea onPress={pickVideo} disabled={isUploading} />
        )}
      </View>

      <UploadButton 
        onPress={handleUploadVideo}
        disabled={!selectedVideo || isUploading}
        isUploading={isUploading}
      />
    </SafeAreaView>
  );
};

export default UploadScreen;
