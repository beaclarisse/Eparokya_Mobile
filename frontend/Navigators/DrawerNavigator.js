import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from "@expo/vector-icons";
//import { MaterialCommunityIcons } from 'react-native-vector-icons';
import {
  NativeBaseProvider,
  Button,
  Box,
  Pressable,
  VStack,
  Text,
  HStack,
  Divider,
  Icon,
} from "native-base";
import Login from "../Screens/User/Login";
import Main from "./Main";
import AdminNavigator from "./AdminNavigator";
import { useDispatch, useSelector } from "react-redux";
import UserNavigator from "./UserNavigator";
import CalendarComponent from "../Screens/User/Calendar";
import Wedding from "../Screens/User/Wedding/WeddingForm";
import Announcement from "../Screens/User/Announcement/AnnouncementPage";
import Profile from "../Screens/User/Profile";

const Drawer = createDrawerNavigator();

const getIcon = (screenName) => {
  switch (screenName) {
    case "Home":
      return "home";
    case "Calendar":
      return "calendar";
    case "Wedding":
      return "file-document";
    case "Home":
      return "Admin Dashboard";
    case "Profile":
      return "account";
    case "Logout":
      return "logout";
    default:
      return undefined;
  }
};

function CustomDrawerContent(props) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack space="0" my="0" mx="0" bg="#154314">
        <VStack divider={<Divider />} space="0">
          <VStack space="3">
            {props.state.routeNames.map((name, index) => (
              <Pressable
                key={index} 
                px="5"
                py="3"
                rounded="md"
                bg={index === props.state.index ? "#b3cf99" : "transparent"}
                onPress={() => {
                  props.navigation.navigate(name);
                }}
              >
                <HStack space="7" alignItems="center">
                  <Icon
                    color={index === props.state.index ? "white" : "gray.500"}
                    size="5"
                    as={<MaterialCommunityIcons name={getIcon(name)} />}
                  />
                  <Text
                    fontWeight="500"
                    color={index === props.state.index ? "white" : "white"}
                    fontFamily="Roboto"
                    fontSize="md"
                  >
                    {name}
                  </Text>
                </HStack>
              </Pressable>
            ))}
            <Pressable
              px="5"
              py="3"
              rounded="md"
              bg="transparent"
              onPress={() => props.navigation.navigate("Login")}
            >
              <HStack space="7" alignItems="center">
                <Icon
                  color="white"
                  size="5"
                  as={<MaterialCommunityIcons name="account" />}
                />
                <Text
                  fontWeight="500"
                  color="white"
                  fontFamily="Roboto"
                  fontSize="md"
                >
                  Login
                </Text>
              </HStack>
            </Pressable>

            <Pressable
              px="5"
              py="3"
              rounded="md"
              bg="transparent"
              onPress={handleLogout}
            >
              <HStack space="7" alignItems="center">
                <Icon
                  color="white"
                  size="5"
                  as={<MaterialCommunityIcons name="logout" />}
                />
                <Text
                  fontWeight="500"
                  color="white"
                  fontFamily="Roboto"
                  fontSize="md"
                >
                  Logout
                </Text>
              </HStack>
            </Pressable>
          </VStack>
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}


const DrawerNavigator = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <Box safeArea flex={1} bg="#154314" paddingTop={StatusBar.currentHeight || 0}>
      <StatusBar backgroundColor="#154314" style="light" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <Button onPress={() => navigation.toggleDrawer()} colorScheme="white">
              <MaterialCommunityIcons name="menu-open" size={24} color="black" />
            </Button>
          ),
          drawerStyle: {
            backgroundColor: '#154314',
            width: '80%',
          },
        })}
      >
        <Drawer.Screen
          name="Home"
          options={{
            drawerLabel: "Home",
          }}
          component={Main}
        />
        <Drawer.Screen
          name="Calendar"
          options={{
            drawerLabel: "Calendar",
          }}
          component={CalendarComponent}
        />
        <Drawer.Screen
          name="Wedding"
          component={Wedding}
          initialParams={{ screen: "Wedding" }}
        />
        {userInfo?.isAdmin && (
          <Drawer.Screen
            name="Admin Dashboard"
            component={AdminNavigator}
            initialParams={{ screen: "Admin" }}
          />
        )}
        <Drawer.Screen name="Profile" component={Profile} />
      </Drawer.Navigator>
    </Box>
  );
};




export default DrawerNavigator;
