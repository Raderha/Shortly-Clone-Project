import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Stack 네비게이터의 스크린 이름 타입 정의
 type RootStackParamList = {
   Home: undefined;
   Upload: undefined;
   Profile: undefined;
   VideoDetail: undefined;
   DetailOption: undefined; 
 };

const USER_NAME = '사용자 명';
const MY_VIDEOS = [1, 2, 3]; // 임시 데이터, 없으면 []
const LIKED_VIDEOS = [1, 2]; // 임시 데이터, 없으면 []

const { width } = Dimensions.get('window');
const GRID_GAP = 16;
const GRID_COLUMNS = 3;
const THUMB_SIZE = (width - 40 - (GRID_GAP * (GRID_COLUMNS - 1))) / GRID_COLUMNS; // 40=paddingHorizontal*2

const renderThumb = (item: number, idx: number) => (
  <View key={idx} style={styles.thumbBox}>
    <Icon name="image" size={40} color="#bbb" />
  </View>
);

const renderGrid = (data: number[]) => (
  <View style={styles.thumbGrid}>
    {data.map(renderThumb)}
    {/* 빈 칸 채우기 */}
    {Array.from({ length: GRID_COLUMNS - (data.length % GRID_COLUMNS || GRID_COLUMNS) }).map((_, i) => (
      <View key={`empty-${i}`} style={styles.thumbBox} />
    ))}
  </View>
);

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* 유저 정보 */}
      <View style={styles.userInfo}>
        <Icon name="account-circle" size={48} color="#222" />
        <Text style={styles.userName}>{USER_NAME}</Text>
      </View>

      {/* 내 동영상 */}
      <Text style={styles.sectionTitle}>내 동영상</Text>
      {MY_VIDEOS.length > 0 ? renderGrid(MY_VIDEOS) : <View style={styles.thumbGrid} />}

      {/* 좋아요 */}
      <Text style={styles.sectionTitle}>좋아요</Text>
      {LIKED_VIDEOS.length > 0 ? renderGrid(LIKED_VIDEOS) : <View style={styles.thumbGrid} />}

      {/* 하단 네비게이션 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={36} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate({ name: 'DetailOption', params: undefined })}>
          <Icon name="settings" size={36} color="#222" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 32 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 28, marginBottom: 18 },
  userName: { marginLeft: 14, fontSize: 20, fontWeight: 'bold', color: '#222' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginTop: 18, marginBottom: 10, color: '#222' },
  thumbGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  thumbBox: { width: THUMB_SIZE, height: THUMB_SIZE, backgroundColor: '#eee', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: GRID_GAP, marginBottom: GRID_GAP },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 28, backgroundColor: '#fff' },
});

export default ProfileScreen;
