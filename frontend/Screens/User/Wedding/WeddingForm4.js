import React, { useState } from 'react';
import { View, Text, Button, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import SyncStorage from 'sync-storage';
import Toast from 'react-native-toast-message';

const WeddingForm4 = () => {
  const navigation = useNavigation();

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
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImagesPreview({ ...imagesPreview, [field]: selectedImage.uri });
      setFormData({ ...formData, [field]: selectedImage });
    }
  };

  const handleNext = () => {
    // Save form data temporarily (you can also save to SyncStorage or context)
    SyncStorage.set('weddingForm4Data', formData);

    // Navigate to WeddingForm5
    navigation.navigate('WeddingForm5');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Upload Documents and Pictures</Text>

      {/* Bride and Groom Birth Certificates */}
      <Button title="Upload Birth Certificate (Bride)" onPress={() => handleImagePick('birthCertificateBride')} />
      {imagesPreview.birthCertificateBride && <Image source={{ uri: imagesPreview.birthCertificateBride }} style={{ width: 100, height: 100, margin: 5 }} />}
      
      <Button title="Upload Birth Certificate (Groom)" onPress={() => handleImagePick('birthCertificateGroom')} />
      {imagesPreview.birthCertificateGroom && <Image source={{ uri: imagesPreview.birthCertificateGroom }} style={{ width: 100, height: 100, margin: 5 }} />}

      {/* Bride and Groom Pictures */}
      <Button title="Upload Picture (Bride)" onPress={() => handleImagePick('pictureBride')} />
      {imagesPreview.pictureBride && <Image source={{ uri: imagesPreview.pictureBride }} style={{ width: 100, height: 100, margin: 5 }} />}

      <Button title="Upload Picture (Groom)" onPress={() => handleImagePick('pictureGroom')} />
      {imagesPreview.pictureGroom && <Image source={{ uri: imagesPreview.pictureGroom }} style={{ width: 100, height: 100, margin: 5 }} />}

      {/* Baptismal Certificates */}
      <Button title="Upload Baptismal Certificate (Bride)" onPress={() => handleImagePick('baptismalCertificateBride')} />
      {imagesPreview.baptismalCertificateBride && <Image source={{ uri: imagesPreview.baptismalCertificateBride }} style={{ width: 100, height: 100, margin: 5 }} />}
      
      <Button title="Upload Baptismal Certificate (Groom)" onPress={() => handleImagePick('baptismalCertificateGroom')} />
      {imagesPreview.baptismalCertificateGroom && <Image source={{ uri: imagesPreview.baptismalCertificateGroom }} style={{ width: 100, height: 100, margin: 5 }} />}

      <Button title="Next >" onPress={handleNext} />
    </ScrollView>
  );
};

export default WeddingForm4;
