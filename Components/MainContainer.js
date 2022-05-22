import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./Context";

// Screens
import HomeScreen from "./HomeScreen";
import FollowersScreen from "./FollowersScreen";
import SettingsScreen from "./SettingsScreen";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";

//Screen names
const homeName = "Home";
const followersName = "Followers";
const settingsName = "Settings";
const Tab = createBottomTabNavigator();

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={SignIn}
      options={{ title: "Sign In" }}
    />
    <AuthStack.Screen
      name="CreateAccount"
      component={CreateAccount}
      options={{ title: "Create Account" }}
    />
  </AuthStack.Navigator>
);

const MainAppScreen = () => (
  <Tab.Navigator
    initialRouteName={homeName}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let rn = route.name;

        if (rn === homeName) {
          iconName = focused ? "home" : "home-outline";
        } else if (rn === followersName) {
          iconName = focused ? "list" : "list-outline";
        } else if (rn === settingsName) {
          iconName = focused ? "settings" : "settings-outline";
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name={homeName} component={HomeScreen} />
    <Tab.Screen name={followersName} component={FollowersScreen} />
    <Tab.Screen name={settingsName} component={SettingsScreen} />
  </Tab.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none">
    {userToken ? (
      <RootStack.Screen name="App" component={MainAppScreen} />
    ) : (
      <RootStack.Screen name="Auth" component={AuthStackScreen} />
    )}
  </RootStack.Navigator>
);

export default function MainContainer() {
  const [userToken, setUserToken] = React.useState(null);
  const { session, setSession } = React.useContext(AuthContext);

  React.useEffect(() => {
    setUserToken(supabase.auth.user());
  }, [session]);

  return (
    <NavigationContainer>
      <RootStackScreen userToken={userToken} />
    </NavigationContainer>
  );
}

// export default MainContainer;
