import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  VideoDetail: undefined;
  DetailOption: undefined;
};

const OPTIONS = [
  '비밀 번호 변경',
  '계정 전환',
  '청구 및 결제',
  '전체 기록 관리',
  '연결된 앱',
  '일반',
];

const USER_NAME = '사용자 명';

const DetailOption = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* 상단 유저 정보 및 뒤로가기 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Icon name="account-circle" size={38} color="#222" />
          <Text style={styles.userName}>{USER_NAME}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      {/* 옵션 목록 */}
      <View style={styles.optionsList}>
        {OPTIONS.map((opt, idx) => (
          <View key={opt} style={styles.optionItem}>
            <Text style={styles.optionText}>{opt}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, marginBottom: 18 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userName: { marginLeft: 12, fontSize: 18, fontWeight: 'bold', color: '#222' },
  optionsList: { marginTop: 10 },
  optionItem: { paddingVertical: 18, borderBottomWidth: 0, justifyContent: 'center' },
  optionText: { fontSize: 16, color: '#222' },
});

export default DetailOption;
