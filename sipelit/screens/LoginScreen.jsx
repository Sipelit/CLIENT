import React, { useContext, useState } from "react";
import {
  Button,
  StyleSheet,
  SafeAreaView,
  TextInput,
  View,
  Alert,
  Text,
} from "react-native";
import { Link } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../contex/authContex";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../apollo/operations";

// const LOGIN = gql`

// `

export function LoginScreen() {
  const [loginUser] = useMutation(LOGIN);
  const { setIsLogin } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const { data } = await loginUser({
        variables: {
          body: form,
        },
      });

      console.log(form);

      const token = data.login.accessToken;
      await SecureStore.setItemAsync("accessToken", token);

      setIsLogin(true);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#145da0" }}>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "#145da0",
            textAlign: "center",
          }}
        >
          Welcome Back
        </Text>
        <Text style={{ fontSize: 16, paddingBottom: 20 }}>
          sign in to continue
        </Text>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setForm({ ...form, email: text })}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry={true}
        />
      </View>
      <View style={{ marginBottom: 10, paddingTop: 20 }}>
        <Button onPress={handleLogin} title="Login" />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text>Don't have an account?</Text>
        <Link to="/Register"> Register</Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 35,
    alignItems: "center",
  },
  input: {
    height: 50,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
  },
});
