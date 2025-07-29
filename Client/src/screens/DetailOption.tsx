import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { changePassword } from '../api';

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
  const { user, logout, token } = useAuth();

  // 비밀번호 변경 모달 상태
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionPress = (option: string) => {
    if (option === '비밀 번호 변경') {
      setShowPasswordModal(true);
      return;
    }
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
            onPress: async () => {
              try {
                await logout();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Start' }],
                });
              } catch (error) {
                console.error('로그아웃 오류:', error);
                Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
              }
            },
          },
        ]
      );
    }
    // 다른 옵션들에 대한 처리도 여기에 추가할 수 있습니다
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('오류', '새 비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await changePassword({ currentPassword, newPassword }, token ?? undefined);
      if (res.success) {
        Alert.alert('성공', res.message);
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        Alert.alert('오류', res.message);
      }
    } catch (e) {
      Alert.alert('오류', '비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* 상단 유저 정보 및 뒤로가기 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Icon name="account-circle" size={38} color="#222" />
          <Text style={styles.userName}>{user?.username ?? '사용자'}</Text>
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

      {/* 비밀번호 변경 모달 */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>비밀번호 변경</Text>
            <TextInput
              style={styles.input}
              placeholder="현재 비밀번호"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="새 비밀번호 (6자 이상)"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                }}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.addButtonText}>변경</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#FF6B57',
    borderWidth: 1,
    borderColor: '#FF6B57',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailOption;
