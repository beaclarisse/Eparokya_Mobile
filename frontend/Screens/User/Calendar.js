import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as Calendar from 'expo-calendar';
import { Calendar as RNCalendar } from 'react-native-calendars';
import axios from 'axios';
import SyncStorage from 'sync-storage';
import baseURL from '../../assets/common/baseUrl';

const CalendarComponent = () => {
    const [confirmedWeddings, setConfirmedWeddings] = useState([]);
    const [filteredWeddings, setFilteredWeddings] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const calendarId = await createCalendar();
                await fetchConfirmedWeddingDates(calendarId);
            } else {
                Alert.alert('Permission denied', 'Calendar access is required to create events.');
            }
        })();
    }, []);

    const createCalendar = async () => {
        const calendars = await Calendar.getCalendarsAsync();
        const existingCalendar = calendars.find(cal => cal.title === 'Wedding Calendar');
        if (existingCalendar) {
            return existingCalendar.id;
        }
        const newCalendarId = await Calendar.createCalendarAsync({
            title: 'Wedding Calendar',
            color: '#FF0000',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: calendars[0].source.id,
            source: calendars[0].source,
            name: 'Wedding Calendar',
            ownerAccount: calendars[0].source.name,
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        return newCalendarId;
    };

    const fetchConfirmedWeddingDates = async (calendarId) => {
        try {
            const token = await SyncStorage.get('jwt');
            const response = await axios.get(`${baseURL}/wedding/confirmed`, {
                headers: { Authorization: `${token}` },
            });
            setConfirmedWeddings(response.data);

            const dates = {};
            response.data.forEach(async (wedding) => {
                const date = new Date(wedding.weddingDate).toISOString().split('T')[0];
                dates[date] = {
                    marked: true,
                    dotColor: 'red',
                };
                await Calendar.createEventAsync(calendarId, {
                    title: `${wedding.name1} & ${wedding.name2} Wedding`,
                    startDate: new Date(wedding.weddingDate),
                    endDate: new Date(new Date(wedding.weddingDate).getTime() + 2 * 60 * 60 * 1000),
                    timeZone: 'GMT',
                    location: `${wedding.address1.state}, ${wedding.address1.country}`,
                    notes: `Attendees: ${wedding.attendees}, Flower Girl: ${wedding.flowerGirl}, Ring Bearer: ${wedding.ringBearer}`,
                });
            });

            setMarkedDates(dates);
        } catch (error) {
            console.error('Error fetching confirmed weddings:', error);
            Alert.alert('Error', 'Failed to fetch confirmed weddings.');
        }
    };

    const handleDayPress = (day) => {
        const selectedDay = day.dateString;
        setSelectedDate(selectedDay);
        const weddingsOnDate = confirmedWeddings.filter(wedding =>
            new Date(wedding.weddingDate).toISOString().split('T')[0] === selectedDay
        );
        setFilteredWeddings(weddingsOnDate);  // Update only the filtered weddings for the selected date
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Wedding Calendar</Text>
            <RNCalendar
                markedDates={markedDates}
                markingType={'dot'}
                onDayPress={handleDayPress}
                theme={{
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#ff6347',
                    todayTextColor: '#ff6347',
                    dayTextColor: '#2d4150',
                    dotColor: '#ff6347',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'orange',
                    monthTextColor: 'black',
                    indicatorColor: 'blue',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '500',
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                }}
            />
            {selectedDate && (
                <>
                    <Text style={styles.dateText}>Weddings on {selectedDate}:</Text>
                    <FlatList
                        data={filteredWeddings}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>{item.name1} & {item.name2}</Text>
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
                </>
            )}
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b3cf99', // Updated background color
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 15,
        color: '#333',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    addButton: {
        backgroundColor: '#FF6347',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
    },
});


export default CalendarComponent;
