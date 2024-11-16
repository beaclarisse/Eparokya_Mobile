import React, { useState, useEffect } from 'react';
import { View,
   Text, 
   StyleSheet, 
   FlatList, 
   TouchableOpacity, 
   Image, 
   ScrollView, 
   TextInput } from 'react-native';
import Toast from 'react-native-toast-message'; 
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from "sync-storage";

const AnnouncementPage = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/announcementCategory/`);
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${baseURL}/announcement/`);
        setAnnouncements(response.data);
      } catch (err) {
        setError("Failed to fetch announcements.");
        console.log('Error:', err);
      }
    };

    fetchCategories();
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = selectedCategory
    ? announcements.filter(announcement =>
        announcement.announcementCategory && announcement.announcementCategory._id === selectedCategory
      )
    : announcements;

  const handleLike = async (announcementId) => {
    const token = await SyncStorage.get("jwt");
    if (!token) {
      console.error('No token found');
      return;
    }

    const announcement = announcements.find(item => item._id === announcementId);
    const isLiked = announcement && announcement.liked;

    try {
      await axios.put(
        `${baseURL}/announcement/like/${announcementId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnnouncements(prevAnnouncements =>
        prevAnnouncements.map(item =>
          item._id === announcementId
            ? { ...item, likes: isLiked ? item.likes - 1 : item.likes + 1, liked: !isLiked }
            : item
        )
      );
    } catch (error) {
      console.error("Error liking announcement:", error);
    }
  };

  const handleComment = async (announcementId, commentText) => {
    const token = await SyncStorage.get("jwt");
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/announcement/comment/${announcementId}`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnnouncements(prevAnnouncements =>
        prevAnnouncements.map(item =>
          item._id === announcementId
            ? {
                ...item,
                comments: [...item.comments, response.data],
              }
            : item
        )
      );
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Comment Added!',
        text2: 'Your comment was successfully posted.',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });

    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {error ? (
        <Text>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category._id}
                style={[styles.categoryIcon, selectedCategory === category._id && styles.selectedCategory]}
                onPress={() => setSelectedCategory(category._id)}
              >
                {category.image && (
                  <Image source={{ uri: category.image }} style={styles.categoryImage} />
                )}
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={filteredAnnouncements}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  navigation.navigate("Profile", {
                    screen: "AnnouncementDetail", 
                    params: { announcementId: item._id }, 
                  });
                }}
              >
                <Text style={styles.title}>{item.name || 'No title available'}</Text>
                <Text>{item.description || 'No description available'}</Text>
                {item.image && <Image source={{ uri: item.image }} style={styles.media} />}
                {item.video && <Text style={styles.media}>Video: {item.video}</Text>}

                <View style={styles.interactionContainer}>
                  <TouchableOpacity onPress={() => handleLike(item._id)}>
                    <MaterialIcons
                      name="thumb-up"
                      size={24}
                      color={item.liked ? 'green' : 'gray'}
                    />
                  </TouchableOpacity>
                  <Text style={styles.countText}>{item.likes || 0}</Text>

                  <TouchableOpacity onPress={() => navigation.navigate("AnnouncementDetail", { announcementId: item._id })}>
                    <MaterialIcons
                      name="comment"
                      size={24}
                      color="gray"
                      style={styles.commentIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.countText}>{item.comments ? item.comments.length : 0}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item._id}
          />
        </>
      )}
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  categoryIcon: {
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedCategory: {
    backgroundColor: '#FFB400',
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  countText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'black',
  },
  commentIcon: {
    marginLeft: 20,
  },
  commentInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default AnnouncementPage;
