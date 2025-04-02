import React, { useContext, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, ToastAndroid, ActivityIndicator, Modal } from "react-native";
import { MainContext } from "../MyContext";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createOrder } from "../ApiActions";
import SunmiPrinter from "@heasy/react-native-sunmi-printer";


const Checkout = ({ navigation }) => {
    const { cart, setCart, languageData, language } = useContext(MainContext);
    const [studentName, setStudentName] = useState("");
    const [address, setAddress] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const validateInputs = () => {
        if (studentName?.length < 3) {
            ToastAndroid.show('Student name must be at least 3 characters!', ToastAndroid.SHORT);
            return false;
        }
        if (address?.length < 10) {
            ToastAndroid.show('Address must be at least 10 characters!', ToastAndroid.SHORT);
            return false;
        }
        if (!whatsappNumber) {
            ToastAndroid.show('Whatsapp number is required!', ToastAndroid.SHORT);
            return false;
        }
        return true;
    };

    const printReceipt = async (forWhome, orderData) => {
        try {
            SunmiPrinter.printerInit();

            SunmiPrinter.setAlignment(1);
            SunmiPrinter.printerText("***** RECEIPT *****\n");
            SunmiPrinter.printerText("      Iraq Academy      \n");
            SunmiPrinter.printerText(`${forWhome}\n`);

            // SunmiPrinter.printBitmapBase64Custom(base64Image, 384, 0);

            SunmiPrinter.setAlignment(0);

            SunmiPrinter.printerText(`Student Name: ${orderData.student_name}\n`);
            SunmiPrinter.printerText(`Address: ${orderData.address}\n`);
            SunmiPrinter.printerText(`Whatsapp Number: ${orderData.whatsapp_number}\n`);
            SunmiPrinter.printerText(`Ordered At: ${orderData.ordered_at}\n\n`);

            SunmiPrinter.printerText("Courses:\n");

            orderData.courses.map((course, index) => {
                const courseCode = Object.keys(course)[0];
                const courseName = course[courseCode];
                SunmiPrinter.printerText(`${index + 1}. ${courseName}`);
                SunmiPrinter.printerText(`   ${courseCode}\n`);
            });

            SunmiPrinter.setAlignment(2);
            SunmiPrinter.printerText(`\n\nTotal: د.ع ${orderData.total_price}\n\n`);

            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-GB');
            const formattedTime = now.toLocaleTimeString('en-GB', { hour12: false });

            SunmiPrinter.setAlignment(1);
            SunmiPrinter.printerText(`Printed On: ${formattedDate} ${formattedTime}\n\n`);

            SunmiPrinter.printerText("************************\n");
            SunmiPrinter.setAlignment(1);
            SunmiPrinter.printerText("\n==== THANK YOU! ====\n");
            SunmiPrinter.printerText("\n\n\n\n\n\n\n");

            ToastAndroid.show('Receipt Printed', ToastAndroid.SHORT);
        } catch (error) {
            ToastAndroid.show('Error Printing Receipt', ToastAndroid.SHORT);
        }
    };

    const handleCheckout = async () => {
        if (validateInputs()) {
            setLoading(true);
            const android_id = await AsyncStorage.getItem("android_id");
            const cartItemsData = Object.entries(cart).map(([key, value]) => ({ [key]: value.title }));
            const totalPrice = cartItems?.reduce((total, item) => total + item.price, 0).toFixed(2);
            const orderData = {
                device: android_id,
                courses: cartItemsData,
                student_name: studentName,
                address: address,
                whatsapp_number: whatsappNumber,
                totalPrice: totalPrice,
            };
            const result = await createOrder(orderData);
            if (result[0] === 201) {
                setCart({});
                setStudentName("");
                setAddress("");
                setWhatsappNumber("");
                ToastAndroid.show('Order created Successful.', ToastAndroid.SHORT);
                await printReceipt('For Buyer', result[1]);
                await printReceipt('For Merchant', result[1]);
                setLoading(false);
                navigation.navigate('OptionScreen');
            }
            else if (result[0] === 401){
                ToastAndroid.show('Unauthorized', ToastAndroid.SHORT);
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('device_id');
                navigation.navigate('Login');
            }
            else {
                ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
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
            <Text style={styles.heading}>{languageData['checkout'][language]}</Text>

            <Text style={styles.subHeading}>{languageData['cart_summary'][language]}</Text>
            <View style={styles.cartContainer}>
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image source={item.image ? { uri: item.image } : require('../assets/dummy-course.jpg')} style={styles.courseImage} />
                            <View style={styles.info}>
                                <Text style={styles.title}>
                                    {item?.title?.length > 40 ? item.title.substring(0, 40) + "..." : item.title}
                                </Text>
                                <Text style={styles.price}>د.ع {item.price}</Text>
                            </View>
                        </View>
                    )}
                />
                <Text style={styles.subHeading}>{languageData['buyer_details'][language]}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={languageData['student_name'][language]}
                    value={studentName}
                    onChangeText={setStudentName}
                />
                <TextInput
                    style={styles.input}
                    placeholder={languageData['address'][language]}
                    keyboardType="address-address"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    style={styles.input}
                    placeholder={languageData['whatsapp_number'][language]}
                    keyboardType="numeric"
                    value={whatsappNumber}
                    onChangeText={setWhatsappNumber}
                />

                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>{languageData['total_courses'][language]}: {cartItems?.length}</Text>
                    <Text style={styles.summaryText}>{languageData['total_amount'][language]}: د.ع {cartItems?.reduce((total, item) => total + item.price, 0).toFixed(2)}</Text>
                </View>

                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutText}>{languageData['proceed'][language]}</Text>
                </TouchableOpacity>
            </View>

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
        maxHeight: '80%',
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
        textAlign: 'right',
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
