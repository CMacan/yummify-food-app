import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Animation for loading bar
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate loading bar
    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => setLoading(false));
  }, [loadingAnim]);

  const handleLogin = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");

      if (!userData) {
        Alert.alert("No account", "Please register first.");
        return;
      }

      const { email: storedEmail, password: storedPassword } = JSON.parse(userData);

      if (email === storedEmail && password === storedPassword) {
        router.replace("/menu");
      } else {
        Alert.alert("Invalid login", "Incorrect email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={{ alignItems: "center" }}>
          <View style={{ position: "relative", marginBottom: 24, width: 220, height: 180, justifyContent: "center", alignItems: "center" }}>
            <Image
              source={require("../assets/images/yummify.png")}
              style={{
                width: 320,
                height: 200,
                alignSelf: "center",
                zIndex: 1,
                position: "absolute",
                top: 70,
              }}
              resizeMode="contain"
            />
            <Image
              source={require("../assets/images/hand-logo.png")}
              style={{
                width: 250,
                height: 250,
                alignSelf: "center",
                zIndex: 2,
                position: "absolute",
                top: -70,
              }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.loadingBarBg}>
            <Animated.View
              style={[
                styles.loadingBar,
                {
                  width: loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back you’ve been missed!</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <Link href="/register">
        <Text style={styles.link}>Create new account</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#D70F64",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBarBg: {
    width: 200,
    height: 14,
    backgroundColor: "#fff",
    borderColor: "#00000033",
    borderWidth: 1,
    borderRadius: 7,
    overflow: "hidden",
    marginTop: 36,
  },
  loadingBar: {
    height: 14,
    backgroundColor: "#D70F64",
    borderRadius: 7,
  },
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#D20A62", textAlign: "center" },
  subtitle: { textAlign: "center", fontSize: 16, marginBottom: 20 },
  input: {
    backgroundColor: "#F5F7FF",
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D20A62",
    marginBottom: 12,
  },
  forgot: { alignSelf: "flex-end", color: "#D20A62", marginBottom: 20 },
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
