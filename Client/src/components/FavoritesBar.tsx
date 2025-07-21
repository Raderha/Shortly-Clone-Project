import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface FavoritesBarProps {
  favoriteTags: string[];
  selectedTag: string | null;
  onTagPress: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
  onAddTagPress: () => void;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({
  favoriteTags,
  selectedTag,
  onTagPress,
  onRemoveTag,
  onAddTagPress,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesBar}>
      {favoriteTags.map((tag, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.favoriteBtn, 
            selectedTag === tag && styles.selectedFavoriteBtn
          ]}
          onPress={() => onTagPress(tag)}
          onLongPress={() => {
            Alert.alert(
              '즐겨찾기 삭제',
              `"${tag}" 태그를 즐겨찾기에서 삭제하시겠습니까?`,
              [
                { text: '취소', style: 'cancel' },
                { text: '삭제', onPress: () => onRemoveTag(tag), style: 'destructive' }
              ]
            );
          }}
        >
          <Text style={[
            styles.favoriteBtnText,
            selectedTag === tag && styles.selectedFavoriteBtnText
          ]}>
            {tag}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity 
        style={styles.addBtn} 
        onPress={onAddTagPress}
      >
        <Icon name="add" size={20} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  favoritesBar: { 
    flexGrow: 0, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    marginBottom: 10 
  },
  favoriteBtn: { 
    backgroundColor: '#eee', 
    borderRadius: 16, 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    marginRight: 8, 
    minHeight: 36 
  },
  favoriteBtnText: { 
    fontSize: 13, 
    color: '#333', 
    fontWeight: '500' 
  },
  selectedFavoriteBtn: { 
    backgroundColor: '#FF6B57' 
  },
  selectedFavoriteBtnText: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  addBtn: { 
    backgroundColor: '#eee', 
    borderRadius: 16, 
    padding: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: 36, 
    minWidth: 36 
  },
}); 