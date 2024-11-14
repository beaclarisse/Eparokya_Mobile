import React, { useState, useEffect } from 'react';
import { View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  ScrollView } from 'react-native';
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
  const [commentText, setCommentText] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

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
        console.log('Fetched Announcements:', response.data);
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
  
  const handleComment = async (announcementId) => {
    const token = await SyncStorage.get("jwt");
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      await axios.post(
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
          ? updatedAnnouncement 
          : item
      )
    );
      setCommentText(''); 
      setSelectedAnnouncement(null); 
  
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 50,
        rightOffset: 20,
        text1: 'Comment Posted',
        text2: 'Your comment has been successfully posted!',
        visibilityTime: 3000,
        autoHide: true,
      });
    } catch (error) {
      console.error("Error commenting on announcement:", error);
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 50,
        rightOffset: 20,
        text1: 'Error Posting Comment',
        text2: 'There was an issue posting your comment. Please try again.',
        visibilityTime: 3000,
        autoHide: true,
      });
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
                style={[
                  styles.categoryIcon,
                  selectedCategory === category._id && styles.selectedCategory,
                ]}
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
                  console.log("Navigating with announcementId:", item._id);
                  navigation.navigate('AnnouncementDetail', { announcementId: item._id });
                }}
              >
                <Text style={styles.title}>{item.name || 'No title available'}</Text>
                <Text>{item.description || 'No description available'}</Text>
                {item.image && <Image source={{ uri: item.image }} style={styles.media} />}
                {item.video && <Text style={styles.media}>Video: {item.video}</Text>}
  
                {item.tags && item.tags.length > 0 ? (
                  <View style={styles.tagContainer}>
                    {item.tags.map((tag, index) => (
                      <Text key={index} style={styles.tag}>
                        {tag || 'No tag available'}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text>No tags available</Text>
                )}
  
                <View style={styles.interactionContainer}>
                  <TouchableOpacity onPress={() => handleLike(item._id)}>
                    <MaterialIcons
                      name="thumb-up"
                      size={24}
                      color={item.liked ? 'green' : 'gray'}
                    />
                  </TouchableOpacity>
                  <Text style={styles.countText}>{item.likes || 0}</Text>
  
                  <TouchableOpacity onPress={() => setSelectedAnnouncement(item._id)}>
                    <MaterialIcons
                      name="comment"
                      size={24}
                      color="gray"
                      style={styles.commentIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.countText}>{item.comments ? item.comments.length : 0}</Text>
                </View>
  
                {/* Comment section */}
                {selectedAnnouncement === item._id && (
                  <View style={styles.commentSection}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Add a comment"
                      value={commentText}
                      onChangeText={setCommentText}
                    />
                    <TouchableOpacity onPress={() => handleComment(item._id)}>
                      <MaterialIcons name="send" size={24} color="blue" />
                    </TouchableOpacity>
                  </View>
                )}
  
                {/* Render Comments */}
                {item.comments && Array.isArray(item.comments) && item.comments.length > 0 ? (
                  item.comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                      <Text style={styles.commentUser}>
                        {comment.user && comment.user.name ? comment.user.name : 'Anonymous User'}
                      </Text>
                      <Text>{comment.text ? comment.text : 'No text available'}</Text>
                      <Text>{comment.dateCreated ? comment.dateCreated : 'No date available'}</Text>
                    </View>
                  ))
                ) : (
                  <Text>No comments yet</Text>
                )}
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
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  commentContainer: {
    marginTop: 10,
  },
  comment: {
    marginBottom: 5,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AnnouncementPage;
