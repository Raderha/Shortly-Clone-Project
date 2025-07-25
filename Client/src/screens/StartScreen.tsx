import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
  VideoDetail: undefined;
  DetailOption: undefined;
};

const StartScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { isAuthenticated, isLoading } = useAuth();

  // 인증 상태 확인 후 자동 로그인
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigation.replace('Home');
    }
  }, [isLoading, isAuthenticated, navigation]);

  // 로딩 중일 때 스플래시 화면 표시
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.logo}>Shortly</Text>
          <ActivityIndicator size="large" color="#FF6B57" style={styles.loadingIndicator} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* 로고 영역 */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Shortly</Text>
        <Text style={styles.tagline}>짧은 영상, 큰 재미</Text>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.signupButton} 
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.signupButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B57',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingBottom: 48,
  },
  loginButton: {
    backgroundColor: '#FF6B57',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#FF6B57',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#FF6B57',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StartScreen;
