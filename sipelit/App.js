import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import Dashboard, { HomeScreen, ProfileScreen } from "./screens/Homescreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Dashboard}
            options={{ title: "Sipelit" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
