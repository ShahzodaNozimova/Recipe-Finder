import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  searchText,
  handleSearch,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";

import RecipeList from "./RecipeList";
import AddRecipe from "./AddRecipe";
import HomePage from "./Homepage";
import CategoryAdd from "./CategoryAdd";
import Categories from "./Categories";

const Stack = createStackNavigator();

const CustomHeader = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  return (
    <View
      style={{
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <TouchableOpacity onPress={() => console.log("hhh")}>
        <Icon name="settings" size={30} color="black" />
      </TouchableOpacity>
      <TextInput
        style={{
          fontSize: 18,
          fontWeight: "bold",
          flex: 1,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 5,
          marginLeft: 40,
          marginRight: 40,
        }}
        placeholder="Search"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        onSubmitEditing={handleSearch}
      />

      <TouchableOpacity onPress={() => navigation.navigate("ProfileUser")}>
        <Icon name="person" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

// Main Tab Navigator with screens
const Tab = createBottomTabNavigator();

const MainPage = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ header: (props) => <CustomHeader {...props} /> }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "RecipeList") {
            iconName = focused ? "ios-list-circle" : "ios-list";
          } else if (route.name === "HomePage") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "AddRecipe") {
            iconName = focused ? "ios-add-circle" : "ios-add";
          } else if (route.name === "Categories") {
            iconName = focused ? "ios-folder-open" : "ios-folder";
          } else if (route.name === "CategoryAdd") {
            iconName = focused ? "ios-add-circle-outline" : "ios-add-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "blue",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="RecipeList"
        component={RecipeList}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Categories"
        component={Categories}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="CategoryAdd"
        component={CategoryAdd}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AddRecipe"
        component={AddRecipe}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default MainPage;
