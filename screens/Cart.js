import React, { useContext } from "react";
import { 
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, 
  ToastAndroid 
} from "react-native";
import { BASE_URL } from "../ApiActions";
import Icon from "react-native-vector-icons/Ionicons";
import { MainContext } from "../MyContext";

const Cart = ({ navigation }) => {
  const { cart, setCart } = useContext(MainContext);

  const removeItem = (courseId) => {
    setCart((prevCart) => {
      let newCart = { ...prevCart };
      delete newCart[courseId];
      return newCart;
    });
    ToastAndroid.show("Item removed from cart!", ToastAndroid.SHORT);
  };

  const cartItems = Object.entries(cart).map(([courseId, details]) => ({
    id: parseInt(courseId),
    title: details.title,
    image: details.image,
    price: details.price,
  }));

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.heading}>Cart</Text>
        <Text style={styles.emptyCart}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.heading}>Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View 
            style={[
              styles.card,
              { backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#d9e6f2" }
          ]}>
            <Image source={item.image ? { uri: BASE_URL + item.image } : require('../assets/dummy-course.jpg')} style={styles.courseImage} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title.length > 40 ? item.title.substring(0, 40) + "..." : item.title}</Text> 
              <Text style={styles.price}>Price: ${item.price}</Text>
              <View style={styles.cartActions}>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.id)}>
                  <Icon name="trash" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate("Checkout")}>
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  emptyCart: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
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
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27ae60",
    marginVertical: 5,
  },
  cartActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  removeButton: {
    backgroundColor: "#ff4757",
    padding: 6,
    borderRadius: 5,
    marginRight: 10,
  },
  checkoutButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Cart;
