import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ToastAndroid, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { teacherCourses } from "../ApiActions";
import Icon from "react-native-vector-icons/Ionicons";
import { MainContext } from "../MyContext";
import { Picker } from "@react-native-picker/picker";


const TeachersNext = ({ route }) => {
    const { teacherId } = route.params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { cart, languageData, language, languages, setLanguage } = useContext(MainContext);

    const getTeachers = async () => {
        try {
            setLoading(true);

            const result = await teacherCourses(teacherId);

            if (result[0] === 200) {
                setData(result[1]?.data?.courses);
            } else {
                ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTeachers();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={language}
                        style={styles.picker}
                        onValueChange={(itemValue) => setLanguage(itemValue)}
                    >
                        {languages.map((lang, index) => (
                            <Picker.Item key={index} label={lang} value={lang} />
                        ))}
                    </Picker>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.cartButton}>
                    <Icon name="cart" size={28} color="black" />
                    {Object.keys(cart)?.length > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{Object.keys(cart)?.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {data?.length === 0 && (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>{languageData["no_data"][language]}</Text>
                </View>
            )}

            <FlatList
                data={data}
                keyExtractor={(item, index) => `${item?.id}-${index}`}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[
                            styles.card,
                            { backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#d9e6f2" }
                        ]}
                        onPress={() => navigation.navigate("Courses", { id: item?.id })}
                    >
                        <Image source={item?.image ? { uri: item?.image } : require("../assets/dummy-course.jpg")} style={styles.profilePic} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item?.name}</Text>
                            <Text style={styles.speciality}>{item?.description}</Text>
                        </View>
                    </TouchableOpacity>
                )}
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
        // flex: 1,
        // alignItems: "center",
    },
    heading: {
        fontWeight: "bold",
        fontSize: 26,
    },
    pickerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 40,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        overflow: "hidden",
    },
    picker: {
        height: 40,
        width: "100%",
        color: "black",
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
    speciality: {
        fontSize: 14,
        color: "#555",
    }
});

export default TeachersNext;
