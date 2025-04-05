import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, 
  Alert, StyleSheet, Image, 
  ToastAndroid
} from "react-native";
import DeviceInfo from 'react-native-device-info';
import { merchantLogin, myLogin } from "../ApiActions";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginScreen = ({ navigation }) => {
  const [merchantId, setMerchantId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!merchantId || !password) {
      ToastAndroid.show("Please enter Merchant ID and Password.", ToastAndroid.SHORT);
      return;
    };

    setLoading(true);

    try {
      const response = await merchantLogin({
        merchantID: merchantId,
        password: password,
      });

      if (response[0] == 200 || response[0] == 201) {
        const deviceID = await DeviceInfo.getAndroidId();
        if (!deviceID){
          setLoading(false);
          ToastAndroid.show('Device ID not found!', ToastAndroid.SHORT);
          return;
        };

        const data = {
          username: merchantId,
          password: password,
          device_id: deviceID,
        };

        const result = await myLogin(data);
        if (result[0] === 200) {
          await AsyncStorage.setItem('token', result[1].access);
          await AsyncStorage.setItem('device_id', deviceID);
          await AsyncStorage.setItem('auth_code', response[1].data?.api_token);
          ToastAndroid.show('Login successful.', ToastAndroid.SHORT);
          navigation.replace('OptionScreen');
        }
        else {
          ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT);
        }
      }
      else if(response[0] == 401){
        ToastAndroid.show('Invalid creadentials.', ToastAndroid.SHORT);
      }
      else if(response[0] == 422){
        ToastAndroid.show(response[1].msg, ToastAndroid.LONG);
      }
      else{
        ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT);
    }
    finally {
      setLoading(false);
    };
  };

  return (
    <View style={styles.container}>
      {/* Logo at the top */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Merchant Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Merchant ID"
        placeholderTextColor="#888"
        value={merchantId}
        onChangeText={setMerchantId}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  logo: {
    width: 120, // Adjust width as needed
    height: 120, // Adjust height as needed
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
