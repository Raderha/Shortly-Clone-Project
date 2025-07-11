import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VideoDetailScreen from './src/screens/VideoDetailScreen';
import DetailOption from './src/screens/DetailOption';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
        <Stack.Screen name="DetailOption" component={DetailOption} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}