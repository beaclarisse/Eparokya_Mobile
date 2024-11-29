import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import SyncStorage from 'sync-storage';
import baseURL from '../../../assets/common/baseUrl';

const FuneralList = ({ navigation }) => {
  const [funeralList, setFuneralList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFunerals = async () => {
      try {
        const token = await SyncStorage.get('jwt');
        if (!token) {
          Alert.alert('Error', 'Token is missing. Please log in again.');
          navigation.navigate('LoginPage');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${baseURL}/funeral/`, config);
        setFuneralList(response.data);
      } catch (err) {
        console.error('Error fetching funerals:', err.response ? err.response.data : err.message);
        setError('Unable to fetch funerals. Please try again later.');
      }
    };

    fetchFunerals();
  }, []);


  const renderItem = ({ item }) => (
    <TouchableOpacity
    style={styles.itemContainer}
    onPress={() => navigation.navigate('FuneralDetails', { funeralId: item._id })} 
  >
    <Text style={styles.name}>
      {item.name.firstName} {item.name.middleName} {item.name.lastName} {item.name.suffix || ''}
    </Text>
    <Text>Gender: {item.gender}</Text>
    <Text>Age: {item.age}</Text>
    <Text>Funeral Date: {new Date(item.funeralDate).toLocaleDateString()}</Text>
    <Text>Service Type: {item.serviceType}</Text>
    <Text>Status: {item.funeralStatus}</Text>
  </TouchableOpacity>
  
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Funeral List</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {funeralList.length > 0 ? (
        <FlatList
          data={funeralList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text>No funeral records found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  confirmText: {
    color: '#fff',
    textAlign: 'center',
  },cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 5,
  },
  cancelText: {
    color: '#fff',
    textAlign: 'center',
  },  
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});

export default FuneralList;
