import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ToastAndroid, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { teachers as fetchTeachers, BASE_URL } from "../ApiActions";
import Icon from "react-native-vector-icons/Ionicons";
import { MainContext } from "../MyContext";


const Teachers = ({ route }) => {
    const { s_id } = route.params;
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const { cart, language } = useContext(MainContext);

    const getTeachers = async () => {
        try {
            const result = await fetchTeachers(s_id);
            if (result[0] === 200) {
                setTeachers(result[1]);
            } else {
                ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show('Error fetching teachers!', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        getTeachers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        getTeachers();
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                <View style={styles.headerTitle}>
                    <Text style={styles.heading}>Teachers</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.cartButton}>
                    <Icon name="cart" size={28} color="black" />
                    {Object.keys(cart).length > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{Object.keys(cart).length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>


            {
                teachers.length === 0 && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>No teachers available</Text>
                    </View>
                )
            }

            <FlatList
                data={teachers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[
                            styles.card,
                            { backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#d9e6f2" }
                        ]}
                        onPress={() => navigation.navigate("Courses", { teacher: item.id })}
                    >
                        <Image source={item.profile_pic ? { uri: BASE_URL + item.profile_pic } : require('../assets/dummy-profile.jpg')} style={styles.profilePic} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                            <Text style={styles.phone}>{item.phone}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3498db"]} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f8f9fa",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    headerTitle: {
        flex: 1,
        alignItems: "center",
    },
    heading: {
        fontWeight: "bold",
        fontSize: 26,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#fff",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cartButton: {
        position: "relative",
        padding: 5,
    },
    cartBadge: {
        position: "absolute",
        top: -3,
        right: -3,
        backgroundColor: "red",
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    cartBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignItems: "center",
        gap: 20,
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    email: {
        fontSize: 14,
        color: "#555",
    },
    phone: {
        fontSize: 14,
        color: "#777",
    },
});

export default Teachers;
