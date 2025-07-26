import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = '영상을 불러오는 중...' 
}) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#FF6B57" />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>다시 시도</Text>
    </TouchableOpacity>
  </View>
);

interface EmptyStateProps {
  isSearchMode: boolean;
  searchKeyword: string;
  selectedTag: string | null;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  isSearchMode, 
  searchKeyword, 
  selectedTag 
}) => {
  const getEmptyMessage = () => {
    if (isSearchMode) {
      return `"${searchKeyword}" 검색 결과가 없습니다`;
    }
    if (selectedTag) {
      return `"${selectedTag}" 태그의 영상이 없습니다`;
    }
    return '업로드된 영상이 없습니다';
  };

  return (
    <View style={styles.emptyContainer}>
      <Icon name="videocam-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 12, 
    fontSize: 16, 
    color: '#666' 
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  errorText: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 16 
  },
  retryButton: { 
    backgroundColor: '#FF6B57', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 8 
  },
  retryButtonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  emptyText: { 
    marginTop: 12, 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center' 
  },
}); 