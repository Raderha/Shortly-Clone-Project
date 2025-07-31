import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface CreatorIconProps {
  creator: {
    id: number;
    username: string;
    profileImage?: string;
  };
  isSelected: boolean;
  onPress: () => void;
}

const CreatorIcon: React.FC<CreatorIconProps> = ({ creator, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
        {creator.profileImage ? (
          <Image source={{ uri: creator.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.defaultAvatar}>
            <Text style={styles.defaultAvatarText}>
              {creator.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.username, isSelected && styles.selectedUsername]} numberOfLines={1}>
        {creator.username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 60,
  },
  selectedContainer: {
    // 선택된 상태의 스타일
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIconContainer: {
    borderColor: '#FF6B57',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  defaultAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedUsername: {
    color: '#FF6B57',
    fontWeight: 'bold',
  },
});

export default CreatorIcon; 