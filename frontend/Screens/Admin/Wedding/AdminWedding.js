import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from "react-native";
import { Card, Box, Heading, VStack, Button, Icon } from "native-base";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { MaterialIcons } from 'react-native-vector-icons';

const AdminWedding = ({ navigation }) => {
  const [weddingForms, setWeddingForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeddingForms = async () => {
      const token = await SyncStorage.get("jwt");
      if (!token) {
        Alert.alert("Error", "Token is missing. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(`${baseURL}/wedding`, {
          headers: { Authorization: `${token}` },
        });
        setWeddingForms(response.data);
      } catch (error) {
        console.log(`Fetching wedding details from: ${baseURL}/wedding/${weddingId}`);
        Alert.alert("Error", "Unable to fetch wedding forms.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeddingForms();
  }, []);

  const handleConfirm = async (id) => {
    try {
      const token = await SyncStorage.get("jwt");
      await axios.patch(`${baseURL}/wedding/${id}/confirm`, null, {
        headers: { Authorization: `${token}` },
      });
      Alert.alert("Success", "Wedding confirmed.");
      fetchWeddingForms(); 
    } catch (error) {
      Alert.alert("Error", "Failed to confirm the wedding.");
    }
  };

  const handleDecline = async (id) => {
    try {
      const token = await SyncStorage.get("jwt");
      await axios.patch(`${baseURL}/wedding/${id}/decline`, null, {
        headers: { Authorization: `${token}` },
      });
      Alert.alert("Success", "Wedding declined.");
      fetchWeddingForms();
    } catch (error) {
      Alert.alert("Error", "Failed to decline the wedding.");
    }
  };

  const handleCardPress = (item) => {
    navigation.navigate("WeddingDetails", { weddingId: item._id });
  };

  const handleConfirmedWeddingsNavigation = () => {
    navigation.navigate("ConfirmedWedding"); 
  };

  const handleWeddingDates = () => {
    navigation.navigate("AdminAvailableDates"); 
  };

  
  const handleUserListNavigation = () => {
    navigation.navigate("UserList");
  };

  const handleministryCatgeoryNavigation = () => {
    navigation.navigate("ministryCategory");
  };


  const renderWeddingForm = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleCardPress(item)}>
      <Card style={styles.card}>
        <VStack space={2}>
          <Heading size="md">
            {item.name1} {item.name2 ? `& ${item.name2}` : ""}
          </Heading>
          <Text>Wedding Date: {new Date(item.weddingDate).toLocaleDateString()}</Text>
          <Text>Status: {item.weddingStatus}</Text>
          
          {item.status === "pending" && (
            <View style={styles.buttonContainer}>
              <Button colorScheme="green" onPress={() => handleConfirm(item._id)} style={styles.button}>
                Confirm
              </Button>
              <Button colorScheme="red" onPress={() => handleDecline(item._id)} style={styles.button}>
                Cancel
              </Button>
            </View>
          )}
        </VStack>
      </Card>
    </TouchableOpacity>
  );
};

  return (
    <Box style={styles.container}>
      <TouchableOpacity onPress={handleUserListNavigation} style={styles.iconContainer}>
        <Icon as={MaterialIcons} name="group" size={6} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleConfirmedWeddingsNavigation} style={styles.iconContainer}>
        <Icon as={MaterialIcons} name="check-circle" size={6} color="green" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleWeddingDates} style={styles.iconContainer}>
        <Icon as={MaterialIcons} name="check-circle" size={6} color="green" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleministryCatgeoryNavigation} style={styles.iconContainer}>
        <Icon as={MaterialIcons} name="group" size={6} color="green" />
      </TouchableOpacity>

      <Heading style={styles.heading}>Submitted Wedding Forms</Heading>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={weddingForms}
          renderItem={renderWeddingForm}
          keyExtractor={(item) => item._id}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    height: 180,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default AdminWedding;
