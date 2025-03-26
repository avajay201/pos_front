import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ToastAndroid, RefreshControl } from "react-native";
import { courses as fetchCourses, courseSpecific } from "../ApiActions";
import Icon from "react-native-vector-icons/Ionicons";
import { MainContext } from "../MyContext";

const Courses = ({ navigation, route }) => {
  const { teacher } = route.params;
  const { cart, setCart, language, languageData } = useContext(MainContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCourses = async () => {
    try {
      setLoading(true);
      const result = await fetchCourses(teacher);
      if (result[0] === 200) {
        setCourses(result[1]?.data?.sections)
      } else {
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!teacher) {
      ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      navigation.goBack();
    } else {
      getCourses();
    }
  }, []);

  const addToCart = (course) => {
    setCart((prevCart) => ({
      ...prevCart,
      [course?.id]: {
        title: course?.name,
        image: course?.image,
        price: parseFloat(course?.price ? course?.price : 0),
      },
    }));
  };

  const removeFromCart = (courseId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[courseId];
      return newCart;
    });
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.heading}>{languageData['courses'][language]}</Text>

      {courses?.length === 0 ? (
        <Text style={styles.noCourses}>{languageData['no_courses'][language]}</Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item?.id.toString()}
          renderItem={({ item, index }) => (
            <View 
              style={[
                styles.card,
                { backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#d9e6f2" }
            ]}>
              <Image source={item?.image ? { uri:item?.image } : require('../assets/dummy-course.jpg')} style={styles.courseImage} />
              <View style={styles.info}>
                <Text style={styles.title}>{item?.name?.length > 40 ? item?.name.substring(0, 40) + "..." : item?.name}</Text>
                <Text style={styles.description}>{item?.description}</Text>
                <Text style={styles.price}>د.ع {item?.price ? item?.price : 0}</Text>

                {cart[item?.id] ? (
                  <View style={styles.cartActions}>
                    <TouchableOpacity onPress={() => removeFromCart(item?.id)} style={styles.cartButton}>
                      <Icon name="trash" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.goToCartButton}
                      onPress={() => navigation.navigate("Cart")}
                    >
                      <Text style={styles.goToCartText}>{languageData['go2cart'][language]}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
                    <Text style={styles.addToCartText}>{languageData['add2cart'][language]}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
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
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  heading: {
    marginVertical: 10,
    fontWeight: "bold",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 30,
  },
  noCourses: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
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
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27ae60",
    textAlign: 'right',
  },
  addToCartButton: {
    backgroundColor: "#3498db",
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  cartActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  cartButton: {
    backgroundColor: "#e74c3c",
    padding: 6,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 8,
  },
  goToCartButton: {
    backgroundColor: "#27ae60",
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  goToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Courses;
