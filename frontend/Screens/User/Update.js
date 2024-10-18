import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SyncStorage from "sync-storage";
import baseURL from "../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RNPickerSelect from 'react-native-picker-select';

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [preference, setPreference] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const navigation = useNavigation();

  const getProfile = async () => {
    setLoading(true);
    const token = await SyncStorage.get("jwt");
    if (!token) {
      setIsAuthenticated(false);
      navigation.navigate("Login");
      return;
    }
    const config = {
      headers: {
        Authorization: `${token}`,
      },
    };
    try {
      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      console.log(data);
      setName(data.user.name);
      setEmail(data.user.email);
      setPhone(data.user.phone);
      setAge(data.user.age);
      setPreference(data.user.preference);
      setBarangay(data.user.barangay);
      setCity(data.user.city);
      setZip(data.user.zip);
      setCountry(data.user.country);
      setAvatarPreview(data.user.image);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
      setError("User not found");
    }
  };

  const updateProfile = async (formData) => {
    const token = await SyncStorage.get("jwt");
    try {
      // const formData = new FormData();
      // formData.append('name', name);
      // formData.append('email', email);
      // formData.append('avatar', avatar);

      const response = await axios.put(
        `${baseURL}/users/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );
      setIsUpdated(true);
    } catch (error) {
      console.error(error.response.data);
      setError("Error updating profile");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
        Alert.alert("Validation Error", "Name and Email are required");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("age", age);
    formData.append("preference", preference);
    formData.append("barangay", barangay);
    formData.append("city", city);
    formData.append("zip", zip);
    formData.append("country", country);
    formData.append("image", avatar);
    setLoading(true);
    updateProfile(formData);
    navigation.navigate("UserProfile");
  };


  const handleChooseAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setAvatar(result.uri); 
      setAvatarPreview(result.uri); 
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Update Profile</Text>
        <Image source={{ uri: avatarPreview }} style={styles.avatar} />
        <TouchableOpacity onPress={handleChooseAvatar}>
          <Text>Choose Avatar</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select Age', value: null }}
            onValueChange={(value) => setAge(value)}
            items={Array.from({ length: 100 }, (_, i) => ({
              label: `${i + 1}`,
              value: i + 1,
            }))}
            style={pickerSelectStyles}
            value={age}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age ? String(age) : ""}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preference</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select Preference', value: null }}
            onValueChange={(value) => setPreference(value)}
            items={[
              { label: 'He', value: 'He' },
              { label: 'She', value: 'She' },
              { label: 'They/Them', value: 'They/Them' },
            ]}
            style={pickerSelectStyles}
            value={preference}
          />
          <TextInput
            style={styles.input}
            placeholder="Preference"
            value={preference || ""}
            editable={false} 
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Barangay"
          value={barangay}
          onChangeText={setBarangay}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Zip Code"
          value={zip}
          onChangeText={setZip}
        />
        <TextInput
          style={styles.input}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
        />

        <TouchableOpacity
          onPress={handleUpdateProfile}
          style={styles.updateButton}
        >
          <MaterialIcons name="done-all" size={40} color="white" />
        </TouchableOpacity>

        {isUpdated && <Text>Profile updated successfully!</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "30%",
    height: 40,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    width: '100%',
  },
});

export default UpdateProfile;