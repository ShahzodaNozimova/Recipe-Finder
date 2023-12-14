import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { Input, Button } from "native-base";
import {MAIN_URL} from '@env'
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const ProfileUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editable, setEditable] = useState(false);
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const navigation = useNavigation();


  // Function to fetch user details
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/profile/update/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUsername(userData.username);
        setEmail(userData.email);
      } else {
        Alert.alert('Error', 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEdit = () => {
    setEditable(true);  
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/profile/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });

      if (response.ok) {
        setEditable(false);
        Alert.alert('Success', 'Profile updated successfully');
        navigation.navigate('Login')
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={{ padding: 20, display: 'flex', rowGap: 15 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        User Profile
      </Text>
      <Input
        disabled={!editable}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={{ marginBottom: 10 }}
      />
      <Input
        disabled={!editable}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{ marginBottom: 10 }}
      />
      {!editable ? (
        <Button onPress={handleEdit} block>
          <Text style={{ color: "white" }}>Edit</Text>
        </Button>
      ) : (
        <Button onPress={handleSave} success block>
          <Text style={{ color: "white" }}>Save</Text>
        </Button>
      )}
    </View>
  );
};

export default ProfileUser;
