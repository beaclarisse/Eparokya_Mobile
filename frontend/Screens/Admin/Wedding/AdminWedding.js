import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image, ScrollView } from "react-native";
import { Card, Box, Heading, VStack, Button } from "native-base";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";

const AdminWedding = ({ navigation }) => {
  const [weddingForms, setWeddingForms] = useState([]);
  const [loading, setLoading] = useState(true);

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

      console.log("Fetched wedding forms:", response.data);

      if (response.data) {
        setWeddingForms(response.data);
      } else {
        console.log("No data received from the API.");
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

  const handleConfirm = async (id) => {
    try {
      const token = await SyncStorage.get("jwt");
      if (!token) {
        Alert.alert("Error", "Token is missing. Please log in again.");
        return;
      }

      await axios.patch(`${baseURL}/wedding/${id}/confirm`, null, {
        headers: { Authorization: `${token}` },
      });

      Alert.alert("Success", "Wedding confirmed.");
      fetchWeddingForms(); // Refresh the data
    } catch (error) {
      console.error("Error confirming wedding:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to confirm the wedding.");
    }
  };

  const handleDecline = async (id) => {
    try {
      const token = await SyncStorage.get("jwt");
      if (!token) {
        Alert.alert("Error", "Token is missing. Please log in again.");
        return;
      }

      await axios.patch(`${baseURL}/wedding/${id}/decline`, null, {
        headers: { Authorization: `${token}` },
      });

      Alert.alert("Success", "Wedding declined.");
      fetchWeddingForms(); 
    } catch (error) {
      console.error("Error declining wedding:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to decline the wedding.");
    }
  };

  const handleCardPress = (item) => {
    navigation.navigate("WeddingDetails", { weddingId: item._id });
  };

  const renderWeddingForm = ({ item }) => {
    if (!item._id) return null;
  
    const { bride, groom, attendees, flowerGirl, ringBearer, weddingDate, weddingStatus } = item;
  
    return (
      <TouchableOpacity onPress={() => handleCardPress(item)}>
        <Card style={styles.card}>
          <VStack space={2}>
            {/* Display Bride & Groom */}
            <Heading size="md" color="white">
              {bride && groom ? `${bride} & ${groom}` : 'Names not available'}
            </Heading>
  
            {/* Wedding Date */}
            <Text style={styles.text}>
              Wedding Date: {weddingDate ? new Date(weddingDate).toLocaleDateString() : 'N/A'}
            </Text>
  
            {/* Status */}
            <Text style={styles.text}>
              Status: {weddingStatus || 'N/A'}
            </Text>
  
            {/* Attendees, Flower Girl, Ring Bearer */}
            <Text style={styles.text}>
              Attendees: {attendees || 'N/A'}
            </Text>
            <Text style={styles.text}>
              Flower Girl: {flowerGirl || 'N/A'} | Ring Bearer: {ringBearer || 'N/A'}
            </Text>
  
            {/* Pending Actions */}
            {weddingStatus === 'Pending' && (
              <View style={styles.buttonContainer}>
                <Button
                  colorScheme="green"
                  onPress={() => handleConfirm(item._id)}
                  style={styles.button}
                >
                  Confirm
                </Button>
                <Button
                  colorScheme="red"
                  onPress={() => handleDecline(item._id)}
                  style={styles.button}
                >
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
      <ScrollView
        horizontal={true}
        style={styles.imageRow}
        contentContainerStyle={styles.imageContentContainer}
      >
        <TouchableOpacity onPress={() => navigation.navigate("UserList")} style={styles.imageContainer}>
          <Image source={require("../../../assets/FORMS.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ConfirmedWedding")} style={styles.imageContainer}>
          <Image source={require("../../../assets/2.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("AdminAvailableDates")} style={styles.imageContainer}>
          <Image source={require("../../../assets/3.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ministryCategory")} style={styles.imageContainer}>
          <Image source={require("../../../assets/4.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ministryList")} style={styles.imageContainer}>
          <Image source={require("../../../assets/5.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("announcementCategory")} style={styles.imageContainer}>
          <Image source={require("../../../assets/6.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("announcementCategoryList")} style={styles.imageContainer}>
          <Image source={require("../../../assets/7.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("announcement")} style={styles.imageContainer}>
          <Image source={require("../../../assets/8.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("CreateMemberYear")} style={styles.imageContainer}>
          <Image source={require("../../../assets/9.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Members")} style={styles.imageContainer}>
          <Image source={require("../../../assets/10.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("MemberList")} style={styles.imageContainer}>
          <Image source={require("../../../assets/11.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("resourceCategory")} style={styles.imageContainer}>
          <Image source={require("../../../assets/12.png")} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("createPostResource")} style={styles.imageContainer}>
          <Image source={require("../../../assets/13.png")} style={styles.image} />
        </TouchableOpacity>
      </ScrollView>

      <Heading style={styles.heading}>Submitted Wedding Forms</Heading>
      {loading ? (
        <Text style={styles.text}>Loading...</Text>
      ) : (
        <FlatList
          data={weddingForms}
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
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    height: 180,
  },
  text: {
    color: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#4CAF50",
  },
  imageRow: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  imageContentContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageContainer: {
    marginRight: 30,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
  },
  heading: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default AdminWedding;
