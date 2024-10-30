import { Link } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

import React from "react";
import { StyleSheet, SafeAreaView, TextInput, View, Text } from "react-native";
import { Button } from "react-native";

// const REGISTER = gql`

// `

export default function Register({ navigation }) {
  //   const [name, setName] = useState("");
  //   const [username, setUsername] = useState("");
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");

  //   const [registerUser] = useMutation(REGISTER, {
  //     onCompleted: (data) => {
  //       Alert.alert("Success", data.register);
  //       navigation.navigate("login");
  //     },
  //     onError: (error) => {
  //       Alert.alert("Error", error.message);
  //     },
  //   });

  //   const handleSignUp = () => {
  //     registerUser({
  //       variables: {
  //         body: {
  //           name,
  //           username,
  //           email,
  //           password,
  //         },
  //       },
  //     });
  //   };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#145da0"}}>
    <View style={styles.container}>
      <Text style={styles.title}>Create new Account</Text>
      <View style={{ alignItems: "center" }}>
        <Text style={{ flexDirection: "row", paddingBottom: 28, color:"#fff"}}>
          <Text>Already have an account?</Text>
          <Link to="/Login"> Login</Link>
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Name"
        // value={name}
        // onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        // value={username}
        // onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        // value={email}
        // onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        // value={password}
        // onChangeText={setPassword}
        secureTextEntry={true}
      />
      <View style={{ marginBottom: 10, paddingTop: 28 }}>
        <Button title="Register" onPress={() => ("Registered!")} />
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 12, color: "#fff"}}>
          <AntDesign name="copyright" size={10} color="white" /> 2024 Sipelit.
          All Rights Reserved
        </Text>
      </View>
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
},
title: {
  fontSize: 32,
  fontWeight: "bold",
  marginBottom: 5,
  color: "#fff",
  textAlign: "center",
},
input: {
  height: 50,
  marginVertical: 8,
  borderWidth: 1,
  borderColor: "lightgray",
  padding: 10,
  backgroundColor: "white",
  borderRadius: 8,
  width: "100%",
},
});