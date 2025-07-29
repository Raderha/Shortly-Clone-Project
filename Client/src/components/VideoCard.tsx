import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { VideoResponse } from '../api';
import { getThumbnailUrl } from '../utils/api';

interface VideoCardProps {
  video: VideoResponse;
  onPress: (videoId: number) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPress }) => {
  const thumbnailUrl = getThumbnailUrl(video.thumbnailUrl);

  return (
    <TouchableOpacity 
      style={styles.videoCard} 
      onPress={() => onPress(video.id)}
    >
      {thumbnailUrl ? (
        <Image 
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderThumbnail}>
          <Icon name="videocam-outline" size={32} color="#ccc" />
        </View>
      )}
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
        <Text style={styles.videoOwner}>{video.owner.username}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  videoCard: { 
    width: '48%', 
    aspectRatio: 1, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 12, 
    marginBottom: 12, 
    overflow: 'hidden' 
  },
  thumbnail: { 
    width: '100%', 
    height: '70%', 
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12 
  },
  placeholderThumbnail: { 
    width: '100%', 
    height: '70%', 
    backgroundColor: '#f0f0f0', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12 
  },
  videoInfo: { 
    padding: 8, 
    flex: 1 
  },
  videoTitle: { 
    fontSize: 12, 
    fontWeight: '600', 
    marginBottom: 4, 
    color: '#333' 
  },
  videoOwner: { 
    fontSize: 10, 
    color: '#666' 
  },
});
