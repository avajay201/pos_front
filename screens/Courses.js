import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ToastAndroid, RefreshControl } from "react-native";
import { courses as fetchCourses, BASE_URL } from "../ApiActions";
import Icon from "react-native-vector-icons/Ionicons";
import { MainContext } from "../MyContext";


const Courses = ({ navigation, route }) => {
  const { teacher } = route.params;
  const { cart, setCart } = useContext(MainContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getCourses = async () => {
    try {
      const result = await fetchCourses(teacher);
      if (result[0] === 200) {
        setCourses(result[1]);
      } else {
        ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!teacher) {
      ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
      navigation.goBack();
    } else {
      getCourses();
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getCourses();
  };

  const addToCart = (course) => {
    setCart((prevCart) => ({
      ...prevCart,
      [course.id]: {
        quantity: (prevCart[course.id]?.quantity || 0) + 1,
        title: course.title,
        image: course.profile_pic,
        price: parseFloat(course.price),
      },
    }));
  };

  const increaseQuantity = (courseId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [courseId]: {
        ...prevCart[courseId],
        quantity: prevCart[courseId].quantity + 1,
      },
    }));
  };

  const decreaseQuantity = (courseId) => {
    setCart((prevCart) => {
      if (prevCart[courseId].quantity === 1) {
        const newCart = { ...prevCart };
        delete newCart[courseId];
        return newCart;
      }
      return {
        ...prevCart,
        [courseId]: {
          ...prevCart[courseId],
          quantity: prevCart[courseId].quantity - 1,
        },
      };
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

      <Text style={styles.heading}>Courses</Text>

      {courses.length === 0 ? (
        <Text style={styles.noCourses}>No courses available</Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3498db"]} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: BASE_URL + item.profile_pic }} style={styles.courseImage} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.title.length > 40 ? item.title.substring(0, 40) + "..." : item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>${item.price}</Text>

                {cart[item.id] ? (
                  <View style={styles.cartActions}>
                    <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.cartButton}>
                      <Icon name="remove" size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{cart[item.id].quantity}</Text>
                    <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.cartButton}>
                      <Icon name="add" size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.goToCartButton}
                      onPress={() => navigation.navigate("Cart")}
                    >
                      <Text style={styles.goToCartText}>Go to Cart</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
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
