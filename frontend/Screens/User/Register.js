import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { Button, Image } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input.js";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

var { height, width } = Dimensions.get("window");

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  const defaultImage = "https://rb.gy/hnb4yc"; 

  const goToNextPage = () => {
    if (email === "" || name === "" || password === "") {
      setError("Please fill in the form correctly");
      return;
    }
    navigation.navigate("Register2", { email, name, password, selectedImage });
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const handleTakePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const handleRemoveProfile = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      {/* Picture */}
      <FormContainer style={styles.container}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: selectedImage || defaultImage }}
            style={styles.profileImage}
            alt="Profile Image"
          />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Profile</Text>
              <TouchableOpacity
                onPress={handleImagePick}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleTakePhoto}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Take a Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRemoveProfile}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Remove Profile Picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Input
          placeholder={"Email"}
          name={"email"}
          id={"email"}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <Input
          placeholder={"Name"}
          name={"name"}
          id={"name"}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder={"Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.buttonGroup}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Button
          variant={"ghost"}
          onPress={goToNextPage}
          style={styles.arrowButton}
        >
          <View style={styles.arrowIconContainer}>
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </View>
        </Button>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "100%",
    margin: 10,
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontFamily: "Roboto",
  },
  arrowButton: {
    backgroundColor: "transparent",
  },
  arrowIconContainer: {
    width: "100%",
    backgroundColor: "#1C5739",
    borderRadius: 25,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
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
    backgroundColor: "white",
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
  },
});

export default Register;
