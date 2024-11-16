import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";
import SyncStorage from 'sync-storage';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message'; // Import Toast

const AnnouncementDetail = ({ route }) => {
  const { announcementId } = route.params;
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`${baseURL}/announcement/${announcementId}`);
        setAnnouncement(response.data);
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
      setAnnouncement(prevAnnouncement => ({ ...prevAnnouncement, likes: prevAnnouncement.likes + 1 }));
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
      setAnnouncement(prevAnnouncement => ({
        ...prevAnnouncement,
        comments: [...prevAnnouncement.comments, response.data]
      }));

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Comment Added!',
        text2: 'Your comment was successfully posted.',
        visibilityTime: 3000, 
        autoHide: true,
        topOffset: 50, 
      });
      setCommentText('');
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      {error ? (
        <Text>{error}</Text>
      ) : (
        <View>
          {/* Announcement Details */}
          <Text style={styles.title}>{announcement.name}</Text>
          <Text>{announcement.description}</Text>
          {announcement.image && <Image source={{ uri: announcement.image }} style={styles.image} />}
          {announcement.video && <Text>Video: {announcement.video}</Text>}

          {/* User Information (Author of the Announcement) */}
          {announcement.user && (
            <View style={styles.userContainer}>
              <Image source={{ uri: announcement.user.profilePicture }} style={styles.userImage} />
              <Text style={styles.userName}>{announcement.user.name}</Text>
            </View>
          )}

          {/* Interaction (Like/Comment Count) */}
          <View style={styles.interactionContainer}>
            <TouchableOpacity onPress={handleLike}>
              <MaterialIcons
                name="thumb-up"
                size={24}
                color={announcement.liked ? 'green' : 'gray'}
              />
            </TouchableOpacity>
            <Text style={styles.countText}>{announcement.likes}</Text>

            <MaterialIcons name="comment" size={24} color="gray" style={styles.commentIcon} />
            <Text style={styles.countText}>{announcement.comments.length}</Text>
          </View>

          {/* Comment Section */}
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            style={styles.commentInput}
          />
          <TouchableOpacity onPress={handleComment} style={styles.commentButton}>
            <Text style={styles.commentButtonText}>Submit</Text>
          </TouchableOpacity>

          {/* Displaying Comments */}
          {announcement.comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              {/* Comment User Info */}
              {comment.user && (
                <View style={styles.commentUserContainer}>
                  <Text style={styles.commentUserName}>{comment.user.name}:</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>

                  {/* Format date using dateCreated */}
                  <Text style={styles.commentDate}>
                    {new Date(comment.dateCreated).toLocaleString() || 'Invalid Date'}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
  userContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  userImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  interactionContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  countText: { marginLeft: 5, fontSize: 16, color: 'black' },
  commentIcon: { marginLeft: 20 },
  commentInput: { borderColor: '#ddd', borderWidth: 1, padding: 8, borderRadius: 5, marginTop: 10 },
  commentButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginTop: 10 },
  commentButtonText: { color: '#fff', textAlign: 'center' },
  comment: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  commentUserContainer: { marginBottom: 5 },
  commentUserName: { fontWeight: 'bold', fontSize: 16 },
  commentText: { fontSize: 14, marginTop: 5 },
  commentDate: { fontSize: 12, color: '#888', marginTop: 5 },
});

export default AnnouncementDetail;
