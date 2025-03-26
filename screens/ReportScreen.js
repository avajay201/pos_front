import React, { useState, useContext } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList,
    ToastAndroid
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { orders as getOrders } from "../ApiActions";
import moment from "moment";
import SunmiPrinter from "@heasy/react-native-sunmi-printer";
import Icon from "react-native-vector-icons/Ionicons";
import { MainContext } from "../MyContext";


const ReportScreen = ({ navigation }) => {
    const { language } = useContext(MainContext);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const printReceipt = () => {
        if (orders.length === 0) {
            ToastAndroid.show("No orders available to print.", ToastAndroid.SHORT);
            return;
        }

        setIsPrinting(true);

        try{
            SunmiPrinter.setAlignment(1);
            SunmiPrinter.printerText("\n==== ORDER RECEIPT ====\n");

            // Get current date and time
            const currentDateTime = moment().format("DD MMM YYYY, HH:mm");
            SunmiPrinter.printerText(`Printed On: ${currentDateTime}\n\n`);

            // Print total orders
            SunmiPrinter.setAlignment(0);
            SunmiPrinter.printerText(`Total Orders: ${orders.length}\n\n`);

            // Print total amount
            SunmiPrinter.setAlignment(2);
            const totalAmount = orders.reduce((total, item) => total + parseFloat(item.total_price || 0), 0).toFixed(2);
            SunmiPrinter.printerText(`Total Amount: د.ع ${totalAmount}\n\n`);

            // Final spacing & closing message
            SunmiPrinter.setAlignment(1);
            SunmiPrinter.printerText("\n==== THANK YOU! ====\n");
            SunmiPrinter.printerText("\n\n\n\n");

            ToastAndroid.show("Receipt Printed Successfully!", ToastAndroid.SHORT);
            setIsPrinting(false);
        }
        catch(error){
            setIsPrinting(false);
            ToastAndroid.show("Failed to Print Receipt!", ToastAndroid.SHORT);
        };
    };

    const fetchOrders = async () => {
        if (!fromDate || !toDate) {
            ToastAndroid.show("Please select both From Date and To Date.", ToastAndroid.SHORT);
            return;
        };

        setIsLoading(true);

        try {
            const formattedFromDate = fromDate.toISOString().split("T")[0];
            const formattedToDate = toDate.toISOString().split("T")[0];
            const response = await getOrders({ from_date: formattedFromDate, to_date: formattedToDate });
            setIsLoading(false);
            if (response[0] === 200) {
                setOrders(response[1].orders || []);
            }
            else if (result[0] === 401){
                ToastAndroid.show('Unauthorized', ToastAndroid.SHORT);
                navigation.navigate('Login');
            }
            else {
                ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT);
            }
        } catch (error) {
            setIsLoading(false);
            ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT);
        };
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.heading}>{language === 'English' ? 'Report' : 'تقرير'}</Text>
            </View>

            <Text style={styles.label}>{language === 'English' ? 'Report' : 'فترة التقرير'}:</Text>
            <View style={styles.dateContainer}>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowFromPicker(true)}>
                    <Text style={styles.dateText}>
                        {fromDate ? fromDate.toDateString() : language === 'English' ? 'Select From Date' : 'حدد من التاريخ'}
                    </Text>
                </TouchableOpacity>
                {showFromPicker && (
                    <DateTimePicker
                        value={fromDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowFromPicker(false);
                            if (date) setFromDate(date);
                        }}
                        disabled={isLoading || isPrinting}
                    />
                )}

                <TouchableOpacity style={styles.dateButton} onPress={() => setShowToPicker(true)}>
                    <Text style={styles.dateText}>
                        {toDate ? toDate.toDateString() : language === 'English' ? 'Select To Date' : 'حدد حتى الآن'}
                    </Text>
                </TouchableOpacity>
                {showToPicker && (
                    <DateTimePicker
                        value={toDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowToPicker(false);
                            if (date) setToDate(date);
                        }}
                        disabled={isLoading || isPrinting}
                    />
                )}
            </View>

            <TouchableOpacity style={styles.fetchButton} onPress={fetchOrders} disabled={isLoading || isPrinting}>
                <Text style={styles.fetchButtonText}>{language=== 'English' ? 'Submit' : 'يُقدِّم'}</Text>
            </TouchableOpacity>

            <View style={styles.resultsContainer}>
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.orderCard}>
                            <Text style={styles.orderTitle}>Order ID: #{item.id}</Text>
                            <Text style={styles.orderText}>Student Name: {item.student_name}</Text>
                            <Text style={styles.orderText}>Address: {item.address}</Text>
                            <Text style={styles.orderText}>Whatsapp Number: {item.whatsapp_number}</Text>
                            <Text style={styles.orderText}>Total Price: د.ع {item.total_price}</Text>
                            <Text style={styles.orderText}>
                                Ordered At: {moment(item.ordered_at).format("DD MMM YYYY, HH:mm")}
                            </Text>
                            <Text style={[styles.orderText, { fontWeight: 'bold', marginTop: 10 }]}>Courses: {item.stored_ids.length}</Text>

                            <View style={styles.courseContainer}>
                                <Text style={styles.courseHeader}>Course Code</Text>
                                <Text style={styles.courseHeader}>Course Name</Text>
                            </View>

                            {item.stored_ids.map((course, index) => {
                                const courseCode = Object.keys(course)[0];
                                const courseName = course[courseCode];
                                return (
                                    <View key={index} style={styles.courseRow}>
                                        <Text style={styles.courseText}>{courseCode}</Text>
                                        <Text style={styles.courseText}>{courseName}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                />
                {orders.length === 0 && <Text style={styles.noOrdersText}>{language === 'English' ? 'No orders found' : 'لم يتم العثور على أي أوامر'}</Text>}
            </View>

            {orders.length > 0 && (
                <TouchableOpacity 
                    style={[styles.printButton, isPrinting && styles.printButtonDisabled]} 
                    onPress={printReceipt} 
                    disabled={isPrinting}
                >
                    <Text style={styles.printButtonText}>{language === 'English' ? 'Print Receipt' : 'طباعة الإيصال'}</Text>
                </TouchableOpacity>
            )}

            {(isLoading || isPrinting) && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loaderText}>{isPrinting ? (language === 'English' ? 'Printing receipt' : 'إيصال الطباعة') : (language === 'English' ? 'Loading Orders' : 'تحميل الطلبات')}...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#fff",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 5,
        marginBottom: 10,
        marginTop: 15,
    },
    heading: {
        fontWeight: "bold",
        fontSize: 26,
    },
    dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    dateButton: {
        flex: 1,
        padding: 10,
        backgroundColor: "#ddd",
        alignItems: "center",
        borderRadius: 5,
        marginHorizontal: 5,
    },
    dateText: {
        fontSize: 16,
        color: "#333",
    },
    fetchButton: {
        backgroundColor: "#007bff",
        padding: 12,
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 20,
    },
    fetchButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    resultsContainer: {
        marginTop: 10,
        maxHeight: '60%',
    },
    orderCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 15,
        borderLeftWidth: 5,
        borderLeftColor: "#007bff",
    },
    orderTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#007bff",
    },
    orderText: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    printButton: {
        position: 'absolute',
        left: '50%',
        transform: [{ translateX: -30 }],
        bottom: 40,
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    printButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    noOrdersText: {
        textAlign: "center",
        fontSize: 16,
        color: "#777",
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    loaderText: {
        color: "#fff",
        fontSize: 18,
        marginTop: 10,
    },
    printButtonDisabled: {
        backgroundColor: "#6c757d",
    },
    courseContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#007bff",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    courseHeader: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        flex: 1,
        textAlign: "center",
    },
    courseRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    courseText: {
        fontSize: 16,
        color: "#333",
        flex: 1,
        textAlign: "center",
        paddingVertical: 5,
    },
    
});

export default ReportScreen;
