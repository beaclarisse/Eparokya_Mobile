import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from 'sync-storage';
import { MaterialIcons } from '@expo/vector-icons';

const AnnouncementDetail = ({ route }) => {
  const { announcementId } = route.params;
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState(0);

  useEffect(() => { 
    if (!announcementId) {
      setError('No announcement ID provided');
      setLoading(false);
      return;
    }

    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`${baseURL}/announcement/${announcementId}`);
        setAnnouncement(response.data);
        setLikes(response.data.likes || 0);  // Set initial likes count
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch announcement');
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [announcementId]);

  const handleLike = async () => {
    const token = await SyncStorage.get("jwt");
    if (!token) {
      console.error('No token found');
      return;
    }

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
      setLikes(prevLikes => prevLikes + 1); // Increment likes count
    } catch (err) {
      console.error('Error liking announcement:', err);
    }
  };

  const handleComment = async () => {
    const token = await SyncStorage.get("jwt");
    if (!token) {
      console.error('No token found');
      return;
    }

    if (!commentText.trim()) {
      return; // Prevent empty comments
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
      // Add comment to local state
      setAnnouncement(prevAnnouncement => ({
        ...prevAnnouncement,
        comments: [
          ...prevAnnouncement.comments,
          { text: commentText, dateCreated: new Date() },
        ],
      }));
      setCommentText(''); // Clear comment input
    } catch (err) {
      console.error('Error commenting on announcement:', err);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {error ? (
        <Text>{error}</Text>
      ) : (
        <>
          <Text style={styles.title}>{announcement.name}</Text>
          <Text style={styles.description}>{announcement.description}</Text>
          <Text style={styles.richDescription}>{announcement.richDescription}</Text>

          {announcement.image && <Image source={{ uri: announcement.image }} style={styles.media} />}
          {announcement.images && announcement.images.length > 0 && (
            <View style={styles.imagesContainer}>
              {announcement.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.media} />
              ))}
            </View>
          )}
          {announcement.videos && announcement.videos.length > 0 && (
            <Text style={styles.media}>Videos: {announcement.videos.join(', ')}</Text>
          )}

          <View style={styles.interactionContainer}>
            <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
              <MaterialIcons
                name="thumb-up"
                size={24}
                color="gray"
              />
              <Text>{likes} Likes</Text>
            </TouchableOpacity>
          </View>

          {/* Comment Section */}
          <View style={styles.commentSection}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment"
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleComment}>
              <MaterialIcons name="send" size={24} color="blue" />
            </TouchableOpacity>
          </View>

          {/* Comments */}
          {announcement.comments && announcement.comments.length > 0 ? (
            announcement.comments.map((comment, index) => (
              <View key={index} style={styles.comment}>
                <Text>{comment.user ? comment.user.name : 'Anonymous'}: {comment.text}</Text>
                <Text>{new Date(comment.dateCreated).toLocaleString()}</Text>
              </View>
            ))
          ) : (
            <Text>No comments yet</Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    fontSize: 16,
  },
  richDescription: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  commentInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  comment: {
    marginBottom: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AnnouncementDetail;
