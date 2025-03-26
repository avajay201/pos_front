import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Courses from './screens/Courses';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import { MainProvider } from './MyContext';
import Teachers from './screens/Teachers';
import { LogBox } from "react-native";
import LoginScreen from './screens/Login';
import SplashScreen from './screens/SplashScreen';
import OptionScreen from './screens/OptionScreen';
import ReportScreen from './screens/ReportScreen';
import Grades from './screens/Grades';


LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

export default App = () => {
  return (
    <NavigationContainer>
      <MainProvider>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OptionScreen" component={OptionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Teachers" component={Teachers} options={{ headerShown: false }} />
          <Stack.Screen name="Grades" component={Grades} options={{ headerShown: false }} />
          <Stack.Screen name="ReportScreen" component={ReportScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Courses" component={Courses} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
          <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
        </Stack.Navigator>
      </MainProvider>
    </NavigationContainer>
  );
};
