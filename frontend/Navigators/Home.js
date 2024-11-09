import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
//import EventContainer from "../Screens/Events/EventContainer";
// import SingleProduct from '../Screens/Product/SingleProduct';
import AnnouncementPage from "../Screens/User/Announcement/AnnouncementPage";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='AnnouncementPage'
        component={AnnouncementPage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

//tanggal white-space 
export default function Home() {
  return (
    <View style={styles.container}> 
      <MyStack />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 0,
    padding: 0,
  },
});