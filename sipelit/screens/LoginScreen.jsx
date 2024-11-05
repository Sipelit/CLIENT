import React, { useState, useContext } from "react";
import { SafeAreaView, Alert, View } from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../contexts/authContext";
import { login } from "../apollo/operations";

export function LoginScreen({ navigation }) {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [Login, { loading }] = useMutation(login);

  const handleLogin = async () => {
    try {
      const { data } = await Login({
        variables: {
          username: form.username,
          password: form.password,
        },
      });

      if (data && data.login && data.login.token) {
        const token = data.login.token;
        await SecureStore.setItemAsync("access_token", token);

        const user = {
          username: data.login.username,
          _id: data.login._id,
        };

        await SecureStore.setItemAsync("userId", JSON.stringify(user));
        setIsLoggedIn(true);
      } else {
        Alert.alert("Login Failed", "Unexpected response from server");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#145da0" }}>
      <View
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}
      >
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#ffff" }}>
            Sipelit.
          </Text>
          <Text
            style={{
              color: "#F3F4F6",
              fontSize: 28,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            Welcome Back!
          </Text>
          <Text style={{ color: "#F3F4F6", fontSize: 16, opacity: 0.8 }}>
            Sign in to continue
          </Text>
        </View>

        <Surface
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 24,
            padding: 24,
            elevation: 4,
          }}
        >
          <TextInput
            label="Username"
            value={form.username}
            onChangeText={(text) => setForm({ ...form, username: text })}
            keyboardType="text"
            mode="outlined"
            style={{ backgroundColor: "#ffffff", marginBottom: 16 }}
            outlineColor="#E5E7EB"
            activeOutlineColor="#145da0"
            theme={{ colors: { primary: "#145da0" } }}
          />

          <TextInput
            label="Password"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry
            mode="outlined"
            style={{ backgroundColor: "#ffffff", marginBottom: 24 }}
            outlineColor="#E5E7EB"
            activeOutlineColor="#145da0"
            theme={{ colors: { primary: "#145da0" } }}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={{
              paddingVertical: 6,
              backgroundColor: "#145da0",
              borderRadius: 12,
            }}
            labelStyle={{ fontSize: 16, fontWeight: "600" }}
          >
            Sign In
          </Button>
        </Surface>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <Text style={{ color: "#F3F4F6", fontSize: 14 }}>
            Don't have an account?
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate("RegisterScreen")}
            style={{
              marginLeft: -8,
            }}
            labelStyle={{
              color: "#F3F4F6",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            Register
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
