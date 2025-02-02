import React, { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SecureStore from "expo-secure-store";
import { ApolloProvider, useQuery } from "@apollo/client";

import { client } from "./apollo/config";
import { AuthContext } from "./contexts/authContext";

import { HomeScreen } from "./screens/Homescreen";
import { CreateTransactionScreen } from "./screens/CreateTransactionScreen";
import { AssignPeopleScreen } from "./screens/AssignPeopleScreen";
import { ReceiptScreen } from "./screens/ReceiptScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { LoginScreen } from "./screens/LoginScreen";
import OcrScreen from "./screens/OCRScreen";
import { getUserById } from "./apollo/userQuery";

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTransactionScreen"
        component={CreateTransactionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AssignPeopleScreen"
        component={AssignPeopleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReceiptScreen"
        component={ReceiptScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OCRScreen"
        component={OcrScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) setIsLoggedIn(true);
    const userId = await SecureStore.getItemAsync("userId");
    if (userId) setCurrentUser(JSON.parse(userId));
  };

  useEffect(() => {
    checkToken();
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser }}
    >
      <ApolloProvider client={client}>
        <PaperProvider>
          <NavigationContainer>
            {isLoggedIn ? (
              <Stack.Navigator>
                <Stack.Screen
                  name="BottomTab"
                  component={BottomTab}
                  options={{ title: "Sipelit", headerShown: false }}
                />
              </Stack.Navigator>
            ) : (
              <AuthStack />
            )}
          </NavigationContainer>
        </PaperProvider>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}
