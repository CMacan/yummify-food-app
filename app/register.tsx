import { Link, useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      Alert.alert("Missing fields", "Please fill out all fields.");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    // Save credentials
    try {
      await AsyncStorage.setItem("user", JSON.stringify({ email, password }));
      Alert.alert("Success", "Account created successfully.");
      router.replace("/login");
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Create an account so you can explore all the existing jobs</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <Link href="/login">
        <Text style={styles.link}>Already have an account</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#D20A62", textAlign: "center" },
  subtitle: { textAlign: "center", fontSize: 14, marginBottom: 20 },
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
  link: { textAlign: "center", color: "gray", textDecorationLine: "underline" },
});
