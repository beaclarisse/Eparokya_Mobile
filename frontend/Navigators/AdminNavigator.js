import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import UserList from "../Screens/Admin/User/UserList";
import UpdateUser from "../Screens/Admin/User/UpdateUser";
import WeddingForm from "../Screens/Admin/Wedding/AdminWedding";
import WeddingDetails from "../Screens/Admin/Wedding/WeddingDetails";
import ConfirmedWedding from "../Screens/Admin/Wedding/ConfirmedWedding";

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
                name="UserList" 
                component={UserList} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="UpdateUser" 
                component={UpdateUser} 
                options={{ headerShown: false }} 
            />
        </Stack.Navigator>
    );
};

export default AdminNavigator;
