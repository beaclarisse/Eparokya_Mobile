import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Select, CheckIcon } from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import baseURL from '../../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeddingDetails = ({ route, navigation }) => {
  const { weddingId } = route.params;
  const [weddingDetails, setWeddingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priest, setPriest] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedComment, setSelectedComment] = useState('');
  const [additionalComment, setAdditionalComment] = useState('');
  const [comments, setComments] = useState([]);

  const predefinedComments = [
    "Confirmed and on schedule",
    "Rescheduled - awaiting response",
    "Pending final confirmation",
    "Cancelled by user",
  ];

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await axios.get(`${baseURL}/wedding/${weddingId}`, {
          headers: { Authorization: `${token}` },
        });

        setWeddingDetails(response.data);
        setSelectedDate(new Date(response.data.weddingDate));

        // Check if `comments` exists and is an array
        const parsedComments = Array.isArray(response.data.comments)
          ? response.data.comments.map(comment => {
            const scheduledDate = comment.scheduledDate ? new Date(comment.scheduledDate) : null;
            console.log('Original scheduledDate:', comment.scheduledDate, 'Parsed Date:', scheduledDate);
            return {
              ...comment,
              scheduledDate,
            };
          })
          : [];  // If not, set an empty array

        setComments(parsedComments);
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




  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const handleSubmitComment = async () => {
    const token = await AsyncStorage.getItem("jwt");
    const newComment = {
      priest,
      scheduledDate: selectedDate,
      selectedComment,
      additionalComment,
    };

    try {
      const response = await axios.post(`${baseURL}/wedding/${weddingId}/admin/addComment`, newComment, {
        headers: { Authorization: `${token}` },
      });
      const commentToDisplay = {
        ...response.data,
        scheduledDate: response.data.scheduledDate ? new Date(response.data.scheduledDate) : null,
      };

      setComments([...comments, commentToDisplay]);
      setPriest('');
      setSelectedDate(null);
      setSelectedComment('');
      setAdditionalComment('');
      Alert.alert("Success", "Comment submitted.");
    } catch (error) {
      console.error("Error submitting comment:", error.response ? error.response.data : error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to submit the comment.");
    }
  };
  const handleConfirm = async () => {
    const token = await AsyncStorage.getItem("jwt");
    try {
      await axios.patch(`${baseURL}/wedding/${weddingId}/confirm`, null, {
        headers: { Authorization: `${token}` },
      });
      Alert.alert("Success", "Wedding confirmed.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to confirm the wedding.");
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

  if (loading) return <ActivityIndicator size="large" color="#1C5739" />;

  if (error) return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView>
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
        <Text style={styles.label}>Status: {weddingDetails.weddingStatus}</Text>

        {/* Admin Comment Section */}
        <View style={styles.adminSection}>
          <TextInput
            style={styles.input}
            placeholder="Priest Name"
            value={priest}
            onChangeText={(text) => setPriest(text)}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>
              {selectedDate ? selectedDate.toLocaleDateString() : "Set Scheduled Date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <Select
            selectedValue={selectedComment}
            minWidth="200"
            accessibilityLabel="Select a comment"
            placeholder="Select a comment"
            _selectedItem={{
              bg: "cyan.600",
              endIcon: <CheckIcon size="5" />,
            }}
            onValueChange={(value) => setSelectedComment(value)}
          >
            {predefinedComments.map((comment, index) => (
              <Select.Item label={comment} value={comment} key={index} />
            ))}
          </Select>

          <TextInput
            style={styles.input}
            placeholder="Additional Comment (optional)"
            value={additionalComment}
            onChangeText={(text) => setAdditionalComment(text)}
          />

          <Button title="Submit Comment" onPress={handleSubmitComment} color="#1C5739" />
        </View>

        {/* Display Submitted Comments */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments:</Text>
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment, index) => (
              <View key={index} style={styles.commentContainer}>
                <Text style={styles.commentText}>Priest: {comment.priest}</Text>
                <Text style={styles.commentText}>
                  Scheduled Date: {comment.scheduledDate ? comment.scheduledDate.toLocaleDateString() : 'Not set'}
                </Text>
                <Text style={styles.commentText}>Selected Comment: {comment.selectedComment}</Text>
                <Text style={styles.commentText}>Additional Comment: {comment.additionalComment}</Text>
              </View>
            ))
          ) : (
            <Text>No comments yet.</Text>
          )}

        </View>

        <View style={styles.buttonContainer}>
          <Button title="Confirm" onPress={handleConfirm} color="#1C5739" />
          <Button title="Decline" onPress={handleDecline} color="#FF4C4C" />
        </View>
      </ScrollView>
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
  adminSection: {
    marginTop: 20,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  dateButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    color: "#000",
  },
  commentsSection: {
    marginTop: 20,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentContainer: {
    marginBottom: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentText: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default WeddingDetails;
