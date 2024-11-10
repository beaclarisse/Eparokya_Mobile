import React, { useState } from "react";
import { View, Text, Button, Image, Alert, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const WeddingForm3 = ({ navigation }) => {
  const [formData, setFormData] = useState({
    birthCertificateBride: null,
    birthCertificateGroom: null,
    pictureBride: null,
    pictureGroom: null,
    baptismalCertificateBride: null,
    baptismalCertificateGroom: null,
  });

  const [imagesPreview, setImagesPreview] = useState({
    birthCertificateBride: null,
    birthCertificateGroom: null,
    pictureBride: null,
    pictureGroom: null,
    baptismalCertificateBride: null,
    baptismalCertificateGroom: null,
  });

  const handleImagePick = async (field) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImagesPreview({ ...imagesPreview, [field]: selectedImage.uri });
      setFormData({ ...formData, [field]: selectedImage.uri });
    }
  };

  const handleNext = () => {
    if (Object.values(formData).some((val) => !val)) {
      Alert.alert("Please upload all required documents!");
      return;
    }

    navigation.navigate("WeddingForm4", {
      ...formData,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Upload Documents and Comments</Text>

      <Button title="Select Bride's Birth Certificate" onPress={() => handleImagePick('birthCertificateBride')} />
      {imagesPreview.birthCertificateBride && <Image source={{ uri: imagesPreview.birthCertificateBride }} style={styles.previewImage} />}

      <Button title="Select Groom's Birth Certificate" onPress={() => handleImagePick('birthCertificateGroom')} />
      {imagesPreview.birthCertificateGroom && <Image source={{ uri: imagesPreview.birthCertificateGroom }} style={styles.previewImage} />}

      <Button title="Select Bride's Picture" onPress={() => handleImagePick('pictureBride')} />
      {imagesPreview.pictureBride && <Image source={{ uri: imagesPreview.pictureBride }} style={styles.previewImage} />}

      <Button title="Select Groom's Picture" onPress={() => handleImagePick('pictureGroom')} />
      {imagesPreview.pictureGroom && <Image source={{ uri: imagesPreview.pictureGroom }} style={styles.previewImage} />}

      <Button title="Select Bride's Baptismal Certificate" onPress={() => handleImagePick('baptismalCertificateBride')} />
      {imagesPreview.baptismalCertificateBride && <Image source={{ uri: imagesPreview.baptismalCertificateBride }} style={styles.previewImage} />}

      <Button title="Select Groom's Baptismal Certificate" onPress={() => handleImagePick('baptismalCertificateGroom')} />
      {imagesPreview.baptismalCertificateGroom && <Image source={{ uri: imagesPreview.baptismalCertificateGroom }} style={styles.previewImage} />}

      <Button title="Next >" onPress={handleNext} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default WeddingForm3;
