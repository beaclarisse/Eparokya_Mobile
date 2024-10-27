import React, { useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import axios from 'axios';
import SyncStorage from 'sync-storage';
import baseURL from '../../assets/common/baseUrl';

const CalendarComponent = () => {
    const [confirmedWeddings, setConfirmedWeddings] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    const fetchConfirmedWeddings = async (date) => {
        try {
            const token = await SyncStorage.get('jwt');
            const response = await axios.get(`${baseURL}/wedding/confirmed`, {
                headers: { Authorization: `${token}` },
            });

            const weddingsOnDate = response.data.filter(wedding => {
                try {
                    const weddingDate = new Date(wedding.weddingDate).toISOString().split('T')[0]; // format: YYYY-MM-DD
                    return weddingDate === date;
                } catch (error) {
                    console.warn('Invalid date encountered:', wedding.weddingDate);
                    return false;
                }
            });

            setConfirmedWeddings(weddingsOnDate);
        } catch (error) {
            console.error('Error fetching confirmed weddings:', error);
            Alert.alert('Error', 'Failed to fetch confirmed weddings.');
        }
    };

    const onDayPress = (day) => {
        const selectedDay = day.dateString;
        setSelectedDate(selectedDay);
        fetchConfirmedWeddings(selectedDay);
    };

    return (
        <View>
            <Calendar
                onDayPress={onDayPress}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true },
                }}
            />
            {selectedDate && (
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>
                        Confirmed Weddings on {selectedDate}:
                    </Text>
                    <FlatList
                        data={confirmedWeddings}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={{ padding: 10, marginVertical: 5, borderColor: 'gray', borderWidth: 1, borderRadius: 5 }}>
                                <Text style={{ fontWeight: 'bold' }}>{item.name1} & {item.name2}</Text>
                                <Text>Phone 1: {item.phoneNumber1}</Text>
                                <Text>Phone 2: {item.phoneNumber2}</Text>
                                <Text>Attendees: {item.attendees}</Text>
                                <Text>Flower Girl: {item.flowerGirl}</Text>
                                <Text>Ring Bearer: {item.ringBearer}</Text>
                                <Text>Address 1: {item.address1.state}, {item.address1.zip}, {item.address1.country}</Text>
                                <Text>Address 2: {item.address2.state}, {item.address2.zip}, {item.address2.country}</Text>
                                <Text>Wedding Status: {item.weddingStatus}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

export default CalendarComponent;
