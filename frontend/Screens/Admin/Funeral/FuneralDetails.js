import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Select, CheckIcon } from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import SyncStorage from 'sync-storage';
import baseURL from '../../../assets/common/baseUrl';
import { MaterialIcons } from '@expo/vector-icons';

const FuneralDetails = ({ route, navigation }) => {
    const { funeralId } = route.params;
    const [funeralDetails, setFuneralDetails] = useState(null);
    const [userScheduledDate, setUserScheduledDate] = useState('');
    const [priestName, setPriestName] = useState('');
    const [additionalComment, setAdditionalComment] = useState('');
    const [status, setStatus] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedComment, setSelectedComment] = useState('');
    const [error, setError] = useState('');
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedPriestName, setEditedPriestName] = useState('');
    const [editedAdditionalComment, setEditedAdditionalComment] = useState('');
    const [newDate, setNewDate] = useState(funeralDetails?.funeralDate || '');
    const [adminRescheduledDate, setAdminRescheduledDate] = useState({
        date: funeralDetails?.adminRescheduled?.date || '',
        reason: funeralDetails?.adminRescheduled?.reason || '',
    });

    const predefinedComments = [
        "Confirmed and on schedule",
        "Rescheduled - awaiting response",
        "Pending final confirmation",
        "Cancelled by user",
    ];

    useEffect(() => {
        const fetchDetails = async () => {
            if (!funeralId) {
                console.error('Funeral ID is missing.');
                setError('Funeral ID is not provided.');
                return;
            }
            try {
                const response = await axios.get(`${baseURL}/funeral/${funeralId}`);
                console.log('Funeral Details:', response.data);

                // Set funeral details and comments
                setFuneralDetails(response.data);
                setComments(response.data.comments || []);

                // Update funeralDate-related states if available
                if (response.data.funeralDate) {
                    const formattedDate = response.data.funeralDate; // Assuming it is already ISO format
                    setUserScheduledDate(formattedDate);
                    setNewDate(formattedDate);
                    setAdminRescheduledDate(formattedDate);
                }
            } catch (error) {
                console.error('Error fetching funeral details:', error.response?.data || error.message);
                setError('Error fetching funeral entry.');
            }
        };
        fetchDetails();
    }, [funeralId]);





    const fetchComments = async () => {
        try {
            const response = await axios.get(`${baseURL}/funeral/comment/${funeralId}`);
            setComments(response.data.comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            Alert.alert('Error', 'Failed to fetch comments.');
        }
    };


    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            setAdminRescheduled((prev) => ({
                ...prev,
                date: new Date(date).toISOString(),
            }));
        }
    };





    const handleUpdate = async () => {
        if (!adminRescheduledDate.date || !adminRescheduledDate.reason) {
            Alert.alert('Error', 'Please provide both a date and a reason.');
            return;
        }
        try {
            const token = await SyncStorage.get('jwt');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const updatedData = {
                adminRescheduledDate,
                funeralDate: adminRescheduledDate.date,
                priestName,
                additionalComment,
                funeralStatus: status,
            };

            await axios.put(`${baseURL}/funeral/update/${funeralId}`, updatedData, config);

            Alert.alert('Success', 'Funeral details updated successfully.');
            navigation.goBack();
        } catch (err) {
            console.error('Error updating funeral details:', err);
            Alert.alert('Error', 'Failed to update funeral details.');
        }
    };



    const handleConfirm = async () => {
        try {
            const token = await SyncStorage.get('jwt');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const updatedData = {
                funeralDate: userScheduledDate,
                adminRescheduledDate: adminRescheduledDate || userScheduledDate,
                additionalComment: additionalComment,
            };
            const response = await axios.put(`${baseURL}/funeral/confirm/${funeralId}`, updatedData, config);

            setStatus(response.data.funeralStatus || 'Confirmed');
            setUserScheduledDate(adminRescheduledDate || userScheduledDate);
            setAdminRescheduledDate('');

            Alert.alert('Success', 'Funeral confirmed successfully.');
        } catch (err) {
            console.error('Error confirming funeral:', err.response ? err.response.data : err.message);
            Alert.alert('Error', 'Failed to confirm funeral. Please try again.');
        }
    };



    const handleCancel = async () => {
        try {
            const token = await SyncStorage.get('jwt');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put(`${baseURL}/funeral/cancel/${funeralId}`, {}, config);
            setStatus('cancelled');
            Alert.alert('Success', 'Funeral cancelled successfully.');
        } catch (err) {
            console.error('Error cancelling funeral:', err.response ? err.response.data : err.message);
            Alert.alert('Error', 'Failed to cancel funeral. Please try again.');
        }
    };

    //   const handleSubmitComment = async () => {
    //     if (!selectedComment || !priestName) {
    //         Alert.alert('Error', 'Priest name and selected comment are required.');
    //         return;
    //     }
    //     try {
    //         const token = await SyncStorage.get('jwt');
    //         const config = { headers: { Authorization: `Bearer ${token}` } };
    //         const commentData = {
    //             text: additionalComment || selectedComment,
    //             status: status,
    //         };
    //         console.log('Funeral ID:', funeralId);
    //         const response = await axios.post(`${baseURL}/funeral/comment/${funeralId}`, commentData, config);
    //         setComments([...comments, response.data.comment]);
    //         setAdditionalComment(''); 
    //     } catch (err) {
    //         console.error(err);
    //         Alert.alert('Error', 'Failed to submit comment.');
    //     }
    // };

    const handleSubmitComment = async () => {
        if (!selectedComment || !priestName) {
            Alert.alert('Error', 'Priest name and selected comment are required.');
            return;
        }
        try {
            const token = await SyncStorage.get('jwt');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const commentData = {
                priestName,
                selectedComment,
                additionalComment,
                scheduledDate: adminRescheduledDate || userScheduledDate, // Use admin's date or user date
            };

            const response = await axios.post(`${baseURL}/funeral/comment/${funeralId}`, commentData, config);

            setComments([...comments, response.data.comment]);
            setPriestName('');
            setSelectedComment('');
            setAdditionalComment('');
            setAdminRescheduledDate(''); // Clear after submission

        } catch (err) {
            console.error('Error submitting comment:', err);
            Alert.alert('Error', 'Failed to submit comment.');
        }
    };


    const handleDeleteComment = async (commentId) => {
        try {
            const token = await SyncStorage.get('jwt');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.delete(`${baseURL}/funeral/comment/${funeralId}/${commentId}`, config);

            setComments(response.data.comments);
            Alert.alert('Success', 'Comment deleted successfully.');
        } catch (err) {
            console.error('Error deleting comment:', err);
            Alert.alert('Error', 'Failed to delete comment.');
        }
    };

    const saveUpdatedComment = async (commentId) => {
        try {
            const response = await fetch(`/api/v1/funeral/comment/${funeralId}/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priest: editedPriestName,
                    additionalComment: editedAdditionalComment,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // Update the local comments state
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment._id === commentId
                            ? { ...comment, priest: editedPriestName, additionalComment: editedAdditionalComment }
                            : comment
                    )
                );
                setEditingCommentId(null); // Exit edit mode
            } else {
                console.error('Error updating comment:', data.message);
            }
        } catch (error) {
            console.error('Error saving updated comment:', error);
        }
    };


    const handleEditComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditedPriestName(comment.priest);
        setEditedAdditionalComment(comment.additionalComment || '');
    };



    if (!funeralDetails) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Funeral Submission Details</Text>
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Text>Name: {funeralDetails.name?.firstName} {funeralDetails.name?.lastName}</Text>

                <Text>Gender: {funeralDetails.gender || 'N/A'}</Text>
                <Text>Age: {funeralDetails.age || 'N/A'}</Text>

                <Text>Number of Sons: {funeralDetails.numberOfsons || 'N/A'}</Text>
                <Text>Sons: {funeralDetails.sons || 'N/A'}</Text>
                <Text>Number of Daughters: {funeralDetails.numberOfdaughters || 'N/A'}</Text>
                <Text>Daughters: {funeralDetails.daughters || 'N/A'}</Text>

                <Text>Contact Person: {funeralDetails.contactPerson}</Text>
                <Text>Phone: {funeralDetails.phone || 'N/A'}</Text>

                <Text>Address: {funeralDetails.address?.state}, {funeralDetails.address?.country}, {funeralDetails.address?.zip}</Text>

                <Text>User Scheduled Date: {userScheduledDate ? new Date(userScheduledDate).toLocaleDateString() : 'N/A'}</Text>
                <Text>Admin Rescheduled Date: {adminRescheduledDate.date ? new Date(adminRescheduledDate.date).toLocaleDateString() : 'N/A'}</Text>
<Text>Reason: {adminRescheduledDate.reason || 'N/A'}</Text>
                {/* FOR USER DATE */}

                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                    <Text style={styles.dateText}>
                        {newDate ? new Date(newDate).toLocaleDateString() : "Set Scheduled Date"}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={newDate ? new Date(newDate) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            if (date) {
                                setNewDate(date.toISOString());
                                setAdminRescheduledDate(date.toISOString());
                            }
                            setShowDatePicker(false);
                        }}
                    />
                )}



                <Text>Time: {funeralDetails.time}</Text>

                <Text>Service Type: {funeralDetails.serviceType}</Text>

                <Text>Entrance Song: {funeralDetails.entranceSong || 'N/A'}</Text>

                <Text>Placing of Pall: {funeralDetails.placingOfPall?.by || 'N/A'}</Text>
                {funeralDetails.placingOfPall?.familyMembers && (
                    <Text>Family Members: {funeralDetails.placingOfPall.familyMembers.join(', ')}</Text>
                )}

                <Text>Funeral Status: {funeralDetails.funeralStatus}</Text>


                {/* FOR ADMIN DATE */}
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                    <Text style={styles.dateText}>
                        {newDate ? new Date(newDate).toLocaleDateString() : "Set Scheduled Date"}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={newDate ? new Date(newDate) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            if (date) {
                                setNewDate(date.toISOString());
                                setAdminRescheduledDate(date.toISOString());
                            }
                            setShowDatePicker(false);
                        }}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Reason for Reschedule"
                    value={adminRescheduledDate.reason}
                    onChangeText={(text) =>
                        setAdminRescheduledDate((prev) => ({ ...prev, reason: text }))
                    }
                />



                <Select
                    selectedValue={selectedComment}
                    minWidth="200"
                    accessibilityLabel="Select a comment"
                    placeholder="Select a comment"
                    _selectedItem={{
                        bg: "cyan.600",
                        endIcon: <CheckIcon size="5" />,
                    }}
                    onValueChange={(value) => setSelectedComment(value)}
                >
                    {predefinedComments.map((comment, index) => (
                        <Select.Item label={comment} value={comment} key={index} />
                    ))}
                </Select>

                <TextInput
                    style={styles.input}
                    placeholder="Priest Name"
                    value={priestName}
                    onChangeText={(text) => setPriestName(text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Additional Comment (optional)"
                    value={additionalComment}
                    onChangeText={(text) => setAdditionalComment(text)}
                />

                <Button title="Submit Comment" onPress={handleSubmitComment} color="#1C5739" />

                <View style={styles.commentsContainer}>
                    <Text style={styles.commentTitle}>Admin Replies:</Text>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <View key={comment._id || index} style={styles.comment}>
                                <TouchableOpacity onPress={() => handleDeleteComment(comment._id)} style={styles.deleteIcon}>
                                    <MaterialIcons name="delete" size={24} color="red" />
                                </TouchableOpacity>

                                {editingCommentId === comment._id ? (
                                    <TouchableOpacity onPress={() => setEditingCommentId(null)} style={styles.editIcon}>
                                        <MaterialIcons name="close" size={24} color="gray" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => handleEditComment(comment)} style={styles.editIcon}>
                                        <MaterialIcons name="edit" size={24} color="blue" />
                                    </TouchableOpacity>
                                )}

                                {editingCommentId === comment._id ? (
                                    <>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Priest Name"
                                            value={editedPriestName}
                                            onChangeText={(text) => setEditedPriestName(text)}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Additional Comment"
                                            value={editedAdditionalComment}
                                            onChangeText={(text) => setEditedAdditionalComment(text)}
                                        />
                                        <TouchableOpacity onPress={() => saveUpdatedComment(comment._id)} style={styles.saveButton}>
                                            <Text style={styles.saveButtonText}>Save</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <Text><Text style={styles.bold}>Priest:</Text> {comment.priest || 'N/A'}</Text>
                                        <Text><Text style={styles.bold}>Comment:</Text> {comment.selectedComment || comment.text || 'No comment provided'}</Text>
                                        <Text><Text style={styles.bold}>Scheduled Date:</Text> {comment.scheduledDate ? new Date(comment.scheduledDate).toLocaleString() : 'N/A'}</Text>
                                        <Text><Text style={styles.bold}>Date Added:</Text> {new Date(comment.createdAt).toLocaleString()}</Text>
                                        <Text>Admin Rescheduled Date: {adminRescheduledDate.date ? new Date(adminRescheduledDate.date).toLocaleDateString() : 'N/A'}</Text>
                                        <Text>Reason: {adminRescheduledDate.reason || 'N/A'}</Text>
                                        {comment.additionalComment && <Text>Additional Comment: {comment.additionalComment}</Text>}
                                    </>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text>No comments available.</Text>
                    )}

                </View>

                <View style={styles.buttonContainer}>
                    <Button title="Update Details" onPress={handleUpdate} color="#1C5739" />
                    <Button title="Confirm" onPress={handleConfirm} color="#1C5739" />
                    <Button title="Cancel" onPress={handleCancel} color="#FF6347" />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dateButton: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#1C5739',
        borderRadius: 5,
    },
    dateText: {
        color: 'white',
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
    commentsContainer: {
        marginTop: 20,
    },
    commentTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    comment: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 2,
        position: 'relative',
    },
    bold: {
        fontWeight: 'bold',
    },
    deleteIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 2,
    },
    editIcon: {
        position: 'absolute',
        top: 10,
        right: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginBottom: 5,
    },
    saveButton: {
        backgroundColor: '#1C5739',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    editIcon: {
        position: 'absolute',
        top: 10,
        right: 40,
        zIndex: 2,
        padding: 5,
    },


});

export default FuneralDetails;
