import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Home: undefined;
    Upload: undefined;
    Profile: undefined;
    VideoDetail: undefined;
  };

const DUMMY_THUMBNAILS = Array.from({ length: 12 }, (_, i) => ({ id: i + 1 }));
const SELECTED_INDEX = 4; // 임시로 5번째 썸네일 선택

const UploadScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const renderItem = ({ item, index }: { item: { id: number }, index: number }) => (
    <View style={styles.thumbnailBox}>
      <Icon name="image" size={32} color="#bbb" />
      {index === SELECTED_INDEX && (
        <View style={styles.checkOverlay}>
          <Icon name="check-circle" size={20} color="#222" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* 상단 바 */}
      <View style={styles.topBar}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>Shortly</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="close" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      {/* 썸네일 그리드 */}
      <FlatList
        data={DUMMY_THUMBNAILS}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        scrollEnabled={false}
      />

      {/* 하단 업로드 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 56,
  },
  logoBadge: {
    backgroundColor: '#FF6F4D',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  thumbnailBox: {
    width: 90,
    height: 70,
    backgroundColor: '#eee',
    borderRadius: 8,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkOverlay: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  bottomBar: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 32, // 하단 여유 공간 확보
    height: 56,
    justifyContent: 'center',
  },
  uploadButton: {
    backgroundColor: '#222',
    borderRadius: 6,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UploadScreen;
