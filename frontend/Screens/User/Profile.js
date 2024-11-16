import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Container } from "native-base";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useFocusEffect } from "@react-navigation/native";
import SyncStorage from "sync-storage";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../Redux/Actions/userActions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FormContainer from "../../Shared/Form/FormContainer";
import * as ImagePicker from "expo-image-picker";

const UserProfile = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

  const defaultImage = "https://rb.gy/hnb4yc";

  // const getProfile = async () => {
  //   const token = await SyncStorage.get("jwt");
  //   if (!token) {
  //     setIsAuthenticated(false);
  //     navigation.navigate("Login");
  //     return;
  //   }
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `${token}`,
  //       },
  //     };
  //     const { data } = await axios.get(`${baseURL}/users/profile`, config);
  //     setUserProfile(data.user);
  //   } catch (error) {
  //     console.error(error);
  //     setIsAuthenticated(false);
  //     navigation.navigate("Login");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const getProfile = async () => {
    const token = await SyncStorage.get("jwt");
    if (!token) {
      setIsAuthenticated(false);
      navigation.navigate("Login");
      return;
    }
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      };
      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      setUserProfile(data.user);
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      navigation.navigate("Login");
    } finally {
      setLoading(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      setIsAuthenticated(true);
      setLoading(false);
      getProfile();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await SyncStorage.remove("jwt");
      setIsAuthenticated(false);
      dispatch(logoutAction());
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <FormContainer>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <>
          <View style={styles.profileSection}>
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={{ uri: userProfile?.image || defaultImage }}
                style={styles.profileImage}
              />
            )}
            <View style={styles.nameContainer}>
              <Text style={styles.profileName}>{userProfile?.name}</Text>
              <Text style={styles.joinedLabel}>
                Joined: {userProfile?.createdAt?.slice(0, 10)}
              </Text>
            </View>
          </View>
  
          {/* User Info */}
          <View style={styles.infoContainer}>
            <MaterialIcons name="email" size={24} color="#333" />
            <Text style={styles.infoText}>{userProfile?.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <MaterialIcons name="phone" size={24} color="#333" />
            <Text style={styles.infoText}>{userProfile?.phone}</Text>
          </View>
          <View style={styles.infoContainer}>
            <MaterialIcons name="info" size={24} color="#333" />
            <Text style={styles.infoText}>{userProfile?.age}</Text>
          </View>
          <View style={styles.infoContainer}>
            <MaterialIcons name="info" size={24} color="#333" />
            <Text style={styles.infoText}>{userProfile?.preference}</Text>
          </View>
          <View style={styles.infoContainer}>
            <MaterialIcons name="home" size={24} color="#333" />
            <Text style={styles.infoText}>
              {userProfile?.city}, {userProfile?.barangay}, {userProfile?.zip},{" "}
              {userProfile?.country}
            </Text>
          </View>
  
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("UpdateProfile")}
              style={styles.actionButton}
            >
              <MaterialIcons name="app-registration" size={24} color="white" />
            </TouchableOpacity>
  
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.actionButton}
            >
              <MaterialIcons name="logout" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      </ScrollView>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  nameContainer: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#333",
  },
  joinedLabel: {
    fontSize: 14,
    color: "gray",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "90%",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  infoText: {
    marginLeft: 10,
    fontFamily: "Roboto",
    color: "#333",
    fontSize: 16,
  },
  changeProfileButton: {
    backgroundColor: "#154314",
    width: "90%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  changeProfileText: {
    color: "white",
    fontFamily: "Roboto",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 30,
  },
  actionButton: {
    backgroundColor: "#154314",
    padding: 15,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  modalButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#154314",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
  },
  modalCloseButton: { 
    marginTop: 20,
    padding: 10,
  }
});

export default UserProfile;