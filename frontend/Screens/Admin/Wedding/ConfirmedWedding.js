import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { Card, Box, Heading, VStack } from "native-base";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";

const ConfirmedWedding = () => {
  const [confirmedWeddings, setConfirmedWeddings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConfirmedWeddings = async () => {
    const token = await SyncStorage.get("jwt");
    if (!token) {
      Alert.alert("Error", "Token is missing. Please log in again.");
      return;
    }
  
    try {
      const response = await axios.get(`${baseURL}/wedding/confirmed`, {
        headers: { Authorization: `${token}` },
      });
      setConfirmedWeddings(response.data);
    } catch (error) {
      console.error("Error fetching confirmed weddings:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Unable to fetch confirmed weddings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmedWeddings();
  }, []);

  const renderWeddingForm = ({ item }) => (
    <Card style={styles.card}>
      <VStack space={2}>
        <Heading size="md">{item.name1} & {item.name2}</Heading>
        <Text>Wedding Date: {new Date(item.weddingDate).toLocaleDateString()}</Text>
        <Text>Status: {item.weddingStatus}</Text>
      </VStack>
    </Card>
  );

  return (
    <Box style={styles.container}>
      <Heading style={styles.heading}>Confirmed Weddings</Heading>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={confirmedWeddings}
          renderItem={renderWeddingForm}
          keyExtractor={(item) => item._id}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    marginBottom: 10,
    fontSize: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
});

export default ConfirmedWedding;
