import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import SyncStorage from 'sync-storage';
import baseURL from '../../../assets/common/baseUrl';

const FuneralList = ({ navigation }) => {
  const [funeralList, setFuneralList] = useState([]);
  const [filteredFuneralList, setFilteredFuneralList] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

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
        setFilteredFuneralList(response.data); // Default to showing all funerals
      } catch (err) {
        console.error('Error fetching funerals:', err.response ? err.response.data : err.message);
        setError('Unable to fetch funerals. Please try again later.');
      }
    };

    fetchFunerals();
  }, []);

  const applyFilter = (status) => {
    setFilter(status);
    if (status === 'All') {
      setFilteredFuneralList(funeralList);
    } else {
      const filtered = funeralList.filter((funeral) => funeral.funeralStatus === status);
      setFilteredFuneralList(filtered);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return styles.confirmedStatus;
      case 'Pending':
        return styles.pendingStatus;
      case 'Declined':
        return styles.declinedStatus;
      default:
        return styles.defaultStatus;
    }
  };

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
      <Text style={[styles.status, getStatusStyle(item.funeralStatus)]}>
        Status: {item.funeralStatus}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Funeral List</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.filterContainer}>
        {['All', 'Confirmed', 'Pending', 'Declined'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filter === status && styles.activeFilterButton]}
            onPress={() => applyFilter(status)}
          >
            <Text style={styles.filterText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredFuneralList.length > 0 ? (
        <FlatList
          data={filteredFuneralList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text>No funeral records found for the selected filter.</Text>
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  activeFilterButton: {
    backgroundColor: '#1C5739',
  },
  filterText: {
    color: '#fff',
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
  status: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmedStatus: {
    color: 'green',
  },
  pendingStatus: {
    color: 'orange',
  },
  declinedStatus: {
    color: 'red',
  },
  defaultStatus: {
    color: 'black',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});

export default FuneralList;
