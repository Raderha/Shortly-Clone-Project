import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
// import VideoDetailScreen from './src/screens/VideoDetailScreen'; // 추후 추가

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="VideoDetail" component={VideoDetailScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}