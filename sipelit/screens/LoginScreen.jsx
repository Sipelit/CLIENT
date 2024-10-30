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
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from "../contex/authContex";

// const LOGIN = gql`

// `

export default function Login() {
    // const {setIsLogin} = useContext(AuthContext)
    // const [email, setEmail]= useState("")
    // const [password, setPassword] = useState("")

    // const [loginUser] = useMutation(LOGIN)

    // const handleLogin = async ()=> {
    //     try {
    //         const result =  await loginUser({
    //             variables: {
    //                 body: {
    //                     email,
    //                     password
    //                 }
    //             }
    //         })
    //         const token = result.data.login.accessToken
    //         await SecureStore.setItemAsync("accessToken", token)
    //         setIsLogin(true)
    //     } catch (error) {
    //         Alert.alert(error.message)
    //     }
    // }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#145da0"}}>
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
        <Text style={{fontSize: 16, paddingBottom: 20}}>sign in to continue</Text>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Email"
        //   onChangeText={setEmail}
        //   value={email}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
        //   onChangeText={setPassword}
        //   value={password}
          secureTextEntry={true}
        />
      </View>
      <View style={{marginBottom: 10, paddingTop: 20}}>
      <Button title="Login"/>
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
    alignItems: "center"
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
