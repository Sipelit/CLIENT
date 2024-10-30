import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import Dashboard, { HomeScreen, ProfileScreen } from "./screens/Homescreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";
import { AuthContext } from "./contex/authContex";
import * as SecureStore from "expo-secure-store"
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
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
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {isLogin ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={Dashboard}
                  options={{ title: "Sipelit" }}/>
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
    </AuthContext.Provider>
  );
}
