import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView as SafeAreaInsetView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Stack 네비게이터의 스크린 이름 타입 정의
type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  VideoDetail: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaInsetView style={styles.container} edges={["top", "left", "right", "bottom"]}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <Text style={styles.logo}>Shortly</Text>
        <View style={styles.headerIcons}>
          <Icon name="notifications-outline" size={24} style={styles.icon} />
          <Icon name="search-outline" size={24} style={styles.icon} />
        </View>
      </View>

      {/* 즐겨찾기 바 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesBar}>
        <TouchableOpacity style={styles.favoriteBtn}><Text>즐겨찾기 1</Text></TouchableOpacity>
        <TouchableOpacity style={styles.favoriteBtn}><Text>즐겨찾기 2</Text></TouchableOpacity>
        <TouchableOpacity style={styles.favoriteBtn}><Text>즐겨찾기 3</Text></TouchableOpacity>
        <TouchableOpacity style={styles.addBtn}><Icon name="add" size={20} /></TouchableOpacity>
      </ScrollView>

      {/* 영상 그리드 */}
      <View style={styles.grid}>
        {[1,2,3,4].map((n) => (
          <TouchableOpacity key={n} style={styles.videoCard} onPress={() => navigation.navigate('VideoDetail')}>
            <Text>영상 {n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 하단 탭바 */}
      <View style={styles.tabBar}>
        <Icon name="home-outline" size={28} />
        <TouchableOpacity onPress={() => navigation.navigate('Upload')}>
          <Icon name="add-circle-outline" size={28} />
        </TouchableOpacity>
        <Icon name="folder-outline" size={28} />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="person-outline" size={28} />
        </TouchableOpacity>
      </View>
    </SafeAreaInsetView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    logo: { fontSize: 22, fontWeight: 'bold', color: '#FF6B57', backgroundColor: '#fff', padding: 6, borderRadius: 6 },
    headerIcons: { flexDirection: 'row' },
    icon: { marginLeft: 16 },
    favoritesBar: { flexGrow: 0, paddingHorizontal: 12, marginBottom: 8 },
    favoriteBtn: { backgroundColor: '#eee', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8 },
    addBtn: { backgroundColor: '#eee', borderRadius: 16, padding: 6, justifyContent: 'center', alignItems: 'center' },
    grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'flex-start', padding: 12 },
    videoCard: { width: '45%', aspectRatio: 1, backgroundColor: '#f5f5f5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', margin: 8 },
    tabBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderColor: '#eee', paddingBottom: 12 },
  });