import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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


const Drawer = createDrawerNavigator();

const getIcon = (screenName) => {
  switch (screenName) {
    case "Home":
      return "home";
    case "Calendar":
      return "archive";
    case "Wedding":
      return "archive";
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
      <VStack space="1" my="0" mx="0" bg="#154314">
        <VStack divider={<Divider />} space="4">
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
              onPress={() => props.navigation.navigate("Profile")}
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
                  Profile
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
    <Box safeArea flex={1}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        initialParams={{ screen: "Wedding" }} // Initial params can be accessed in Main if needed
      />
        {userInfo?.isAdmin && (
          <Drawer.Screen
            name="Admin Dashboard"
            component={AdminNavigator}
            initialParams={{ screen: "Admin" }}
          />
        )}
        <Drawer.Screen name="Profile" component={Main} />
      </Drawer.Navigator>
    </Box>
  );
};

export default DrawerNavigator;
