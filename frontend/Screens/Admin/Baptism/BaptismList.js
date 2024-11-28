import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from "react-native";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";

const BaptismList = () => {
  const [baptismForms, setBaptismForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBaptismForms = async () => {
      try {
        const response = await axios.get(`${baseURL}/binyag/list`);
        setBaptismForms(response.data.baptismForms); 
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching baptism forms.");
      } finally {
        setLoading(false);
      }
    };

    fetchBaptismForms();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#154314" />
        <Text style={styles.loadingText}>Loading baptism forms...</Text>
      </View>
    );
  }

  if (error) {
    Alert.alert("Error", error, [{ text: "OK" }]);
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Baptism Forms</Text>
      <FlatList
        data={baptismForms}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Form #{index + 1}</Text>
            <View style={styles.cardContent}>
              <Text>
                <Text style={styles.label}>Child Name:</Text> {item.child.fullName}
              </Text>
              <Text>
                <Text style={styles.label}>Date of Birth:</Text>{" "}
                {new Date(item.child.dateOfBirth).toLocaleDateString()}
              </Text>
              <Text>
                <Text style={styles.label}>Place of Birth:</Text> {item.child.placeOfBirth}
              </Text>
              <Text>
                <Text style={styles.label}>Gender:</Text> {item.child.gender}
              </Text>
              <Text>
                <Text style={styles.label}>Father's Name:</Text> {item.parents.fatherFullName}
              </Text>
              <Text>
                <Text style={styles.label}>Mother's Name:</Text> {item.parents.motherFullName}
              </Text>
              <Text>
                <Text style={styles.label}>Address:</Text> {item.parents.address}
              </Text>
              <Text>
                <Text style={styles.label}>Contact Info:</Text> {item.parents.contactInfo}
              </Text>
              <Text>
                <Text style={styles.label}>Baptism Date:</Text>{" "}
                {new Date(item.baptismDate).toLocaleDateString()}
              </Text>
              <Text>
                <Text style={styles.label}>Church:</Text> {item.church}
              </Text>
              <Text>
                <Text style={styles.label}>Priest:</Text> {item.priest}
              </Text>
              <Text>
                <Text style={styles.label}>Godparents:</Text>{" "}
                {item.godparents.length > 0
                  ? item.godparents.join(", ")
                  : "No godparents specified"}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No baptism forms available.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#154314",
    textAlign: "center",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#154314",
    marginBottom: 8,
  },
  cardContent: {
    marginLeft: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default BaptismList;
