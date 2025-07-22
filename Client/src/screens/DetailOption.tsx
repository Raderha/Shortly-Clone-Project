import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  VideoDetail: undefined;
  DetailOption: undefined;
  Start: undefined;
};

const OPTIONS = [
  '비밀 번호 변경',
  '계정 전환',
  '청구 및 결제',
  '전체 기록 관리',
  '연결된 앱',
  '일반',
  '로그아웃',
];

const DetailOption = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuth();
  
  const handleOptionPress = (option: string) => {
    if (option === '로그아웃') {
      Alert.alert(
        '로그아웃',
        '정말 로그아웃 하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '로그아웃',
            style: 'destructive',
            onPress: () => {
              logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Start' }],
              });
            },
          },
        ]
      );
    }
    // 다른 옵션들에 대한 처리도 여기에 추가할 수 있습니다
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* 상단 유저 정보 및 뒤로가기 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Icon name="account-circle" size={38} color="#222" />
          <Text style={styles.userName}>{user?.username || '사용자'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      {/* 옵션 목록 */}
      <View style={styles.optionsList}>
        {OPTIONS.map((opt, idx) => (
          <TouchableOpacity 
            key={opt} 
            style={[
              styles.optionItem,
              opt === '로그아웃' && styles.logoutOption
            ]}
            onPress={() => handleOptionPress(opt)}
          >
            <Text style={[
              styles.optionText,
              opt === '로그아웃' && styles.logoutText
            ]}>
              {opt}
            </Text>
            {opt === '로그아웃' && (
              <Icon name="logout" size={20} color="#FF3B30" />
            )}
          </TouchableOpacity>
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
  optionItem: { 
    paddingVertical: 18, 
    borderBottomWidth: 0, 
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionText: { fontSize: 16, color: '#222' },
  logoutOption: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 20,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default DetailOption;
