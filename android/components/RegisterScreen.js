// RegisterScreen.js

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

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      // const data = await response.json();
      // console.log(data)
      if (response.ok) {
        navigation.goBack();
      } else {
        const errorData = await response.json();

        if (response.status === 400 && errorData) {
          const errors = Object.entries(errorData).map(
            // @ts-ignore
            ([key, value]) => `${key}: ${value.join(", ")}`
          );
          Alert.alert("Registration Failed", errors.join("\n"));
        } else {
          throw new Error(errorData.detail || "An error occurred");
        }
      }
    } catch (error) {
      const data = await response.json();
      console.log(data);

      // Handle fetch errors
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.goBackLink}>Back to Login</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
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
  goBackLink: {
    marginTop: 5,
    marginBottom: 15,
    color: "blue",
    textDecorationLine: "underline",
  },
  registerButton: {
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
});

export default RegisterScreen;
