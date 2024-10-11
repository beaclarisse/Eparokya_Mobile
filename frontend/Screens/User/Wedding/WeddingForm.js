import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Input from "../../../Shared/Form/Input";
import FormContainer from "../../../Shared/Form/FormContainer";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import Error from "../../../Shared/Error";
import axios from "axios";
import SyncStorage from "sync-storage";
import Toast from "react-native-toast-message";
import baseURL from "../../../assets/common/baseUrl";
import DateTimePicker from '@react-native-community/datetimepicker';

const Wedding = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name1: "",
    address1: { state: "", zip: "", country: "" },
    age1: "",
    gender1: "",
    phoneNumber1: "",
    name2: "",
    address2: { state: "", zip: "", country: "" },
    age2: "",
    gender2: "",
    phoneNumber2: "",
    familyNameRelative1: "",
    relationship1: "",
    familyNameRelative2: "",
    relationship2: "",
    attendees: "",
    flowerGirl: "",
    ringBearer: "",
    weddingDate: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleChange = (name, value) => {
    if (name.includes("address1") || name.includes("address2")) {
      const [addressKey, subKey] = name.split(".");
      setFormData({
        ...formData,
        [addressKey]: {
          ...formData[addressKey],
          [subKey]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.weddingDate;
    setShowDatePicker(false);
    setFormData({ ...formData, weddingDate: currentDate.toISOString().split('T')[0] });
  };
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const token = await SyncStorage.get("jwt");
    if (!token) {
      Alert.alert("Error", "Token is missing. Please log in again.");
      return;
    }

    let userId;
    try {
      const config = { headers: { Authorization: `${token}` } };
      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      userId = data.user._id;
    } catch (error) {
      console.error("Failed to retrieve user ID:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Unable to retrieve user ID. Please log in again.");
      return;
    }

    const weddingData = { userId, weddingData: formData };

    if (!formData.name1 || !formData.name2) {
      Alert.alert("Error", "Both names are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/wedding/submit`,
        weddingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Toast.show({ topOffset: 60, type: "success", text1: response.data.message });
      navigation.navigate("Profile");
    } catch (err) {
      console.error("Submission Error:", err.response ? err.response.data : err.message);
      setError(err?.response?.data?.message || "Please try again later");
      Alert.alert("Submission Error", "There was an error submitting the form.");
      Toast.show({
        position: "bottom",
        bottomOffset: 20,
        type: "error",
        text1: err?.response?.data?.message || "Please try again later",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setFormData({
        name1: "",
        address1: { state: "", zip: "", country: "" },
        age1: "",
        gender1: "",
        phoneNumber1: "",
        name2: "",
        address2: { state: "", zip: "", country: "" },
        age2: "",
        gender2: "",
        phoneNumber2: "",
        familyNameRelative1: "",
        relationship1: "",
        familyNameRelative2: "",
        relationship2: "",
        attendees: "",
        flowerGirl: "",
        ringBearer: "",
        weddingDate: "",
      });
    });

    return unsubscribe; // Cleanup the listener on unmount
  }, [navigation]);


  return (
    <FormContainer style={styles.container}>
      {/* Bride */}
      <View style={styles.inputContainer}>
        <Input placeholder="Bride"
          value={formData.name1}
          onChangeText={(text) => handleChange("name1", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="State"
          value={formData.address1.state}
          onChangeText={(text) => handleChange("address1.state", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Zip"
          value={formData.address1.zip}
          onChangeText={(text) => handleChange("address1.zip", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Country"
          value={formData.address1.country}
          onChangeText={(text) => handleChange("address1.country", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Bride Age"
          value={formData.age1}
          onChangeText={(text) => handleChange("age1", text)} keyboardType="numeric" />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Bride Gender"
          value={formData.gender1}
          onChangeText={(text) => handleChange("gender1", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Phone Number 1"
          value={formData.phoneNumber1}
          onChangeText={(text) => handleChange("phoneNumber1", text)} />
      </View>

      {/* Groom */}
      <View style={styles.inputContainer}>
        <Input placeholder="Groom"
          value={formData.name2}
          onChangeText={(text) => handleChange("name2", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="State"
          value={formData.address2.state}
          onChangeText={(text) => handleChange("address2.state", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Zip"
          value={formData.address2.zip}
          onChangeText={(text) => handleChange("address2.zip", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Country"
          value={formData.address2.country}
          onChangeText={(text) => handleChange("address2.country", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Groom Age"
          value={formData.age2}
          onChangeText={(text) => handleChange("age2", text)} keyboardType="numeric" />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Gender 2"
          value={formData.gender2}
          onChangeText={(text) => handleChange("gender2", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Phone Number 2"
          value={formData.phoneNumber2}
          onChangeText={(text) => handleChange("phoneNumber2", text)} />
      </View>

      {/* Detais pa */}

      <View style={styles.inputContainer}>
        <Input placeholder="Family Name Relative 1"
          value={formData.familyNameRelative1}
          onChangeText={(text) => handleChange("familyNameRelative1", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Relationship 1"
          value={formData.relationship1}
          onChangeText={(text) => handleChange("relationship1", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Family Name Relative 2"
          value={formData.familyNameRelative2}
          onChangeText={(text) => handleChange("familyNameRelative2", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Relationship 2"
          value={formData.relationship2}
          onChangeText={(text) => handleChange("relationship2", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Attendees"
          value={formData.attendees}
          onChangeText={(text) => handleChange("attendees", text)} keyboardType="numeric" />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Flower Girl"
          value={formData.flowerGirl}
          onChangeText={(text) => handleChange("flowerGirl", text)} />
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder="Ring Bearer"
          value={formData.ringBearer}
          onChangeText={(text) => handleChange("ringBearer", text)} />
      </View>

      <View style={styles.inputContainer}>
        <Button onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>Select Wedding Date</Text>
        </Button>
        {formData.weddingDate ? (
          <Text>{formData.weddingDate}</Text>
        ) : (
          <Text style={styles.placeholderText}>No date selected</Text>
        )}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(formData.weddingDate || Date.now())}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}


      {error && <Error message={error} />}
      <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </Button>
        <Button style={styles.cancelButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Button>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 60,
  },
  inputContainer: {
    width: "90%",
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%", 
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1C5739',
    width: '40%',
    borderRadius: 20,
    alignSelf: 'center',
  },
  cancelButton: {
    backgroundColor: "#FF6347", 
    width: '40%',
    borderRadius: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: "white",
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    width: '100%',
  },
});

export default Wedding;
