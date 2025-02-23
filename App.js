import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, ToastAndroid } from "react-native";
import SunmiPrinter from "@heasy/react-native-sunmi-printer";

const App = () => {
  const menuItems = [
    { id: "1", name: "Burger", price: 50 },
    { id: "2", name: "Pizza", price: 100 },
    { id: "3", name: "Cola", price: 30 },
  ];

  const [order, setOrder] = useState(menuItems);
  const [totalPrice, setTotalPrice] = useState(180);

  // const addToOrder = (item) => {
  //   setOrder([...order, item]);
  //   setTotalPrice(totalPrice + item.price);
  // };

  const printReceipt = async () => {
    try {
      ToastAndroid.show('Priniting Receipt', ToastAndroid.SHORT);
      // Initialize printer
      SunmiPrinter.printerInit();

      // Print header
      SunmiPrinter.setAlignment(1); // Center alignment
      SunmiPrinter.printerText("***** RECEIPT *****\n");
      SunmiPrinter.setAlignment(0); // Left alignment

      // Print order details
      order.forEach((item) => {
        SunmiPrinter.printerText(`${item.name} - ₹${item.price}\n`);
      });

      // Print total
      SunmiPrinter.setAlignment(2); // Right alignment
      SunmiPrinter.printerText(`\nTotal: ₹${totalPrice}\n\n`);
      SunmiPrinter.setAlignment(1); // Center alignment
      SunmiPrinter.printerText("************************\n");

      // Feed paper & cut (if supported)
      SunmiPrinter.lineWrap(3);
      SunmiPrinter.cutPaper();
      ToastAndroid.show('Receipt Printed', ToastAndroid.SHORT);
    } catch (error) {
      console.log("Printing error:", error);
      ToastAndroid.show('Error Printing Receipt', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>POS System</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item.name} - ₹{item.price}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.summary}>Order Summary:</Text>
      {order.map((item, index) => (
        <Text key={index} style={styles.orderItem}>{item.name} - ₹{item.price}</Text>
      ))}
      <Text style={styles.total}>Total: ₹{totalPrice}</Text>
      <Button title="Print Receipt" onPress={printReceipt} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  item: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 18,
  },
  summary: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  orderItem: {
    fontSize: 16,
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default App;
