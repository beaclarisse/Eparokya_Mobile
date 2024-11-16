import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import SyncStorage from 'sync-storage';
import baseURL from "../../../assets/common/baseUrl";

const WeddingForm3 = ({ navigation, route }) => {
  const { bride, brideAge, brideGender, bridePhone, brideAddress,
    groom, groomAge, groomGender, groomPhone, groomAddress } = route.params;

  const [attendees, setAttendees] = useState('');
  const [flowerGirl, setFlowerGirl] = useState('');
  const [ringBearer, setRingBearer] = useState('');
  const [weddingDate, setWeddingDate] = useState(new Date());
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // New state variables for the missing fields
  const [groomRelative, setGroomRelative] = useState('');
  const [groomRelationship, setGroomRelationship] = useState('');
  const [brideRelative, setBrideRelative] = useState('');
  const [brideRelationship, setBrideRelationship] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SyncStorage.get("jwt");
        console.log("JWT Token:", token);

        if (!token) {
          Alert.alert("Error", "Token is missing. Please log in again.");
          navigation.navigate("LoginPage");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${baseURL}/users/profile`, config);
        setUserId(data.user._id);
        console.log('User ID:', data.user._id);  // Log the user ID to verify
      } catch (error) {
        console.error("Failed to retrieve user ID:", error.response ? error.response.data : error.message);
        Alert.alert("Error", "Unable to retrieve user ID. Please log in again.");
        navigation.navigate("LoginPage");
      }
    };

    fetchUserData();
  }, [navigation]);

  const handleSubmit = async () => {
    // Check for missing required fields
    if (!attendees || !flowerGirl || !ringBearer || !groomRelative || !groomRelationship || !brideRelative || !brideRelationship || !userId) {
      setError('Please fill in all fields and ensure you are logged in.');
      return;
    }

    const formattedBrideAge = Number(brideAge);  
    const formattedGroomAge = Number(groomAge);  
    const cleanedBrideGender = brideGender.trim(); 
    const cleanedGroomGender = groomGender.trim();  

    const weddingData = {
      bride: bride || "", // Ensure bride name is not undefined
      brideAge: formattedBrideAge || 0, // Ensure brideAge is a number
      brideGender: cleanedBrideGender || "", // Ensure brideGender is not undefined
      bridePhone: bridePhone || "", // Ensure bridePhone is a valid string
      brideAddress: {
        country: brideAddress.country || "", // Ensure country is valid
        state: brideAddress.state || "",
        zip: brideAddress.zip || "", 
      },
    
      groom: groom || "", 
      groomAge: formattedGroomAge || 0, 
      groomGender: cleanedGroomGender || "", 
      groomPhone: groomPhone || "", 
      groomAddress: {
        country: groomAddress.country || "", 
        state: groomAddress.state || "", 
        zip: groomAddress.zip || "", 
      },
      
      BrideRelative: brideRelative || "",
      BrideRelationship: brideRelationship || "",
      GroomRelative: groomRelative || "",
      GroomRelationship: groomRelationship || "",
      attendees: String(attendees),
      flowerGirl: flowerGirl || "", 
      ringBearer: ringBearer || "", 
      weddingDate: weddingDate ? weddingDate.toISOString() : "", 
    };

    console.log('Wedding Data:', weddingData);

    const payload = {
      userId, // Pass the logged-in user ID
      weddingData, // All wedding form data wrapped in weddingData
    };

    console.log('Final Payload:', payload); // Log the payload to verify

    try {
      // Check if JWT is available
      const token = await SyncStorage.get("jwt");
      if (!token) {
        Alert.alert("Error", "Authentication token is missing. Please log in again.");
        navigation.navigate("Profile");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${baseURL}/wedding/submit`, payload, config);

      console.log('Wedding data submitted successfully:', response.data);
      Alert.alert("Success", "Wedding form submitted successfully!");
      navigation.navigate('ConfirmationPage');
    } catch (error) {
      console.error('Error submitting wedding data:', error.response ? error.response.data : error.message);
      setError('An error occurred while submitting your wedding details. Please try again.');
    }
  };

  // Clear all form fields
  const clearForm = () => {
    setAttendees('');
    setFlowerGirl('');
    setRingBearer('');
    setGroomRelative('');
    setGroomRelationship('');
    setBrideRelative('');
    setBrideRelationship('');
    setWeddingDate(new Date());
    setError('');
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="Number of Attendees"
        keyboardType="numeric"
        value={attendees}
        onChangeText={setAttendees}
        style={styles.input}
      />
      <TextInput
        placeholder="Flower Girl"
        value={flowerGirl}
        onChangeText={setFlowerGirl}
        style={styles.input}
      />
      <TextInput
        placeholder="Ring Bearer"
        value={ringBearer}
        onChangeText={setRingBearer}
        style={styles.input}
      />

      <TextInput
        placeholder="Groom's Relative"
        value={groomRelative}
        onChangeText={setGroomRelative}
        style={styles.input}
      />

      <TextInput
        placeholder="Groom's Relationship"
        value={groomRelationship}
        onChangeText={setGroomRelationship}
        style={styles.input}
      />
      <TextInput
        placeholder="Bride's Relative"
        value={brideRelative}
        onChangeText={setBrideRelative}
        style={styles.input}
      />

      <TextInput
        placeholder="Bride's Relationship"
        value={brideRelationship}
        onChangeText={setBrideRelationship}
        style={styles.input}
      />

      <Button title="Pick a Date" onPress={() => setShowDatePicker(true)} />

      {showDatePicker && (
        <DateTimePicker
          value={weddingDate}
          onChange={(event, selectedDate) => {
            setWeddingDate(selectedDate || weddingDate);
            setShowDatePicker(false);
          }}
          mode="date"
          display="spinner"
          style={styles.datePicker}
        />
      )}

      <Button title="Submit" onPress={handleSubmit} />
      
      {/* Clear Button */}
      <Button title="Clear" onPress={clearForm} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' },
  datePicker: { marginBottom: 10 },
  error: { color: 'red', marginBottom: 10 },
});

export default WeddingForm3;
