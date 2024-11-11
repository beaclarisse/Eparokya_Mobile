import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Input from "../../Shared/Form/Input";
import FormContainer from "../../Shared/Form/FormContainer";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import Error from "../../Shared/Error";
import axios from "axios";
import SyncStorage from "sync-storage";
import { useDispatch } from "react-redux";
import { loginAction } from "../../Redux/Actions/userActions";
import { Image } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"; // Import icons
import Toast from "react-native-toast-message";
import baseURL from "../../assets/common/baseUrl";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const login = async (values) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/login`, values);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: data.message,
      });
      console.log(data);  // Logs the entire response
  
      // Save JWT token and user information
      SyncStorage.set("jwt", data.token);
      SyncStorage.set("user", JSON.stringify(data.user));
  
      // Save userId separately for easy access
      SyncStorage.set("userId", data.user._id);  // Save the user ID correctly here
      console.log('Stored userId:', SyncStorage.get("userId"));  // Log the userId to verify it's saved correctly
  
      navigation.navigate("UserProfile");
    } catch (err) {
      console.log(err);
      Alert.alert("Login Error", "Wrong username and password");
      Toast.show({
        position: "bottom",
        bottomOffset: 20,
        type: "error",
        text1: err?.response?.data?.message || "Please try again later",
      });
    }
  };
  
  
  

  const handleSubmit = () => {
    const values = { email: email, password: password };
    login(values);
    dispatch(loginAction(values));
  };


  return (
    <FormContainer style={styles.container}>
      <Image
        source={require("../../assets/EParokya_WCP.png")}
        style={{ width: 250, height: 260, marginRight: 10 }}
      />

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="gray" style={styles.icon} />
        <Input
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="gray" style={styles.icon} />
        <Input
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      {error && <Error message={error} />}
      <Button style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </Button>

      <Button
        style={styles.signupButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Button>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: '80%',
    marginBottom: 20,
    borderColor: 'gray',
  },
  icon: {
    marginRight: 10, 
  },
  input: {
    flex: 1,
    padding: 5,
    borderWidth: 0, 
    backgroundColor: 'transparent',
  },
  button: {
    width: "80%",
    marginTop: 20,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#1C5739",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: 'gray',
    marginTop: 20,
    width: '80%',
    borderRadius: 20,
    alignSelf: 'center',
  }
});

export default Login;
