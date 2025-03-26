import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const checkAuth = async () => {
            const access_token = await AsyncStorage.getItem('token');
            const device_id = await AsyncStorage.getItem('device_id');
            
            setTimeout(() => {
                if (access_token && device_id) {
                    navigation.replace("OptionScreen");
                } else {
                    navigation.replace("LoginScreen");
                }
            }, 3000);
        };

        checkAuth();
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        gap: 150,
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        marginBottom: 20,
    },
    loader: {
        marginTop: 20,
    },
});

export default SplashScreen;
