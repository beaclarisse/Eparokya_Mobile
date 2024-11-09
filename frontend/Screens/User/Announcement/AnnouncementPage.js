import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
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
            ? { ...item, comments: item.comments + 1 }
            : item
        )
      );
      setCommentText('');
      setSelectedAnnouncement(null);
    } catch (error) {
      console.error("Error commenting on announcement:", error);
    }
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text>{error}</Text>
      ) : (
        <>
          <ScrollView horizontal style={styles.categoryContainer}>
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
              <View style={styles.card}>
                <Text style={styles.title}>{item.name || 'No title available'}</Text>
                <Text>{item.description || 'No description available'}</Text>
                {item.image && <Image source={{ uri: item.image }} style={styles.media} />}
                {item.video && (
                  <Text style={styles.media}>Video: {item.video}</Text>
                )}

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

                <TouchableOpacity
                  onPress={() => {
                    console.log("Navigating with announcementId:", item._id);  
                    navigation.navigate('AnnouncementDetail', { announcementId: item._id });
                  }}
                >
                  <Text>View Details</Text>
                </TouchableOpacity>

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
                      <Text>{comment.text ? comment.text : 'No text available'}</Text>
                      <Text>{comment.dateCreated ? comment.dateCreated : 'No date available'}</Text>
                    </View>
                  ))
                ) : (
                  <Text>No comments yet</Text>
                )}
              </View>
            )}
            keyExtractor={item => item._id}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  categoryIcon: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#000',
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
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
