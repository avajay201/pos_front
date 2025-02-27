import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, ToastAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import Home from './screens/Home';
import Courses from './screens/Courses';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import { saveDeviceAdd } from './ApiActions';
import { MainProvider } from './MyContext';
import Teachers from './screens/Teachers';


const Stack = createNativeStackNavigator();

export default App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDeviceID();
  }, []);

  const getDeviceID = async () => {
    const android_id = await AsyncStorage.getItem('android_id');
    if (android_id) {
      setLoading(false);
      return;
    };
    try {
      const androidId = await DeviceInfo.getAndroidId();
      console.log('Android ID:', androidId);
      if (androidId) {
        const response = await saveDeviceAdd({android_id: androidId});
        if (response === 201 || response === 200) {
          await AsyncStorage.setItem('android_id', androidId);
          setLoading(false);
        } else {
          ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show('Device ID not found!', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  return (
    <NavigationContainer>
      <MainProvider>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Teachers" component={Teachers} options={{ headerShown: false }} />
          <Stack.Screen name="Courses" component={Courses} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
          <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
        </Stack.Navigator>
      </MainProvider>
    </NavigationContainer>
  );
};
