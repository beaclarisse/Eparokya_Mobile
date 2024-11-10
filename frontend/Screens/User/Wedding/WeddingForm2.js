import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

const WeddingForm2 = ({ navigation, route }) => {
  // Get data from the previous form (WeddingForm1)
  const { bride, brideAge, bridePhone } = route.params;

  const [formData, setFormData] = useState({
    venue: "",
    officiant: "",
    ceremonyDetails: "",
    receptionDetails: "",
    weddingDate: "",
    attendees: "",
    flowerGirl: "",
    ringBearer: "",
    ceremonyPicture: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || formData.weddingDate;
    setFormData((prevData) => ({
      ...prevData,
      weddingDate: currentDate,
    }));
  };

  const handleNext = () => {
    // You can handle form submission here, and navigate to the next form
    // Pass the data to WeddingForm3 or submit to a backend API
    if (Object.values(formData).some((val) => val === "")) {
      Alert.alert("Please fill all fields!");
      return;
    }

    // Proceed to the next form with all the collected data
    navigation.navigate("WeddingForm3", {
      bride,
      brideAge,
      bridePhone,
      ...formData,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Wedding Details</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Venue"
        value={formData.venue}
        onChangeText={(value) => handleInputChange("venue", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Officiant"
        value={formData.officiant}
        onChangeText={(value) => handleInputChange("officiant", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Ceremony Details"
        value={formData.ceremonyDetails}
        onChangeText={(value) => handleInputChange("ceremonyDetails", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Reception Details"
        value={formData.receptionDetails}
        onChangeText={(value) => handleInputChange("receptionDetails", value)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Wedding Date"
        value={formData.weddingDate ? formData.weddingDate.toLocaleDateString() : ""}
        onFocus={() => setShowDatePicker(true)} // Show the date picker when focused
      />
      
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={formData.weddingDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Number of Attendees"
        keyboardType="numeric"
        value={formData.attendees}
        onChangeText={(value) => handleInputChange("attendees", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Flower Girl"
        value={formData.flowerGirl}
        onChangeText={(value) => handleInputChange("flowerGirl", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Ring Bearer"
        value={formData.ringBearer}
        onChangeText={(value) => handleInputChange("ringBearer", value)}
      />
      {/* You can handle file upload differently in React Native */}
      {/* <Button title="Upload Ceremony Picture" onPress={() => alert("Upload functionality not implemented in this snippet")} /> */}

      <Button title="Next >" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
});

export default WeddingForm2;
