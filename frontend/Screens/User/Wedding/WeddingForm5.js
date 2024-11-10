import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { getUserProfile } from "../../../utils/user";
import SyncStorage from 'sync-storage';
import { getToken } from '../../../utils/user';

const WeddingForm5 = () => {
  const [formData, setFormData] = useState(null);
  const [userId, setUserId] = useState(null);

  // Retrieve saved form data and user profile when the component mounts
  useEffect(() => {
    const savedData = SyncStorage.get('weddingForm4Data');
    if (savedData) {
      setFormData(savedData);
    } else {
      Alert.alert('Error', 'No data found. Please go back to the previous form.');
    }

    // Fetch user profile to obtain user ID
    const fetchUserId = async () => {
      const userProfile = await getUserProfile();
      if (userProfile) {
        setUserId(userProfile.id);
      } else {
        Alert.alert('Error', 'User not authenticated. Please log in again.');
      }
    };

    fetchUserId();
  }, []);

  // Submit form data to the backend
  const handleSubmit = async () => {
    if (!formData) {
      Alert.alert('Error', 'No form data available.');
      return;
    }
    
    const token = await getToken();
    console.log(token)
    if (!token) {
      Alert.alert('Error', 'Token is missing. Please log in again.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID is missing.');
      return;
    }
    

    try {
      const data = {
        ...formData,
        userId,
      };

      const response = await axios.post(`${baseURL}/weddings`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Your form has been successfully submitted.',
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert('Submission Error', 'There was an error submitting your form. Please try again.');
    }
  };

  return (
    <View>
      <Text>Wedding Form 5 - Submit Data</Text>
      <Button title="Submit Form" onPress={handleSubmit} />
    </View>
  );
};

export default WeddingForm5;
