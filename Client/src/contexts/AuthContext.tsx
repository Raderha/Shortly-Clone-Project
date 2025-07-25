import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AsyncStorage 키 상수
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  TOKEN_EXPIRY: 'auth_token_expiry',
} as const;

// 토큰 만료 시간 (24시간)
const TOKEN_EXPIRY_HOURS = 24;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 저장된 토큰과 사용자 정보 복원
  useEffect(() => {
    restoreAuthState();
  }, []);

  // 토큰 만료 시간 계산
  const calculateTokenExpiry = (): number => {
    return Date.now() + (TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
  };

  // 토큰이 만료되었는지 확인
  const isTokenExpired = async (): Promise<boolean> => {
    try {
      const expiryTime = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      if (!expiryTime) return true;
      
      const expiry = parseInt(expiryTime, 10);
      return Date.now() > expiry;
    } catch (error) {
      console.error('토큰 만료 확인 오류:', error);
      return true;
    }
  };

  // 저장된 인증 상태 복원
  const restoreAuthState = async () => {
    try {
      setIsLoading(true);
      
      // 토큰 만료 확인
      const expired = await isTokenExpired();
      if (expired) {
        console.log('토큰이 만료되었습니다. 로그아웃 처리합니다.');
        await clearStoredAuth();
        return;
      }

      // 저장된 토큰과 사용자 정보 가져오기
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        console.log('저장된 인증 정보를 복원했습니다.');
      }
    } catch (error) {
      console.error('인증 상태 복원 오류:', error);
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  // AsyncStorage에서 인증 정보 삭제
  const clearStoredAuth = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY),
      ]);
    } catch (error) {
      console.error('저장된 인증 정보 삭제 오류:', error);
    }
  };

  // AsyncStorage에 인증 정보 저장
  const storeAuthData = async (userData: User, userToken: string) => {
    try {
      const expiryTime = calculateTokenExpiry();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, userToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString()),
      ]);
    } catch (error) {
      console.error('인증 정보 저장 오류:', error);
      throw new Error('인증 정보를 저장할 수 없습니다.');
    }
  };

  // 로그인 처리
  const login = async (userData: User, userToken: string) => {
    try {
      // AsyncStorage에 저장
      await storeAuthData(userData, userToken);
      
      // 상태 업데이트
      setUser(userData);
      setToken(userToken);
      
      console.log('로그인 성공:', userData.username);
    } catch (error) {
      console.error('로그인 처리 오류:', error);
      throw error;
    }
  };

  // 로그아웃 처리
  const logout = async () => {
    try {
      // AsyncStorage에서 삭제
      await clearStoredAuth();
      
      // 상태 초기화
      setUser(null);
      setToken(null);
      
      console.log('로그아웃 완료');
    } catch (error) {
      console.error('로그아웃 처리 오류:', error);
      // 에러가 발생해도 상태는 초기화
      setUser(null);
      setToken(null);
    }
  };

  // 토큰 갱신 (필요시 서버에 요청)
  const refreshToken = async (): Promise<boolean> => {
    try {
      // 토큰이 만료되었는지 확인
      const expired = await isTokenExpired();
      if (expired) {
        console.log('토큰이 만료되어 로그아웃 처리합니다.');
        await logout();
        return false;
      }

      // 여기서 서버에 토큰 갱신 요청을 할 수 있습니다
      // 현재는 단순히 만료 여부만 확인
      console.log('토큰이 유효합니다.');
      return true;
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      await logout();
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 