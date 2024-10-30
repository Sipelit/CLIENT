import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "./screens/Homescreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CreateTransactionScreen } from "./screens/CreateTransactionScreen";
import { AssignPeopleScreen } from "./screens/AssignPeopleScreen";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo/config";
import { ReceiptScreen } from "./screens/ReceiptScreen";
import { useEffect, useState } from "react";
import { AuthContext } from "./contex/authContex";
import Register from "./screens/RegisterScreen";
import Login from "./screens/LoginScreen";
import * as SecureStore from "expo-secure-store";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export function BottomTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="homescreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="transaction"
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

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      setIsLogin(true);
    }
  };
  useEffect(() => {
    checkToken();
  }, []);
  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin }}>
      <ApolloProvider client={client}>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {isLogin ? (
                <>
                  <Stack.Screen
                    name="Home"
                    component={BottomTab}
                    options={{ title: "Sipelit" }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen name="Register" component={Register} />
                  <Stack.Screen name="Login" component={Login} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}
