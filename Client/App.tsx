import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import StartScreen from './src/screens/StartScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VideoDetailScreen from './src/screens/VideoDetailScreen';
import DetailOption from './src/screens/DetailOption';
import MyVideoScreen from './src/screens/MyVideo';
import SubscriptionsScreen from './src/screens/SubscriptionsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Upload" component={UploadScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Subscriptions" component={SubscriptionsScreen} />
            <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
            <Stack.Screen name="DetailOption" component={DetailOption} />
            <Stack.Screen name="MyVideo" component={MyVideoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
