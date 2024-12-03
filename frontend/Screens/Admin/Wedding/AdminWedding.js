import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ScrollView } from "react-native";
import { Card, Box, Heading, VStack } from "native-base";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";

const AdminWedding = ({ navigation }) => {
  const [weddingForms, setWeddingForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState("All");

  const fetchWeddingForms = async () => {
    setLoading(true);
    const token = await SyncStorage.get("jwt");

    if (!token) {
      Alert.alert("Error", "Token is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/wedding`, {
        headers: { Authorization: `${token}` },
      });

      console.log("Fetched wedding forms response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setWeddingForms(response.data);
      } else {
        console.log("No data or unexpected format received:", response.data);
        setWeddingForms([]);
      }
    } catch (error) {
      console.error("Error fetching wedding forms:", error.response?.data || error.message);
      Alert.alert("Error", "Unable to fetch wedding forms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeddingForms();
  }, []);

  const handleCardPress = (item) => {
    navigation.navigate("WeddingDetails", { weddingId: item._id });
  };

  const filterWeddingForms = (status) => {
    if (status === "All") {
      return weddingForms;
    }
    return weddingForms.filter((wedding) => wedding.weddingStatus === status);
  };

  const renderWeddingForm = ({ item }) => {
    if (!item._id) return null;

    const { bride, groom, attendees, flowerGirl, ringBearer, weddingDate, weddingStatus } = item;

    console.log("Rendering wedding form item:", item);

    const statusColor =
      weddingStatus === "Confirmed"
        ? "green"
        : weddingStatus === "Declined"
          ? "red"
          : "orange";

    return (
      <TouchableOpacity onPress={() => handleCardPress(item)}>
        <Card style={styles.card}>
          <VStack space={2}>
            <Heading size="md" style={[styles.nameText, { color: "black" }]}>
              {bride && groom ? `${bride} & ${groom}` : "Names not available"}
            </Heading>


            <Text style={styles.text}>
              Wedding Date: {weddingDate ? new Date(weddingDate).toLocaleDateString() : "N/A"}
            </Text>

            <Text style={[styles.text, { color: statusColor }]}>
              Status: {weddingStatus || "N/A"}
            </Text>

            <Text style={styles.text}>
              Attendees: {attendees != null ? attendees : "N/A"}
            </Text>

            <Text style={styles.text}>
              Flower Girl: {flowerGirl || "N/A"} | Ring Bearer: {ringBearer || "N/A"}
            </Text>
          </VStack>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Box style={styles.container}>
      <ScrollView horizontal={true} style={styles.imageRow} contentContainerStyle={styles.imageContentContainer}></ScrollView>

      <Heading style={styles.heading}>Submitted Wedding Forms</Heading>

      <View style={styles.filterContainer}>
        {['All', 'Confirmed', 'Pending', 'Declined'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filteredStatus === status && styles.activeFilterButton]}
            onPress={() => setFilteredStatus(status)}
          >
            <Text style={styles.filterText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Text style={styles.text}>Loading...</Text>
      ) : (
        <FlatList
          data={filterWeddingForms(filteredStatus)}
          renderItem={renderWeddingForm}
          keyExtractor={(item) => item._id?.toString()}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b3cf99",
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    height: 180,
  },
  text: {
    color: "black",
  },
  nameText: {
    color: "black",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
  activeFilterButton: {
    backgroundColor: "#1C5739",
  },
  filterText: {
    color: "#fff",
  },
  heading: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
});


export default AdminWedding;
