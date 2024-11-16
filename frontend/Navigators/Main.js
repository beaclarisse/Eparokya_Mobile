import React from "react";
import { Animated, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import UserNavigator from "./UserNavigator";
import Home from "./Home";
import WeddingNavigator from "./WeddingNavigator";

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ name, color, size, style, focused }) => {
  const scale = new Animated.Value(1);

  React.useEffect(() => {
    Animated.timing(scale, {
      toValue: focused ? 1.5 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale }],
          justifyContent: "center",
          alignItems: "center",
          borderWidth: focused ? 2 : 0,
          borderColor: color,
          borderRadius: 70,
          padding: 5,
        },
      ]}
    >
      <Icon name={name} color={color} size={size} />
    </Animated.View>
  );
};

const Main = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size, focused }) => (
        <TabBarIcon
          name={route.name === "Home" ? "home" : "user"}
          color={color}
          size={size}
          focused={focused}
        />
      ),
      tabBarShowLabel: false,
    })}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />

    <Tab.Screen
      name="Forms"
      component={WeddingNavigator}
      options={{ headerShown: false }}
    />

    <Tab.Screen
      name="Profile"
      component={UserNavigator}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

export default Main;
