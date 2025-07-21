import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface TabBarProps {
  onUploadPress: () => void;
  onProfilePress: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  onUploadPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.tabBar}>
      <Icon name="home-outline" size={28} />
      <TouchableOpacity onPress={onUploadPress}>
        <Icon name="add-circle-outline" size={28} />
      </TouchableOpacity>
      <Icon name="folder-outline" size={28} />
      <TouchableOpacity onPress={onProfilePress}>
        <Icon name="person-outline" size={28} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingVertical: 10, 
    borderTopWidth: 1, 
    borderColor: '#eee', 
    paddingBottom: 12 
  },
}); 