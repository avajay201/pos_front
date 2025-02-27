import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ToastAndroid, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { subjects as fetchSubjects, BASE_URL } from "../ApiActions";
import Icon from "react-native-vector-icons/Ionicons";
import { MainContext } from "../MyContext";


const Home = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const { cart } = useContext(MainContext);

    const getSubjects = async () => {
        try {
            const result = await fetchSubjects();
            if (result[0] === 200) {
                setSubjects(result[1]);
            } else {
                ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show('Error fetching subjects!', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        getSubjects();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        getSubjects();
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
                <Text style={styles.heading}>Subjects</Text>
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
                subjects.length === 0 && (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>No subjects available</Text>
                    </View>
                )
            }

            <FlatList
                data={subjects}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate("Teachers", { s_id: item.id })}
                    >
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.name}</Text>
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
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 30,
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
});

export default Home;
