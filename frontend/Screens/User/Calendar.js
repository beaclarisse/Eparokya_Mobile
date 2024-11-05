import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import { Calendar as RNCalendar } from 'react-native-calendars';
import axios from 'axios';
import SyncStorage from 'sync-storage';
import baseURL from '../../assets/common/baseUrl';

const CalendarComponent = () => {
    const [confirmedWeddings, setConfirmedWeddings] = useState([]);
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
        setConfirmedWeddings(weddingsOnDate);
    };

    return (
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>Wedding Calendar</Text>
            <RNCalendar
                markedDates={markedDates}
                markingType={'dot'}
                onDayPress={handleDayPress}
            />
            {selectedDate && (
                <>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>
                         Weddings on {selectedDate}:
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
                </>
            )}
        </View>
    );
};

export default CalendarComponent;
