import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface HomeHeaderProps {
  onSearchPress: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onSearchPress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>Shortly</Text>
      <View style={styles.headerIcons}>
        <Icon name="notifications-outline" size={24} style={styles.icon} />
        <TouchableOpacity onPress={onSearchPress}>
          <Icon name="search-outline" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16 
  },
  logo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#FF6B57', 
    backgroundColor: '#fff', 
    padding: 6, 
    borderRadius: 6 
  },
  headerIcons: { 
    flexDirection: 'row' 
  },
  icon: { 
    marginLeft: 16 
  },
}); 