import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MainContext } from "../MyContext";
import { Picker } from "@react-native-picker/picker";

const OptionScreen = ({ navigation }) => {
    const { language, languages, setLanguage } = useContext(MainContext);

    return (
        <View style={styles.container}>
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

            <TouchableOpacity 
                style={[styles.button, styles.coursesButton]} 
                onPress={() => navigation.navigate("Grades")}
            >
                <Text style={styles.buttonText}>
                    {language === "English" ? "Courses" : "الدورات"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button, styles.reportsButton]} 
                onPress={() => navigation.navigate("ReportScreen")}
            >
                <Text style={styles.buttonText}>
                    {language === "English" ? "Reports" : "التقارير"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    position: "relative",
  },
  pickerContainer: {
    position: "absolute",
    top: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  button: {
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  coursesButton: {
    backgroundColor: "#28a745",
  },
  reportsButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OptionScreen;
