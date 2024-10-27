// Example using React Navigation Stack Navigator
import { createStackNavigator } from "@react-navigation/stack";
// import Mains from '../Screens/Mains';
import HomeNavigator from "./Home";
import UserNavigator from "./UserNavigator";
import AdminNavigator from "./AdminNavigator";
import WeddingNavigator from "./WeddingNavigator";
import Register from "../Screens/User/Register";
import { View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Icon
                name="home"
                style={{ position: "relative" }}
                color={color}
                size={30}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Wedding Form"
        component={WeddingNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="heart" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Calendar"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="heart" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Icon
                name="user"
                style={{ position: "relative" }}
                color={color}
                size={30}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;
