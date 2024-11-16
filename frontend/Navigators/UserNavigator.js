import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import Register2 from "../Screens/User/Register2";
import UserProfile from "../Screens/User/Profile";
import UpdateProfile from "../Screens/User/Update";
import WeddingForm from "../Screens/User/Wedding/WeddingForm";
import WeddingForm2 from "../Screens/User/Wedding/WeddingForm2";
import WeddingForm3 from "../Screens/User/Wedding/WeddingForm3";
import WeddingFormContainer from "../Screens/User/Wedding/WeddingFormContainer";

import Calendar from "../Screens/User/Calendar";
import Announcement from "../Screens/User/Announcement/AnnouncementPage";
import AnnouncementDetail from "../Screens/User/Announcement/AnnouncementDetail";

const Stack = createStackNavigator();

const UserNavigator = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register2"
        component={Register2}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WeddingFormContainer"
        component={WeddingFormContainer}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WeddingForm"
        component={WeddingForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WeddingForm2"
        component={WeddingForm2}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WeddingForm3"
        component={WeddingForm3}
        options={{
          headerShown: false,
        }}
      />


      <Stack.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Announcement"
        component={Announcement}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetail}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default UserNavigator;
