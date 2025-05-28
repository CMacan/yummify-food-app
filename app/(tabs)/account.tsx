import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AccountScreen() {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Load user info
    AsyncStorage.getItem("user").then(data => {
      if (data) {
        const { email } = JSON.parse(data);
        setEmail(email);
        setNewEmail(email);
      }
    });
  }, []);

  const handleUpdateInfo = async () => {
    if (!newEmail) {
      Alert.alert("Missing email", "Email cannot be empty.");
      return;
    }
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        await AsyncStorage.setItem("user", JSON.stringify({ ...user, email: newEmail }));
        setEmail(newEmail);
        Alert.alert("Success", "Email updated.");
      }
    } catch {
      Alert.alert("Error", "Could not update email.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Password mismatch", "New passwords do not match.");
      return;
    }
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.password !== currentPassword) {
          Alert.alert("Incorrect password", "Current password is incorrect.");
          return;
        }
        await AsyncStorage.setItem("user", JSON.stringify({ ...user, password: newPassword }));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        Alert.alert("Success", "Password changed.");
      }
    } catch {
      Alert.alert("Error", "Could not change password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Information</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={newEmail}
        onChangeText={setNewEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateInfo}>
        <Text style={styles.buttonText}>Update Email</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { marginTop: 32 }]}>Change Password</Text>
      <TextInput
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", color: "#D20A62", marginBottom: 12 },
  label: { fontWeight: "600", marginBottom: 4 },
  input: {
    backgroundColor: "#F5F7FF",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D20A62",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#D20A62",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});