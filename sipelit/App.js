import React, { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SecureStore from "expo-secure-store";
import { ApolloProvider } from "@apollo/client";

import { client } from "./apollo/config";
import { AuthContext } from "./contexts/authContex";

import { HomeScreen } from "./screens/Homescreen";
import { CreateTransactionScreen } from "./screens/CreateTransactionScreen";
import { AssignPeopleScreen } from "./screens/AssignPeopleScreen";
import { ReceiptScreen } from "./screens/ReceiptScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { LoginScreen } from "./screens/LoginScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="CreateTransactionScreen"
        component={CreateTransactionScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AssignPeopleScreen"
        component={AssignPeopleScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ReceiptScreen"
        component={ReceiptScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
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
  const [isLogin, setIsLogin] = useState(false);

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    setIsLogin(!!token);
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin }}>
      <ApolloProvider client={client}>
        <PaperProvider>
          <NavigationContainer>
            {isLogin ? (
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
