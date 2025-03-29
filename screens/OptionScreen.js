import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { MainContext } from "../MyContext";
import { Picker } from "@react-native-picker/picker";

const OptionScreen = ({ navigation }) => {
  const { language, languages, setLanguage, languageData } = useContext(MainContext);
  const [modalVisible, setModalVisible] = useState(false);

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
        onPress={() => setModalVisible(true)}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{languageData['course_type_selction'][language]}</Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.gradeButton]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Grades");
              }}
            >
              <Text style={styles.modalButtonText}>{languageData['course_by_grade'][language]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.teacherButton]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Teachers");
              }}
            >
              <Text style={styles.modalButtonText}>{languageData['course_by_teacher'][language]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{languageData['course_type_selction_close'][language]}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButton: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  gradeButton: {
    backgroundColor: "#007bff",
  },
  teacherButton: {
    backgroundColor: "#17a2b8",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#333",
  },
});

export default OptionScreen;
