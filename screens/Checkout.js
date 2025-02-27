import React, { useContext, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, ToastAndroid, ActivityIndicator, Modal } from "react-native";
import { MainContext } from "../MyContext";
import { BASE_URL } from "../ApiActions";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createOrder } from "../ApiActions";
import SunmiPrinter from "@heasy/react-native-sunmi-printer";


const Checkout = ({ navigation }) => {
    const { cart, setCart } = useContext(MainContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const validateInputs = () => {
        if (name.length < 3) {
            ToastAndroid.show("Name must be at least 3 characters!", ToastAndroid.SHORT);
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            ToastAndroid.show("Enter a valid email!", ToastAndroid.SHORT);
            return false;
        }
        if (!phone) {
            ToastAndroid.show("Phone number is required!", ToastAndroid.SHORT);
            return false;
        }
        return true;
    };

    const printReceipt = async (orderData) => {
        try {
          SunmiPrinter.printerInit();
    
          // Print header
          SunmiPrinter.setAlignment(1);
          SunmiPrinter.printerText("***** RECEIPT *****\n");
          SunmiPrinter.setAlignment(0);
    
          // Print buyer details
          SunmiPrinter.printerText(`Buyer: ${orderData.buyer}\n`);
          SunmiPrinter.printerText(`Email: ${orderData.buyer_email}\n`);
          SunmiPrinter.printerText(`Phone: ${orderData.buyer_phone}\n`);
          SunmiPrinter.printerText(`Ordered At: ${orderData.ordered_at}\n\n`);
    
          // Print courses
          SunmiPrinter.printerText("Courses:\n");
          orderData.courses.forEach((course, index) => {
            SunmiPrinter.printerText(`${index + 1}. ${course}\n`);
          });
    
          // Print total
          SunmiPrinter.setAlignment(2);
          SunmiPrinter.printerText(`\nTotal: ₹${orderData.total_price}\n\n`);
          SunmiPrinter.setAlignment(1);
          SunmiPrinter.printerText("************************\n");

        //   SunmiPrinter.lineWrap(3);
        //   SunmiPrinter.cutPaper();
          ToastAndroid.show("Receipt Printed", ToastAndroid.SHORT);
        } catch (error) {
          console.log("Printing error:", error);
          ToastAndroid.show("Error Printing Receipt", ToastAndroid.SHORT);
        }
    };

    const handleCheckout = async () => {
        if (validateInputs()) {
            setLoading(true);
            const android_id = await AsyncStorage.getItem("android_id");
            const cartItemsData = Object.keys(cart);
            const orderData = {
                device: android_id,
                courses: cartItemsData,
                buyer: name,
                buyer_email: email,
                buyer_phone: phone,
            };
            const result = await createOrder(orderData);
            if (result[0] === 201) {
                setCart({});
                setName("");
                setEmail("");
                setPhone("");
                ToastAndroid.show("Order created Successful.", ToastAndroid.SHORT);
                await printReceipt(result[1]);
                setLoading(false);
                navigation.navigate('Home');
            }
            else{
                ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
            };
            setLoading(false);
        };
    };

    const cartItems = Object.entries(cart).map(([courseId, details]) => ({
        id: parseInt(courseId),
        title: details.title,
        price: details.price,
        image: details.image,
    }));

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.heading}>Checkout</Text>

            <Text style={styles.subHeading}>Cart Summary</Text>
            <View style={styles.cartContainer}>
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image source={item.image ? { uri: BASE_URL + item.image } : require('../assets/dummy-course.jpg')} style={styles.courseImage} />
                            <View style={styles.info}>
                                <Text style={styles.title}>
                                    {item.title.length > 40 ? item.title.substring(0, 40) + "..." : item.title}
                                </Text>
                                <Text style={styles.price}>Price: ${item.price}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>

            <Text style={styles.subHeading}>Buyer Details</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Total Courses: {cartItems.length}</Text>
                <Text style={styles.summaryText}>Total Amount: ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutText}>Proceed</Text>
            </TouchableOpacity>
            <Modal transparent={true} animationType="fade" visible={loading}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#B94EA0" />
                </View>
            </Modal>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 15,
        backgroundColor: "#f8f9fa",
    },
    backButton: {
        position: "absolute",
        top: 15,
        left: 15,
        zIndex: 10,
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 20,
        elevation: 3,
    },
    heading: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
    },
    cartContainer: {
        maxHeight: '40%',
        marginBottom: 15,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignItems: "center",
    },
    courseImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    info: {
        marginLeft: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#27ae60",
        marginVertical: 5,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    checkoutButton: {
        backgroundColor: "#3498db",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    checkoutText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});

export default Checkout;
