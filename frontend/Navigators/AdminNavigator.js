import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import UserList from "../Screens/Admin/User/UserList";
import UpdateUser from "../Screens/Admin/User/UpdateUser";
import WeddingForm from "../Screens/Admin/Wedding/AdminWedding";
import WeddingDetails from "../Screens/Admin/Wedding/WeddingDetails";
import ConfirmedWedding from "../Screens/Admin/Wedding/ConfirmedWedding";
import AdminAvailableDates from "../Screens/Admin/Wedding/AdminAvailableDates";
import ministryCategory from "../Screens/Admin/Ministries/CreateMinistry";
import ministryList from "../Screens/Admin/Ministries/MinistryList";
import announcementCategory from "../Screens/Admin/Announcement/AnnouncementCategory";
import announcementCategoryList from "../Screens/Admin/Announcement/AnnouncementCategoryList";
import announcement from "../Screens/Admin/Announcement/Announcement";

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WeddingForm"
        component={WeddingForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WeddingDetails"
        component={WeddingDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ConfirmedWedding"
        component={ConfirmedWedding}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminAvailableDates"
        component={AdminAvailableDates}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="UserList"
        component={UserList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateUser"
        component={UpdateUser}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ministryCategory"
        component={ministryCategory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ministryList"
        component={ministryList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="announcementCategory"
        component={announcementCategory}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="announcementCategoryList"
        component={announcementCategoryList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="announcement"
        component={announcement}
        options={{ headerShown: true }}
      />

    </Stack.Navigator>
  );
};

export default AdminNavigator;
