import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import baseURL from '../../../assets/common/baseUrl';

const WeddingDetails = ({ route }) => {
  const { weddingId } = route.params;  
  const [weddingDetails, setWeddingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/wedding/${weddingId}`);
        setWeddingDetails(response.data); 
      } catch (err) {
        setError('Failed to fetch wedding details');
        Alert.alert("Error", "Could not retrieve wedding details.");
      } finally {
        setLoading(false);  
      }
    };

    fetchWeddingDetails();  
  }, [weddingId]);  
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

      <Text style={styles.label}>Wedding Date: {weddingDetails.weddingDate}</Text>
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
});

export default WeddingDetails;
