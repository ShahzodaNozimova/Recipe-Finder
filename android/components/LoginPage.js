// @ts-ignore

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MAIN_URL } from "@env";  
import { setAccessToken } from "../src/redux/actions/authActions";
import { useDispatch } from 'react-redux';

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  console.log(MAIN_URL);

  const handleLogin = async () => {
    let response;
    try {
      response = await fetch(`${MAIN_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const loginErrorData = await response.json();
        console.log(loginErrorData)
        Alert.alert('Login Failed', loginErrorData?.detail)
      } else {
        const data = await response.json();
        dispatch(setAccessToken(data.tokens.access))
        navigation.navigate('Home')
      }  
    } catch (error) {
      // Handle fetch errors
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password");
  };

  const handleRegister = () => {
    // Navigate to the Register screen when the Register button is pressed
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.registerLink}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  forgotPassword: {
    marginTop: 10,
    textDecorationLine: "underline",
    color: "blue",
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default LoginPage;
