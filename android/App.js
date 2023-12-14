import React from "react";
import {
  Text,
  Link,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Box,
} from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./components/RegisterScreen";
import ProfileUser from "./components/ProfileUser";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/Homepage";
import MainPage from "./components/Tab";
import EditRecipeScreen from "./components/EditRecipeScreen";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};
const Stack = createStackNavigator();
// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={MainPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditRecipeScreen"
              component={EditRecipeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="ProfileUser" component={ProfileUser} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
