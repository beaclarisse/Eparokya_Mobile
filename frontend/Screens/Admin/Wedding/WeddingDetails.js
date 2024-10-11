import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import axios from 'axios';
import baseURL from '../../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeddingDetails = ({ route, navigation }) => {
  const { weddingId } = route.params;  
  console.log({ weddingId });
  const [weddingDetails, setWeddingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      const token = await AsyncStorage.getItem("jwt"); 
      try {
        const response = await axios.get(`${baseURL}/wedding/${weddingId}`, {
          headers: { Authorization: `${token}` }, 
        });
        setWeddingDetails(response.data); 
      } catch (err) {
        console.error(err);
        setError('Failed to fetch wedding details');
        Alert.alert("Error", "Could not retrieve wedding details.");
      } finally {
        setLoading(false);  
      }
    };
  
    fetchWeddingDetails();  
  }, [weddingId]);  
  
  const handleConfirm = async () => {
    const token = await AsyncStorage.getItem("jwt");
    try {
      await axios.patch(`${baseURL}/wedding/${weddingId}/confirm`, null, {
        headers: { Authorization: `${token}` },
      });
      Alert.alert("Success", "Wedding confirmed.");
      navigation.goBack(); // Go back after confirmation
    } catch (error) {
      Alert.alert("Error", "Failed to confirm the wedding.");
    }
  };

  const handleDecline = async () => {
    const token = await AsyncStorage.getItem("jwt");
    try {
      await axios.patch(`${baseURL}/wedding/${weddingId}/decline`, null, {
        headers: { Authorization: `${token}` },
      });
      Alert.alert("Success", "Wedding declined.");
      navigation.goBack(); 
    } catch (error) {
      Alert.alert("Error", "Failed to decline the wedding.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1C5739" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!weddingDetails) {
    return (
      <View style={styles.container}>
        <Text>No wedding details available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bride: {weddingDetails.name1}</Text>
      <Text style={styles.label}>State: {weddingDetails.address1.state}</Text>
      <Text style={styles.label}>Age: {weddingDetails.age1}</Text>
      <Text style={styles.label}>Gender: {weddingDetails.gender1}</Text>
      <Text style={styles.label}>Phone Number: {weddingDetails.phoneNumber1}</Text>
    
      <Text style={styles.label}>Groom: {weddingDetails.name2}</Text>
      <Text style={styles.label}>State: {weddingDetails.address2.state}</Text>
      <Text style={styles.label}>Age: {weddingDetails.age2}</Text>
      <Text style={styles.label}>Gender: {weddingDetails.gender2}</Text>
      <Text style={styles.label}>Phone Number: {weddingDetails.phoneNumber2}</Text>

      <Text style={styles.label}>Wedding Date: {new Date(weddingDetails.weddingDate).toLocaleDateString()}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Confirm" onPress={handleConfirm} color="#1C5739" />
        <Button title="Decline" onPress={handleDecline} color="#FF4C4C" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default WeddingDetails;
