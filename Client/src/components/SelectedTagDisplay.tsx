import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SelectedTagDisplayProps {
  selectedTag: string | null;
  isSearchMode: boolean;
  searchKeyword: string;
  onClearTag: () => void;
  onClearSearch: () => void;
}

export const SelectedTagDisplay: React.FC<SelectedTagDisplayProps> = ({
  selectedTag,
  isSearchMode,
  searchKeyword,
  onClearTag,
  onClearSearch,
}) => {
  if (!selectedTag && !isSearchMode) {
    return null;
  }

  return (
    <>
      {/* 선택된 태그 표시 */}
      {selectedTag && (
        <View style={styles.selectedTagContainer}>
          <Text style={styles.selectedTagText}>
            "{selectedTag}" 태그의 영상
          </Text>
          <TouchableOpacity onPress={onClearTag}>
            <Icon name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* 검색 모드 표시 */}
      {isSearchMode && (
        <View style={styles.selectedTagContainer}>
          <Text style={styles.selectedTagText}>
            "{searchKeyword}" 검색 결과
          </Text>
          <TouchableOpacity onPress={onClearSearch}>
            <Icon name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  selectedTagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  selectedTagText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
}); 