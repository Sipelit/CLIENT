import React, { useState } from "react";
import { SafeAreaView, Alert, View, ScrollView } from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMutation } from "@apollo/client";
import { register } from "../apollo/operations";

export function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [Register, { data }] = useMutation(register);

  const handleSignUp = async () => {
    try {
      Register({
        variables: {
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
        },
      });
      Alert.alert("Success", data.register);
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#145da0" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#ffff",
                marginBottom: 16,
              }}
            >
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
              Create new Account
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "#F3F4F6", fontSize: 14 }}>
                Join with us!
              </Text>
            </View>
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
              label="Name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              mode="outlined"
              style={{ backgroundColor: "#ffffff", marginBottom: 16 }}
              outlineColor="#E5E7EB"
              activeOutlineColor="#145da0"
              theme={{ colors: { primary: "#145da0" } }}
            />
            <TextInput
              label="Username"
              value={form.username}
              onChangeText={(text) => setForm({ ...form, username: text })}
              mode="outlined"
              style={{ backgroundColor: "#ffffff", marginBottom: 16 }}
              outlineColor="#E5E7EB"
              activeOutlineColor="#145da0"
              theme={{ colors: { primary: "#145da0" } }}
            />
            <TextInput
              label="Email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              keyboardType="email-address"
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
              secureTextEntry={true}
              mode="outlined"
              style={{ backgroundColor: "#ffffff", marginBottom: 24 }}
              outlineColor="#E5E7EB"
              activeOutlineColor="#145da0"
              theme={{ colors: { primary: "#145da0" } }}
            />

            <Button
              mode="contained"
              onPress={handleSignUp}
              style={{
                paddingVertical: 6,
                backgroundColor: "#145da0",
                borderRadius: 12,
              }}
              labelStyle={{
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Register
            </Button>
          </Surface>

          {/* Already have an account? */}
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
                marginTop: 8,
              }}
            >
              <Text style={{ color: "#F3F4F6", fontSize: 14 }}>
                Already have an account?
              </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate("LoginScreen")}
                labelStyle={{
                  color: "#F3F4F6",
                  fontSize: 14,
                  fontWeight: "700",
                  marginTop: 10,
                }}
              >
                Login
              </Button>
            </View>
            <Text style={{ fontSize: 12, color: "#fff" }}>
              <AntDesign name="copyright" size={10} color="white" /> 2024
              Sipelit. All Rights Reserved
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
