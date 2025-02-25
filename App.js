// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, ToastAndroid, PermissionsAndroid, Platform } from "react-native";
// import SunmiPrinter from "@heasy/react-native-sunmi-printer";
// import DeviceInfo from 'react-native-device-info';


// const requestPermissions = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
//         {
//           title: "WiFi State Permission",
//           message: "This app requires access to your WiFi state to fetch the MAC address.",
//           buttonNeutral: "Ask Me Later",
//           buttonNegative: "Cancel",
//           buttonPositive: "OK"
//         }
//       );

//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("WiFi state permission granted");
//         getMacAddress(); // Call function to fetch MAC
//       } else {
//         console.log("WiFi state permission denied");
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   }
// };

// const getMacAddress = async () => {
//   try {
//     const mac = await DeviceInfo.getMacAddress();
//     console.log("Device MAC Address:", mac);
//   } catch (error) {
//     console.error("Error getting MAC Address:", error);
//   }
// };


// const App = () => {
//   const menuItems = [
//     { id: "1", name: "Burger", price: 50 },
//     { id: "2", name: "Pizza", price: 100 },
//     { id: "3", name: "Cola", price: 30 },
//   ];

//   const [order, setOrder] = useState(menuItems);
//   const [totalPrice, setTotalPrice] = useState(180);

//   useEffect(()=>{
//     // requestPermissions();
//     getMacAddress();
//   })

//   // const addToOrder = (item) => {
//   //   setOrder([...order, item]);
//   //   setTotalPrice(totalPrice + item.price);
//   // };

//   const printReceipt = async () => {
//     try {
//       ToastAndroid.show('Priniting Receipt', ToastAndroid.SHORT);
//       // Initialize printer
//       SunmiPrinter.printerInit();

//       // Print header
//       SunmiPrinter.setAlignment(1); // Center alignment
//       SunmiPrinter.printerText("***** RECEIPT *****\n");
//       SunmiPrinter.setAlignment(0); // Left alignment

//       // Print order details
//       order.forEach((item) => {
//         SunmiPrinter.printerText(`${item.name} - ₹${item.price}\n`);
//       });

//       // Print total
//       SunmiPrinter.setAlignment(2); // Right alignment
//       SunmiPrinter.printerText(`\nTotal: ₹${totalPrice}\n\n`);
//       SunmiPrinter.setAlignment(1); // Center alignment
//       SunmiPrinter.printerText("************************\n");

//       // Feed paper & cut (if supported)
//       SunmiPrinter.lineWrap(3);
//       SunmiPrinter.cutPaper();
//       ToastAndroid.show('Receipt Printed', ToastAndroid.SHORT);
//     } catch (error) {
//       console.log("Printing error:", error);
//       ToastAndroid.show('Error Printing Receipt', ToastAndroid.SHORT);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>POS System</Text>
//       <FlatList
//         data={menuItems}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.item}>
//             <Text style={styles.itemText}>{item.name} - ₹{item.price}</Text>
//           </TouchableOpacity>
//         )}
//       />
//       <Text style={styles.summary}>Order Summary:</Text>
//       {order.map((item, index) => (
//         <Text key={index} style={styles.orderItem}>{item.name} - ₹{item.price}</Text>
//       ))}
//       <Text style={styles.total}>Total: ₹{totalPrice}</Text>
//       <Button title="Print Receipt" onPress={printReceipt} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   item: {
//     padding: 15,
//     backgroundColor: "#f0f0f0",
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   itemText: {
//     fontSize: 18,
//   },
//   summary: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 20,
//   },
//   orderItem: {
//     fontSize: 16,
//   },
//   total: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
// });

// export default App;
// ************************************************************************************




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
import { saveMacAdd } from './ApiActions';
import { MainProvider } from './MyContext';


const Stack = createNativeStackNavigator();

export default App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMacAdd();
  }, []);

  const getMacAdd = async () => {
    const mac_address = await AsyncStorage.getItem('mac_address');
    if (mac_address) {
      setLoading(false);
      return;
    };
    try {
      const mac = await DeviceInfo.getMacAddress();
      console.log('MAC Address:', mac);
      if (mac) {
        const response = await saveMacAdd({mac_address: mac});
        if (response === 201 || response === 200) {
          await AsyncStorage.setItem('mac_address', mac);
          setLoading(false);
        } else {
          ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show('MAC address not found!', ToastAndroid.SHORT);
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
          <Stack.Screen name="Courses" component={Courses} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
          <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
        </Stack.Navigator>
      </MainProvider>
    </NavigationContainer>
  );
};
