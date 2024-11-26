import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Calendar from "expo-calendar";
import { Calendar as RNCalendar } from "react-native-calendars";
import axios from "axios";
import SyncStorage from "sync-storage";
import baseURL from "../../assets/common/baseUrl";

const CalendarComponent = () => {
  const [confirmedWeddings, setConfirmedWeddings] = useState([]);
  const [filteredWeddings, setFilteredWeddings] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendarId = await createCalendar();
        fetchConfirmedWeddingDates(calendarId);
      } else {
        Alert.alert(
          "Permission Denied",
          "Calendar access is required to create events."
        );
      }
    })();
  }, []);

  const createCalendar = async () => {
    const calendars = await Calendar.getCalendarsAsync();
    const existingCalendar = calendars.find(
      (cal) => cal.title === "Wedding Calendar"
    );
    if (existingCalendar) return existingCalendar.id;

    const defaultCalendar = calendars[0];
    const newCalendarId = await Calendar.createCalendarAsync({
      title: "Wedding Calendar",
      color: "#FF0000",
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendar.source.id,
      source: defaultCalendar.source,
      name: "Wedding Calendar",
      ownerAccount: defaultCalendar.source.name,
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    return newCalendarId;
  };

  const fetchConfirmedWeddingDates = async (calendarId) => {
    try {
      const token = await SyncStorage.get("jwt");
      const response = await axios.get(`${baseURL}/wedding/confirmed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const weddings = response.data;
      setConfirmedWeddings(weddings);

      const dates = {};
      for (const wedding of weddings) {
        const date = wedding.weddingDate
          ? new Date(wedding.weddingDate).toISOString().split("T")[0]
          : null;
        if (date) {
          dates[date] = { marked: true, dotColor: "red" };

          const brideAddress = wedding.BrideAddress || {};
          const groomAddress = wedding.GroomAddress || {};
          const location = `${brideAddress.state || "N/A"}, ${
            brideAddress.country || "N/A"
          }`;

          await Calendar.createEventAsync(calendarId, {
            title: `${wedding.bride} & ${wedding.groom} Wedding`,
            startDate: new Date(wedding.weddingDate),
            endDate: new Date(
              new Date(wedding.weddingDate).getTime() + 2 * 60 * 60 * 1000
            ),
            timeZone: "GMT",
            location,
            notes: `Attendees: ${wedding.attendees || "N/A"}, Flower Girl: ${
              wedding.flowerGirl || "N/A"
            }, Ring Bearer: ${wedding.ringBearer || "N/A"}`,
          });
        }
      }

      setMarkedDates(dates);
    } catch (error) {
      console.error("Error fetching confirmed weddings:", error);
      Alert.alert("Error", "Failed to fetch confirmed weddings.");
    }
  };

  const handleDayPress = (day) => {
    const selectedDay = day.dateString;
    setSelectedDate(selectedDay);

    // Filter weddings for the selected date
    const weddingsOnDate = confirmedWeddings.filter(wedding =>
        new Date(wedding.weddingDate).toISOString().split('T')[0] === selectedDay
    );

    // Ensure the wedding objects are properly structured
    const sanitizedWeddings = weddingsOnDate.map(wedding => ({
        ...wedding,
        BrideAddress: wedding.BrideAddress || {}, 
        GroomAddress: wedding.GroomAddress || {}, 
    }));

    setFilteredWeddings(sanitizedWeddings);
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wedding Calendar</Text>
      <RNCalendar
        markedDates={markedDates}
        markingType="dot"
        onDayPress={handleDayPress}
        theme={calendarTheme}
      />
      {selectedDate && (
        <>
          <Text style={styles.dateText}>Weddings on {selectedDate}:</Text>
          <FlatList
            data={filteredWeddings}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  {item.bride} & {item.groom}
                </Text>
                <Text>Phone (Bride): {item.bridePhone}</Text>
                <Text>Phone (Groom): {item.groomPhone}</Text>
                <Text>Attendees: {item.attendees}</Text>
                <Text>Flower Girl: {item.flowerGirl}</Text>
                <Text>Ring Bearer: {item.ringBearer}</Text>
                <Text>
                  Address: {item.BrideAddress.state},{" "}
                  {item.BrideAddress.country}
                </Text>
                <Text>Status: {item.weddingStatus}</Text>
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

const calendarTheme = {
  calendarBackground: "#ffffff",
  textSectionTitleColor: "#b6c1cd",
  selectedDayBackgroundColor: "#ff6347",
  todayTextColor: "#ff6347",
  dayTextColor: "#2d4150",
  dotColor: "#ff6347",
  selectedDotColor: "#ffffff",
  arrowColor: "orange",
  monthTextColor: "black",
  indicatorColor: "blue",
  textDayFontWeight: "300",
  textMonthFontWeight: "bold",
  textDayHeaderFontWeight: "500",
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b3cf99",
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
  },
  dateText: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#ff6347",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
  },
});

export default CalendarComponent;
