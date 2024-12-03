import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import SyncStorage from 'sync-storage';
import baseURL from '../../../assets/common/baseUrl';

const AnnouncementDetail = ({ route, navigation }) => {
  const { announcementId } = route.params;

  const [announcement, setAnnouncement] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [currentCommentId, setCurrentCommentId] = useState(null);

  useEffect(() => {
    const fetchAnnouncementData = async () => {
      setLoading(true);
      try {
        const announcementResponse = await axios.get(`${baseURL}/announcement/${announcementId}`);
        setAnnouncement(announcementResponse.data);
  
        const commentsResponse = await axios.get(`${baseURL}/announcement/comments/${announcementId}`);
        console.log('Fetched Comments:', commentsResponse.data.data); // Log data to check replies
        setComments(commentsResponse.data.data);
      } catch (error) {
        console.error('Error fetching announcement and comments:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Unable to fetch announcement details. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchAnnouncementData();
  }, [announcementId]);

  const handleAction = async (url, method, body = null, successMessage, errorMessage) => {
    const token = SyncStorage.get('jwt');
    if (!token) {
      Toast.show({ type: 'error', text1: 'Login Required', text2: 'Please log in to perform this action.' });
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios[method](url, body, config);
      return response.data;
    } catch (error) {
      console.error(errorMessage, error);
      Toast.show({ type: 'error', text1: 'Error', text2: errorMessage });
      throw error;
    }
  };

  const handleLike = async () => {
    try {
      const data = await handleAction(
        `${baseURL}/announcement/like/${announcementId}`,
        'put',
        null,
        'Like status updated!',
        'Unable to update like status.'
      );
      setAnnouncement((prev) => ({ ...prev, likedBy: data.likedBy }));
    } catch { }
  };

  const handleComment = async () => {
    if (!commentText.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Comment cannot be empty.' });
      return;
    }

    try {
      const data = await handleAction(
        `${baseURL}/AnnouncementComment/comment/${announcementId}`,
        'post',
        { text: commentText },
        'Comment Added!',
        'Unable to add comment.'
      );
      setComments((prev) => [...prev, data]);
      setCommentText('');
    } catch { }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Reply cannot be empty.' });
      return;
    }

    try {
      const data = await handleAction(
        `${baseURL}/AnnouncementComment/comment/reply/${currentCommentId}`,
        'post',
        { text: replyText },
        'Reply Added!',
        'Unable to add reply.'
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === currentCommentId
            ? { ...comment, replies: [...(comment.replies || []), data.data] }
            : comment
        )
      );

      setReplyText('');
      setCurrentCommentId(null);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const fetchCommentsWithReplies = async () => {
    try {
      const response = await axios.get(`${baseURL}/announcement/comments/${announcementId}`);
      console.log('Fetched Comments with Replies:', response.data.data); 
      setComments(response.data.data);
    } catch (error) {
      console.error('Error fetching comments with replies:', error);
    }
  };


  const handleLikeToggle = async (commentId, isLiked) => {
    try {
      const url = `${baseURL}/AnnouncementComment/comment/${isLiked ? 'unlike' : 'like'}/${commentId}`;
      const response = await axios.post(url);
      const updatedComment = response.data.data;

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Announcement Details */}
      <Text style={styles.title}>{announcement?.name || 'No Title Available'}</Text>
      <Text>{announcement?.description || 'No Description Available'}</Text>
      <Text>{announcement?.richDescription || 'No Details Available'}</Text>
      <Text>Tags: {announcement?.tags?.join(', ') || 'No Tags'}</Text>

      {announcement?.image ? (
        <Image source={{ uri: announcement.image }} style={styles.image} />
      ) : (
        <Text>No Image Available</Text>
      )}

      {/* Like Interaction */}
      <View style={styles.interactionContainer}>
        <TouchableOpacity onPress={handleLike}>
          <MaterialIcons
            name="thumb-up"
            size={24}
            color={announcement?.likedBy?.includes(SyncStorage.get('userId')) ? 'green' : 'gray'}
          />
        </TouchableOpacity>
        <Text>{announcement?.likedBy?.length || 0}</Text>
      </View>

      {/* Comments and Replies */}
      {comments?.map((comment) => (
        <View key={comment._id} style={styles.comment}>
          {/* Comment Header */}
          <View style={styles.commentHeader}>
            <Text style={styles.commentUser}>{comment.user?.name || 'Anonymous'}:</Text>
            <Text>{new Date(comment.dateCreated).toLocaleString()}</Text>
          </View>

          {/* Comment Text */}
          <Text style={styles.commentText}>{comment.text}</Text>

          {/* Comment Interaction */}
          <View style={styles.interactionContainer}>
            <TouchableOpacity onPress={() => handleLikeToggle(comment._id)}>
              <MaterialIcons
                name="thumb-up"
                size={20}
                color={comment.likedBy?.includes(SyncStorage.get('userId')) ? 'green' : 'gray'}
              />
            </TouchableOpacity>
            <Text>{comment.likedBy?.length || 0}</Text>
          </View>

          {/* Replies */}
          {comment.replies?.length > 0 && (
            <View style={styles.repliesContainer}>
              {comment.replies.map((reply) => {
                console.log('Reply:', reply); // Debugging
                return (
                  <View key={reply._id} style={styles.reply}>
                    <View style={styles.replyHeader}>
                      <Text style={styles.replyUser}>{reply.user?.name || 'Anonymous'}:</Text>
                      <Text>{new Date(reply.dateCreated).toLocaleString()}</Text>
                    </View>
                    <Text style={styles.replyText}>{reply.text}</Text>
                  </View>
                );
              })}
            </View>
          )}


          {/* Reply Input */}
          {currentCommentId === comment._id && (
            <View style={styles.replyInputContainer}>
              <TextInput
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Add a reply"
                style={styles.input}
              />
              <TouchableOpacity onPress={handleReply}>
                <Text style={styles.postButton}>Post Reply</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Reply Button */}
          <TouchableOpacity onPress={() => setCurrentCommentId(comment._id)}>
            <Text style={styles.replyButton}>Reply</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add a New Comment */}
      <TextInput
        value={commentText}
        onChangeText={setCommentText}
        placeholder="Add a comment"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleComment}>
        <Text style={styles.postButton}>Post Comment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  interactionContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { borderWidth: 1, padding: 8, marginVertical: 8, borderRadius: 4 },
  comment: { borderBottomWidth: 1, paddingVertical: 8, marginBottom: 8 },
  reply: { paddingLeft: 16, fontSize: 14, color: 'gray', marginVertical: 4 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  commentUser: { fontWeight: 'bold' },
  commentText: { marginVertical: 4 },
  replyUser: { fontWeight: 'bold', fontSize: 14 },
  replyButton: { color: 'blue', marginTop: 4 },
  commentInputContainer: { marginTop: 16 },
  postButton: { color: 'blue', marginTop: 8 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backButtonText: { marginLeft: 8, fontSize: 16 },
  image: { width: '100%', height: 200, marginVertical: 16 },
});

export default AnnouncementDetail;


