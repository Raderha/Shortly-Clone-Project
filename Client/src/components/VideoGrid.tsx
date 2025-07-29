import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { VideoResponse } from '../api';
import { VideoCard } from './VideoCard';
import { LoadingState, ErrorState, EmptyState } from './VideoGridStates';

interface VideoGridProps {
  videos: VideoResponse[];
  loading: boolean;
  error: string | null;
  isSearchMode: boolean;
  searchKeyword: string;
  selectedTag: string | null;
  onVideoPress: (videoId: number) => void;
  onRetry: () => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  loading,
  error,
  isSearchMode,
  searchKeyword,
  selectedTag,
  onVideoPress,
  onRetry,
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (videos.length === 0) {
    return (
      <EmptyState 
        isSearchMode={isSearchMode}
        searchKeyword={searchKeyword}
        selectedTag={selectedTag}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
      {videos.map((video) => (
        <VideoCard 
          key={video.id}
          video={video}
          onPress={onVideoPress}
        />
      ))}
      {/* 하단 여백 */}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    paddingBottom: 80, // 하단 탭바 침범 방지
  },
}); 