import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import baseURL from "../../../assets/common/baseUrl";

const AnnouncementCategory = () => {
  const [category, setCategory] = useState({
    name: '',
    description: '',
    images: [],
  });
  const [imagesPreview, setImagesPreview] = useState([]);

  const handleChange = (name, value) => {
    setCategory({ ...category, [name]: value });
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Toast.show({ text1: 'Permission to access camera roll is required!' });
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImages = result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type || 'image/jpeg', // Set default type
        name: asset.uri.split('/').pop(),
      }));
      setImagesPreview(selectedImages.map(image => image.uri)); // Preview with URIs
      setCategory({ ...category, images: selectedImages }); // Store asset objects
    }
  };
  
  const submitForm = async () => {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('description', category.description);
  
    category.images.forEach((image) => {
      formData.append('images', image);
    });
  
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
  
      await axios
      .post(`${baseURL}/announcementCategory/create`, formData, config);
      Toast.show({ text1: 'Announcement Category Created Successfully!' });
      setCategory({ name: '', description: '', images: [] });
      setImagesPreview([]);
    } catch (error) {
        console.log(error); // This will log the entire error object
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error status:', error.response.status);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        Toast.show({ text1: 'Network Error', text2: error.message });
      }
      
  };
  

  return (
    <Fragment>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24 }}>Create Announcement Category</Text>
          <TextInput
            placeholder="Name"
            value={category.name}
            onChangeText={(value) => handleChange('name', value)}
            style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
          />
          <TextInput
            placeholder="Description"
            value={category.description}
            onChangeText={(value) => handleChange('description', value)}
            style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
          />
          <Button title="Pick Images" onPress={handleImagePick} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {imagesPreview.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={{ width: 100, height: 100, margin: 5 }} />
            ))}
          </View>
          <Button title="Create Announcement Category" onPress={submitForm} />
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default AnnouncementCategory;
