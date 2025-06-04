import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<"email" | "code" | "reset">("email");
  const [email, setEmail] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const handleSendCode = async () => {
    // Simulate checking if email exists
    const userData = await AsyncStorage.getItem("user");
    if (!userData) {
      Alert.alert("No account", "No user found.");
      return;
    }
    const { email: storedEmail } = JSON.parse(userData);
    if (email !== storedEmail) {
      Alert.alert("Not found", "Email not registered.");
      return;
    }
    const code = generateCode();
    setSentCode(code);
    // Simulate sending code (show in alert for demo)
    Alert.alert("Verification Code", `Your code is: ${code}`);
    setStep("code");
  };

  const handleVerifyCode = () => {
    if (inputCode === sentCode) {
      setStep("reset");
    } else {
      Alert.alert("Invalid code", "The code you entered is incorrect.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Required", "Please enter a new password.");
      return;
    }
    // Update password in AsyncStorage
    const userData = await AsyncStorage.getItem("user");
    if (!userData) return;
    const user = JSON.parse(userData);
    user.password = newPassword;
    await AsyncStorage.setItem("user", JSON.stringify(user));
    Alert.alert("Success", "Password updated. Please log in.");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/login")}>
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>
      {step === "email" && (
        <>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendCode}>
            <Text style={styles.buttonText}>Send Code</Text>
          </TouchableOpacity>
        </>
      )}
      {step === "code" && (
        <>
          <Text style={styles.title}>Enter Verification Code</Text>
          <TextInput
            placeholder="4-digit code"
            value={inputCode}
            onChangeText={setInputCode}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={4}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </>
      )}
      {step === "reset" && (
        <>
          <Text style={styles.title}>Set New Password</Text>
          <TextInput
            placeholder="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#D20A62", textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "#F5F7FF",
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D20A62",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#D20A62",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  backBtn: { marginBottom: 20 },
  backText: { color: "#D20A62", fontWeight: "bold" },
});