import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { HomeScreen } from "./screens/Homescreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CreateTransactionScreen } from "./screens/CreateTransactionScreen";
import { AssignPeopleScreen } from "./screens/AssignPeopleScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export function BottomTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="homescreen" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="transaction" component={CreateTransactionScreen} options={{ headerShown: false }} />
      <Tab.Screen name="AssignPeopleScreen" component={AssignPeopleScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={BottomTab}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}